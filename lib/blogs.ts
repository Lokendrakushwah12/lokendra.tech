import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface BlogFrontmatter {
  title: string;
  description: string;
  date?: string;
  excerpt?: string;
}

export interface BlogPost {
  slug: string[];
  slugPath: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

const BLOGS_DIRECTORY = path.join(process.cwd(), "content", "blogs");
const MDX_EXTENSION = ".mdx";

function collectMdxFiles(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(MDX_EXTENSION)) {
      files.push(fullPath);
    }
  }

  return files;
}

function filePathToSlug(filePath: string): string[] {
  const relativePath = path
    .relative(BLOGS_DIRECTORY, filePath)
    .replaceAll("\\", "/");
  const withoutExtension = relativePath.slice(0, -MDX_EXTENSION.length);
  const parts = withoutExtension.split("/").filter(Boolean);

  if (parts[parts.length - 1] === "index") {
    return parts.slice(0, -1);
  }

  return parts;
}

function sortByDateDescending(a: BlogPost, b: BlogPost): number {
  const timeA = Date.parse(a.frontmatter.date ?? "");
  const timeB = Date.parse(b.frontmatter.date ?? "");

  const isValidA = !Number.isNaN(timeA);
  const isValidB = !Number.isNaN(timeB);

  if (isValidA && isValidB) {
    return timeB - timeA;
  }

  if (isValidA) {
    return -1;
  }

  if (isValidB) {
    return 1;
  }

  return a.slugPath.localeCompare(b.slugPath);
}

function parseBlogFile(filePath: string): BlogPost | null {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const slug = filePathToSlug(filePath);

  if (slug.length === 0) {
    return null;
  }

  return {
    slug,
    slugPath: slug.join("/"),
    frontmatter: data as BlogFrontmatter,
    content,
  };
}

function resolveBlogFilePath(slug: string[]): string | null {
  if (slug.length === 0) {
    return null;
  }

  const indexedPath = path.join(BLOGS_DIRECTORY, ...slug, "index.mdx");
  if (fs.existsSync(indexedPath)) {
    return indexedPath;
  }

  const directFilePath = `${path.join(BLOGS_DIRECTORY, ...slug)}.mdx`;
  if (fs.existsSync(directFilePath)) {
    return directFilePath;
  }

  return null;
}

export function getAllBlogs(): BlogPost[] {
  const files = collectMdxFiles(BLOGS_DIRECTORY);
  const blogs = files
    .map((filePath) => parseBlogFile(filePath))
    .filter((blog): blog is BlogPost => blog !== null);

  return blogs.sort(sortByDateDescending);
}

export function getAllBlogSlugs(): string[][] {
  return getAllBlogs().map((blog) => blog.slug);
}

export function getBlogBySlug(slug: string[]): BlogPost | null {
  const filePath = resolveBlogFilePath(slug);

  if (!filePath) {
    return null;
  }

  return parseBlogFile(filePath);
}
