import AsciiDither from "@/components/Dither/AsciiDither";
import { GithubIcon, XIcon } from "@/components/icons";
import Footer from "@/components/sections/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TrophyIcon } from "@/components/icons";
import BackHome from "@/components/ui/back-home";
import Enter from "@/components/ui/enter";
import {
  ExtractionPipeline,
  IncidentTrace,
  MonolithSplit,
} from "@/components/ui/diagram";
import { GalaxyFlow } from "@/components/ui/diagram/galaxy-flow";
import GitHubGraph from "@/components/ui/github-graph";
import ImageModal from "@/components/ui/image-modal";
import LinesBG from "@/components/ui/lines-bg";
import RoleHeading from "@/components/ui/role-heading";
import TechStack from "@/components/ui/tech-stack";
import { slugify, tocFromMdx } from "@/lib/utils";
import { DocsTableOfContents, DocsTocPill } from "@/components/ui/toc";
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
    <h2
      id={slugify(String(children))}
      className="scroll-mt-24 text-xl font-semibold mb-4 mt-12 text-foreground/80"
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-medium tracking-tight mb-3 mt-10 text-foreground/80">
      {children}
    </h3>
  ),
  // a highlight inside a role: quieter and smaller than the role heading
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4
      id={slugify(String(children))}
      className="flex items-center gap-2 scroll-mt-24 text-sm font-medium tracking-tight mb-2 mt-6 text-muted-foreground"
    >
      <TrophyIcon className="size-3.5 shrink-0 text-amber-500/80" />
      {children}
    </h4>
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
  strong: ({ children }: { children: React.ReactNode }) => {
    const text = String(children).replace(/\.$/, "").trim();
    return (
      <strong id={slugify(text)} className="scroll-mt-24 font-medium text-foreground/70">
        {children}
      </strong>
    );
  },
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
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="not-prose relative my-8 rounded-r-md border-l-2 border-foreground/25 bg-muted/40 py-4 pl-5 pr-4 text-[0.95rem] leading-relaxed text-foreground/75 [&_p]:m-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-t border-dashed border-border" />,
  ExtractionPipeline,
  GalaxyFlow,
  GitHubGraph,
  IncidentTrace,
  LinesBG,
  MonolithSplit,
  RoleHeading,
  TechStack,
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
  } catch {
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
  const toc = tocFromMdx(content);

  return (
    <div
      className="min-h-screen relative font-inter"
      style={{ fontOpticalSizing: "none", fontVariationSettings: '"opsz" 32' }}
    >
      <AsciiDither />
      {/* outside the z-10 wrapper, so it can sit above the layout's bottom blur */}
      <DocsTocPill toc={toc} className="min-[1400px]:hidden" />
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <Enter stagger={1}>
          <BackHome current="proof-of-work" />
        </Enter>

        {/* pinned into the gutter once there is room, a bottom pill until then.
            Not wrapped in <Enter>: a transformed ancestor would become the
            containing block of this fixed element mid-animation, so each piece
            staggers in on its own instead. */}
        <DocsTableOfContents
          toc={toc}
          className="hidden min-[1400px]:flex fixed top-28 left-[calc(50%+28rem)] max-h-[70vh] w-56 overflow-y-auto ps-6"
        />

        {/* Content */}
        <Enter stagger={3} list>
          <div className="enter-list prose prose-gray dark:prose-invert max-w-none border-t border-dashed mt-4 [&_img]:block [&_img]:my-6 [&_p]:my-4">
            <MDXRemote source={content} components={components} />
          </div>
        </Enter>


      </div>
    </div>
  );
}
