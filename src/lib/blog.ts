import fs from "fs";
import path from "path";
import { marked, Renderer } from "marked";

// Configure marked for GFM (GitHub Flavored Markdown)
marked.setOptions({ gfm: true, breaks: false });

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  featuredImage: string;
  author: string;
  readTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

// ─── Frontmatter Parser ─────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string | string[]>; content: string } {
  // Normalize line endings (Keystatic on Windows may write \r\n)
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: normalized };

  const meta: Record<string, string | string[]> = {};
  const lines = match[1].split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1 || line.startsWith(" ") || line.startsWith("\t")) {
      i++;
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle inline arrays: [tag1, tag2]
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      i++;
      continue;
    }

    // Handle YAML block arrays (Keystatic format):
    //   tags:
    //     - tag1
    //     - tag2
    if (value === "" && i + 1 < lines.length && lines[i + 1].match(/^\s+-\s/)) {
      const items: string[] = [];
      i++;
      while (i < lines.length && lines[i].match(/^\s+-\s/)) {
        items.push(lines[i].replace(/^\s+-\s*/, "").replace(/^["']|["']$/g, ""));
        i++;
      }
      meta[key] = items;
      continue;
    }

    // Strip surrounding quotes from scalar values
    value = value.replace(/^["']|["']$/g, "");
    meta[key] = value;
    i++;
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
      author: (meta.author as string) || "Mama Fern Team",
      readTime: estimateReadTime(content),
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
    author: (meta.author as string) || "Mama Fern Team",
    readTime: estimateReadTime(content),
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

/**
 * Returns the previous and next posts relative to the given slug.
 * Posts are ordered by date descending (newest first), so "previous"
 * is the older post and "next" is the newer post.
 */
export function getAdjacentPosts(slug: string): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  // Posts are sorted newest-first: index+1 is older (prev), index-1 is newer (next)
  const prev = index < all.length - 1 ? all[index + 1] : null;
  const next = index > 0 ? all[index - 1] : null;

  return { prev, next };
}

/**
 * Returns all tags with their post counts, sorted by count descending.
 */
export function getTagCounts(): { tag: string; count: number }[] {
  const all = getAllPosts();
  const counts = new Map<string, number>();
  all.forEach((p) => p.tags.forEach((t) => {
    counts.set(t, (counts.get(t) || 0) + 1);
  }));
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generates a URL-friendly slug from heading text.
 * Used for both heading IDs and TOC anchor links.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Extracts H2 headings from HTML content for table of contents.
 * Returns an array of { id, text } where id matches the heading's id attribute.
 */
export function extractHeadings(html: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    // Strip any inner HTML tags to get plain text
    const text = match[2].replace(/<[^>]*>/g, "");
    headings.push({ id: match[1], text });
  }
  return headings;
}

// ─── Read Time Estimate ─────────────────────────────────────────────────────

/**
 * Estimates reading time based on ~200 words per minute.
 * Returns time in minutes (minimum 1).
 */
export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── Markdown to HTML ───────────────────────────────────────────────────────

/**
 * Converts markdown content to HTML using `marked` with GFM support.
 * Handles headings, bold, italic, links, images, blockquotes, code blocks,
 * tables, strikethrough, horizontal rules, and all standard markdown features.
 *
 * Adds id attributes to h2 headings for table of contents anchor links.
 * Pair with Tailwind's `prose` class (@tailwindcss/typography) for styling.
 */
export function markdownToHtml(md: string): string {
  const renderer = new Renderer();
  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    const id = slugify(text);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  return marked.parse(md, { async: false, renderer }) as string;
}
