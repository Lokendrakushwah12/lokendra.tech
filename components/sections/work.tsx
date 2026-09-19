import BackHome from "../ui/back-home";
import Enter from "../ui/enter";
import ImageModal from "../ui/image-modal";
import { Card } from "../ui/card";
import { Container } from "../ui/container";

export type WorkItem = {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
};

export function Work({
  title = "Design Work",
  slug,
  data,
}: {
  title?: string;
  /** breadcrumb segment; defaults to a slugified title */
  slug?: string;
  data: WorkItem[];
}) {
  const crumb =
    slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <main className="relative flex-1 font-inter">
      <Card className="w-full h-full mx-auto sm:pb-8 bg-transparent border-none before:shadow-[0_1px_--theme(--color-black/0%)] dark:before:shadow-[0_-1px_--theme(--color-white/0%)]">
        <Container className="relative px-2! h-full flex flex-col items-start justify-start">
          <Enter stagger={1}>
            <BackHome current={crumb} />
          </Enter>

          <Enter stagger={2} className="w-full">
          <section
            className="w-full flex flex-col sm:flex-row justify-start gap-2"
            aria-label="Portfolio gallery of projects and design work"
          >
            {[
              data.slice(0, Math.ceil(data.length / 2)),
              data.slice(Math.ceil(data.length / 2)),
            ].map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-1 flex-col gap-2">
                {column.map((project, index) => (
                  <article
                    key={`${project.src}-${index}`}
                    className="w-full group"
                    itemScope
                    itemType="https://schema.org/CreativeWork"
                  >
                    <ImageModal
                      src={project.src}
                      alt={project.alt ?? project.title ?? ""}
                      title={project.description}
                      className="my-0 max-w-none border-0 rounded-xs object-cover bg-background"
                    />
                    {project.title && (
                      <meta itemProp="name" content={project.title} />
                    )}
                    {project.description && (
                      <meta
                        itemProp="description"
                        content={project.description}
                      />
                    )}
                  </article>
                ))}
              </div>
            ))}
          </section>
          </Enter>
        </Container>
      </Card>
    </main>
  );
}
