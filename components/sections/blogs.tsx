import { getAllBlogs } from "@/lib/blogs";
import Link from "next/link";

const Blogs = () => {
  const blogs = getAllBlogs();

  return (
    <div className="border-b border-border border-dashed">
      <div className="border-x border-border border-dashed p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
        <div className="inline-flex items-center justify-center gap-1 font-normal tracking-tight text-xl">
          <h2 className="font-normal drop-shadow-xs text-xl md:text-3xl text-muted-foreground">
            BLOGS
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <Link
              key={blog.slugPath}
              href={`/${blog.slugPath}`}
              className="rounded-xl bg-white hover:bg-white/70 dark:bg-background/50 dark:hover:bg-background/80 shadow-xs transition-all border border-dashed p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg text-foreground/90 tracking-tight">
                    {blog.frontmatter.title}
                  </h3>
                  {blog.frontmatter.date && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {blog.frontmatter.date}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {blog.frontmatter.excerpt ?? blog.frontmatter.description}
                </p>
              </div>
            </Link>
          ))}
          {blogs.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No blogs found in `content/blogs`.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
