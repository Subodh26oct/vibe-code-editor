import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

/**
 * GET /api/template/[id]/lockfile
 *
 * Returns the package-lock.json content for a given playground's template.
 * This endpoint is called by the WebContainer preview to mount the lockfile
 * before running `npm ci`, which is significantly faster than `npm install`
 * because it skips dependency resolution.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({ where: { id } });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templateRelPath = templatePaths[templateKey];

  if (!templateRelPath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  const lockfilePath = path.join(
    process.cwd(),
    templateRelPath,
    "package-lock.json"
  );

  try {
    const content = await fs.readFile(lockfilePath, "utf8");
    return new Response(content, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Lockfile not found for this template — that's fine, caller will fall back to npm install
    return Response.json(
      { error: "package-lock.json not found for this template" },
      { status: 404 }
    );
  }
}
