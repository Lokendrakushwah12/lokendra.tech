import Image from "next/image";
import Link from "next/link";
import { GithubIcon } from "../icons";
import TextButton from "./text-button";

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  liveLink?: string;
  imageSrc?: string;
  date: string;
  gitHubLink: string;
  working?: boolean;
};

const ProjectCard = ({
  title,
  description,
  tags,
  liveLink,
  imageSrc,
  date,
  gitHubLink,
  working = false,
}: ProjectCardProps) => {
  return (
    <div className="flex z-20 flex-col justify-between gap-1 rounded-2xl bg-background/50 hover:bg-background/80 shadow-xs transition-all border border-border border-dashed p-2 sm:p-4">
      <Image
        src={imageSrc || "/projects/default.webp"}
        alt={title}
        width={600}
        height={600}
        className="w-full h-[11rem] object-cover object-top rounded-md"
      />
      <span className="inline-flex justify-start items-center -mb-2 gap-2">
        <TextButton text={title} textSize={18} uppercase="capitalize" />
        {working && (
          <span className="ml-2 text-xs text-foreground border border-blue-400/20 bg-blue-100 dark:bg-blue-400/30 transition-all rounded-md px-2 py-0.5">
            WIP
          </span>
        )}
      </span>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-2 flex-wrap">
        {tags?.map((tag, index) => (
          <span
            key={index}
            className="text-xs text-muted-foreground border bg-card-foreground/[2%] hover:bg-card-foreground/[4%] transition-all rounded-md px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex justify-center items-center gap-2">
          {
            liveLink && (
              <Link
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm hover:underline transition-all"
              >
                Live link
              </Link>
            )
          }
          <Link
            href={gitHubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-all"
          >
            <GithubIcon />
          </Link>
        </div>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
