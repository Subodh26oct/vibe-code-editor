import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

interface TemplateFile {
  filename: string;
  fileExtension: string;
  content: string;
}

interface TemplateFolder {
  folderName: string;
  items: (TemplateFile | TemplateFolder)[];
}

const IGNORED_FOLDERS = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".nuxt", ".output",
  "coverage", ".cache", "__pycache__", ".vscode", ".idea", ".turbo",
  ".vercel", ".netlify", ".svelte-kit",
]);

const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "bmp", "ico", "webp", "avif", "tiff",
  "mp3", "mp4", "wav", "ogg", "webm", "avi", "mov", "flac",
  "zip", "tar", "gz", "rar", "7z", "bz2", "xz",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "woff", "woff2", "ttf", "eot", "otf",
  "exe", "dll", "so", "dylib", "bin",
  "pyc", "class", "o", "obj",
  "lock", "sqlite", "db",
]);

const MAX_FILE_SIZE = 200 * 1024; // 200KB

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const cleaned = url.trim().replace(/\/+$/, "").replace(/\.git$/, "");
  const match = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\s]+)\/([^\/\s]+)/
  );
  if (match && match[1] && match[2]) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
}

function shouldIgnorePath(filePath: string): boolean {
  const parts = filePath.split("/");
  for (const part of parts) {
    if (IGNORED_FOLDERS.has(part)) return true;
  }
  return false;
}

function isBinaryExtension(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return BINARY_EXTENSIONS.has(ext);
}

function parseFileName(name: string): { filename: string; fileExtension: string } {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) {
    return { filename: name, fileExtension: "" };
  }
  return {
    filename: name.substring(0, lastDot),
    fileExtension: name.substring(lastDot + 1),
  };
}

function buildFolderTree(
  files: { path: string; content: string }[],
  rootName: string
): TemplateFolder {
  const root: TemplateFolder = { folderName: rootName, items: [] };

  for (const file of files) {
    const parts = file.path.split("/");
    let currentFolder = root;

    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      let existingFolder = currentFolder.items.find(
        (item): item is TemplateFolder =>
          "folderName" in item && item.folderName === folderName
      );

      if (!existingFolder) {
        existingFolder = { folderName, items: [] };
        currentFolder.items.push(existingFolder);
      }
      currentFolder = existingFolder;
    }

    const fileName = parts[parts.length - 1];
    const { filename, fileExtension } = parseFileName(fileName);
    currentFolder.items.push({
      filename,
      fileExtension,
      content: file.content,
    });
  }

  return root;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'repoUrl' in request body" },
        { status: 400 }
      );
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Expected format: https://github.com/owner/repo" },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Get access token from session for authenticated requests
    const session = await auth();
    const accessToken = session?.user?.accessToken;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "vibe-code-editor",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Step 1: Get the default branch
    const repoInfoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!repoInfoRes.ok) {
      if (repoInfoRes.status === 404) {
        return NextResponse.json(
          { error: `Repository '${owner}/${repo}' not found. Make sure it exists and you have access.` },
          { status: 404 }
        );
      }
      if (repoInfoRes.status === 403) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch repository info (${repoInfoRes.status})` },
        { status: repoInfoRes.status }
      );
    }

    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch || "main";

    // Step 2: Fetch the full tree recursively
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );

    if (!treeRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch repository tree (${treeRes.status})` },
        { status: treeRes.status }
      );
    }

    const treeData = await treeRes.json();

    if (!treeData.tree || !Array.isArray(treeData.tree)) {
      return NextResponse.json(
        { error: "Invalid tree data received from GitHub" },
        { status: 500 }
      );
    }

    // Step 3: Filter to only text files we want to include
    const filesToFetch = treeData.tree.filter(
      (item: { type: string; path: string; size?: number }) => {
        if (item.type !== "blob") return false;
        if (shouldIgnorePath(item.path)) return false;
        if (isBinaryExtension(item.path)) return false;
        if (item.size && item.size > MAX_FILE_SIZE) return false;
        return true;
      }
    );

    // Step 4: Fetch file contents in batches
    const BATCH_SIZE = 20;
    const files: { path: string; content: string }[] = [];

    for (let i = 0; i < filesToFetch.length; i += BATCH_SIZE) {
      const batch = filesToFetch.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map(async (item: { path: string; size?: number }) => {
          try {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${encodeURIComponent(item.path).replace(/%2F/g, '/')}`;
            const res = await fetch(rawUrl, {
              headers: accessToken
                ? { Authorization: `Bearer ${accessToken}`, "User-Agent": "vibe-code-editor" }
                : { "User-Agent": "vibe-code-editor" },
            });

            if (!res.ok) return null;

            const content = await res.text();

            // Check for binary content (null bytes)
            if (content.includes("\0")) return null;

            return { path: item.path, content };
          } catch {
            return null;
          }
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          files.push(result.value);
        }
      }
    }

    // Step 5: Build the TemplateFolder structure
    const templateFolder = buildFolderTree(files, repo);

    return NextResponse.json(templateFolder);
  } catch (error) {
    console.error("GitHub API route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the repository" },
      { status: 500 }
    );
  }
}
