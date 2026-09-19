import TechBadge from "./tech-badge";

const TechStack = ({ items }: { items: string }) => {
  const tags = items.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="not-prose my-6">
      <p className="text-sm text-muted-foreground mb-2">Tech stack</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <TechBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
};

export default TechStack;
