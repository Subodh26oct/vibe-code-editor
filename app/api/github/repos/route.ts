import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated with GitHub. Please sign in with GitHub first." },
        { status: 401 }
      );
    }

    const accessToken = session.user.accessToken;

    // Fetch user's repos (up to 100, sorted by most recently pushed)
    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=pushed&direction=desc&type=all",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "vibe-code-editor",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "GitHub token expired. Please sign out and sign in again with GitHub." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch repositories (${response.status})` },
        { status: response.status }
      );
    }

    const repos = await response.json();

    // Return a simplified list
    const simplified = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      private: repo.private,
      default_branch: repo.default_branch,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
      },
    }));

    return NextResponse.json(simplified);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching repositories" },
      { status: 500 }
    );
  }
}
