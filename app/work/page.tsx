import ClientDither from "@/components/Dither/ClientDither";
import { ArrowLeftIcon, GithubIcon, XIcon } from "@/components/icons";
import Footer from "@/components/sections/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import ImageModal from "@/components/ui/image-modal";
import userData from "@/config/userData";
import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import React from "react";

interface WorkMatter {
  title: string;
  description: string;
}

// MDX Components
const components = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-2xl font-semibold tracking-tight mb-6 text-foreground/70">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold mb-4 mt-8 text-foreground/70">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-medium tracking-tight mb-3 mt-6 text-foreground/70">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => {
    // Check if children contain block elements (like our image div)
    const hasBlockElements = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && child.type === "div"
    );

    if (hasBlockElements) {
      // If it contains block elements, render as div instead of p
      return (
        <div className="text-muted-foreground/80 mb-4 leading-relaxed">
          {children}
        </div>
      );
    }

    return (
      <p className="text-muted-foreground/80 mb-4 leading-relaxed">
        {children}
      </p>
    );
  },
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside mb-4 text-muted-foreground/80 space-y-2">
      {children}
    </ul>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-muted-foreground/80">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-medium text-foreground/70">{children}</strong>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    // Render as a fragment to avoid nesting issues
    return (
      <ImageModal
        src={src ?? ""}
        alt={alt ?? ""}
      />
    );
  },
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  ),
  hr: () => <hr className="my-8 border-t border-dashed border-border" />,
};

async function getWorkContent() {
  const filePath = path.join(process.cwd(), "content", "work.mdx");

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      frontmatter: data as WorkMatter,
      content,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const workData = await getWorkContent();

  if (!workData) {
    return {
      title: "Work Experience Not Found",
    };
  }

  const { frontmatter } = workData;

  return {
    title: `${frontmatter.title}`,
    description: frontmatter.description,
  };
}

export default async function WorkPage() {
  const workData = await getWorkContent();

  if (!workData) {
    notFound();
  }

  const { frontmatter, content } = workData;
  const { github, twitter } = userData.personalInfo;

  return (
    <div className="min-h-screen relative">
      <ClientDither />
      <div className="max-w-4xl mx-auto py-8 border-x border-dashed relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center m-4 mt-0">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" asChild>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground/80 hover:text-foreground/70 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-medium tracking-tight text-foreground/70">
              {frontmatter.title}
            </h1>
          </div>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link target="_blank" href={github}>
                <GithubIcon className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link target="_blank" href={twitter}>
                <XIcon className="size-4" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray mx-4 dark:prose-invert max-w-none border-t border-dashed mt-4 [&_img]:block [&_img]:my-6 [&_p]:my-4">
          <MDXRemote source={content} components={components} />
        </div>
      </div>
      <Footer graph={false} />
    </div>
  );
}
