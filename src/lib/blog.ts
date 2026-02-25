import fs from "fs";
import path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  featuredImage: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

// ─── Frontmatter Parser ─────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string | string[]>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle arrays: [tag1, tag2]
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
    } else {
      // Strip surrounding quotes
      value = value.replace(/^["']|["']$/g, "");
      meta[key] = value;
    }
  }

  return { meta, content: match[2].trim() };
}

// ─── Core Functions ──────────────────────────────────────────────────────────

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { meta, content } = parseFrontmatter(raw);
    const slug = file.replace(".mdx", "");

    return {
      title: (meta.title as string) || slug,
      description: (meta.description as string) || "",
      date: (meta.date as string) || "",
      slug: (meta.slug as string) || slug,
      tags: (Array.isArray(meta.tags) ? meta.tags : []) as string[],
      featuredImage: (meta.featuredImage as string) || "/og-image.svg",
      content,
    };
  });

  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);

  return {
    title: (meta.title as string) || slug,
    description: (meta.description as string) || "",
    date: (meta.date as string) || "",
    slug: (meta.slug as string) || slug,
    tags: (Array.isArray(meta.tags) ? meta.tags : []) as string[],
    featuredImage: (meta.featuredImage as string) || "/og-image.svg",
    content,
  };
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): BlogPost[] {
  const all = getAllPosts();
  return all
    .filter((p) => p.slug !== currentSlug && p.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}

export function getAllTags(): string[] {
  const all = getAllPosts();
  const tagSet = new Set<string>();
  all.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// ─── Markdown to HTML (simple) ───────────────────────────────────────────────

export function markdownToHtml(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Paragraphs (lines that aren't already wrapped)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      )
        return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  return html;
}
