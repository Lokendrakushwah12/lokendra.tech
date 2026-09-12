import ClientDither from "@/components/Dither/ClientDither";
import { ArrowLeftIcon, GithubIcon, XIcon } from "@/components/icons";
import Footer from "@/components/sections/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import userData from "@/config/userData";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/blogs";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const mdxComponents = {
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-2xl font-semibold tracking-tight mb-6 text-foreground/80">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-xl font-semibold mb-4 mt-8 text-foreground/80">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-lg font-medium tracking-tight mb-3 mt-6 text-foreground/80">
      {children}
    </h3>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-muted-foreground/90 mb-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-inside mb-4 text-muted-foreground/90 space-y-2">
      {children}
    </ul>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="text-muted-foreground/90">{children}</li>
  ),
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4 hover:text-foreground/90 transition-colors"
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children: ReactNode }) => (
    <strong className="font-medium text-foreground/90">{children}</strong>
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  ),
  hr: () => <hr className="my-8 border-t border-dashed border-border" />,
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.frontmatter.title,
    description: blog.frontmatter.description,
  };
}

function PageHeader({ title }: { title: string }) {
  const { github, twitter } = userData.personalInfo;

  return (
    <div className="flex justify-between items-center m-4 mt-0">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" asChild>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground/80 hover:text-foreground/80 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-medium tracking-tight text-foreground/80">
          {title}
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
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen relative font-inter">
      <ClientDither />
      <div className="max-w-4xl mx-auto py-8 border-x border-dashed relative z-10">
        <PageHeader title={blog.frontmatter.title} />
        <div className="mx-4 text-xs text-muted-foreground border-t border-dashed pt-4">
          {blog.frontmatter.date ?? "No date"}
        </div>
        <div className="prose prose-gray mx-4 dark:prose-invert max-w-none mt-4 [&_img]:block [&_img]:my-6 [&_p]:my-4">
          <MDXRemote source={blog.content} components={mdxComponents} />
        </div>
      </div>
      <Footer graph={false} />
    </div>
  );
}
