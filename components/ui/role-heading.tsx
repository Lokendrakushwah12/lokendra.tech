import { slugify } from "@/lib/utils";

/** Role on the left, dates on the right, dashed rule filling the gap. */
const RoleHeading = ({ title, date }: { title: string; date: string }) => {
  return (
    <div className="not-prose mt-10 mb-4 flex w-full items-baseline gap-3">
      <h3
        id={slugify(title)}
        className="shrink-0 scroll-mt-24 text-xl font-medium tracking-tight text-foreground/80"
      >
        {title}
      </h3>
      <div className="grow translate-y-[-0.25rem] border-b border-border" />
      <span className="shrink-0 text-sm text-muted-foreground">{date}</span>
    </div>
  );
};

export default RoleHeading;
