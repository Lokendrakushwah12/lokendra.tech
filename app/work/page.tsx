import { ArrowLeftIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import fs from 'fs';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import path from 'path';

// Define the experience slugs mapping
const experienceMapping = {
    'induced-ai': 'induced-ai.mdx',
    'unolo': 'unolo.mdx',
    'snipe': 'snipe.mdx'
};

interface ExperiencePageProps {
    params: Promise<{
        slug: string;
    }>;
}

interface ExperienceMatter {
    title: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    image?: string;
    technologies?: string[];
}

// MDX Components
const components = {
    h1: ({ children }: { children: React.ReactNode }) => (
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-foreground">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 mt-8 text-foreground">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-xl md:text-2xl font-semibold mb-3 mt-6 text-foreground">{children}</h3>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
        <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-2">{children}</ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
        <li className="text-muted-foreground">{children}</li>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
    ),
    img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
            src={src}
            alt={alt}
            className="rounded-lg border mb-6 w-full max-w-4xl mx-auto"
        />
    ),
    code: ({ children }: { children: React.ReactNode }) => (
        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
};

async function getExperienceContent(slug: string) {
    const fileName = experienceMapping[slug as keyof typeof experienceMapping];

    if (!fileName) {
        return null;
    }

    const filePath = path.join(process.cwd(), 'content', fileName);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        return {
            frontmatter: data as ExperienceMatter,
            content
        };
    } catch (error) {
        return null;
    }
}

export async function generateStaticParams() {
    return Object.keys(experienceMapping).map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
    const { slug } = await params;
    const experienceData = await getExperienceContent(slug);

    if (!experienceData) {
        return {
            title: 'Experience Not Found',
        };
    }

    const { frontmatter } = experienceData;

    return {
        title: `${frontmatter.role} at ${frontmatter.company} | Lokendra Kushwah`,
        description: `Learn about my experience as ${frontmatter.role} at ${frontmatter.company} from ${frontmatter.startDate} to ${frontmatter.endDate}.`,
    };
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
    const { slug } = await params;
    const experienceData = await getExperienceContent(slug);

    if (!experienceData) {
        notFound();
    }

    const { frontmatter, content } = experienceData;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8 border-x border-dashed">
                {/* Back Button */}
                <Button size="sm" variant="outline" asChild>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Home
                    </Link>
                </Button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                                {frontmatter.role}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {frontmatter.company}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-muted-foreground">
                                {frontmatter.startDate} - {frontmatter.endDate}
                            </p>
                        </div>
                    </div>

                    {/* Technologies */}
                    {frontmatter.technologies && (
                        <div className="flex flex-wrap gap-2">
                            {frontmatter.technologies.map((tech, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs text-muted-foreground border bg-card-foreground/[2%] hover:bg-card-foreground/[4%] transition-all rounded-md px-2 py-0.5"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <MDXRemote source={content} components={components} />
                </div>
            </div>
        </div>
    );
}
