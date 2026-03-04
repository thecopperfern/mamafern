import { NextResponse } from "next/server";

/**
 * Content Activity API — fetches recent commits to the content/ directory
 * from GitHub. Uses the GitHub REST API with no additional dependencies.
 */
export async function GET() {
  const repo = "thecopperfern/mamafern";
  const url = `https://api.github.com/repos/${repo}/commits?path=content/&per_page=20`;

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "mamafern-cms",
    };

    // Use GitHub token if available for higher rate limits
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const commits = await res.json();

    const activity = commits.map(
      (c: {
        sha: string;
        commit: {
          message: string;
          author: { name: string; date: string };
        };
      }) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0], // First line only
        author: c.commit.author.name,
        date: c.commit.author.date,
      })
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Content activity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
