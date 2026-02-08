import Image from "next/image";
import Link from "next/link";
import { GithubIcon } from "../icons";
import TextButton from "./text-button";
import { getTechInfo } from "@/lib/utils";

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
    <div className="flex z-20 flex-col justify-between gap-1 rounded-xl bg-white hover:bg-white/70 dark:bg-background/50 dark:hover:bg-background/80 shadow-xs transition-all border border-dashed p-2 group">
      <Image
        src={imageSrc || "/projects/default.webp"}
        alt={title}
        width={600}
        height={600}
        className="w-full h-[13rem] object-cover object-top rounded-lg transition-all duration-150 group-hover/projects:opacity-40 group-hover:!opacity-100"
      />
      <div className="flex items-center justify-between">
        <span className="inline-flex justify-start items-center -mb-2 gap-2">
          <TextButton text={title} textSize={18} uppercase="capitalize" />
          {working && (
            <span className="ml-2 text-xs text-foreground border border-blue-400/20 bg-blue-100 dark:bg-blue-400/30 transition-all rounded-md px-2 py-0.5">
              WIP
            </span>
          )}
        </span>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-2 flex-wrap">
        {tags?.map((tag, index) => {
          const techInfo = getTechInfo(tag);
          return (
            <span
              key={index}
              className="text-xs text-muted-foreground border bg-white dark:bg-card-foreground/2 hover:bg-white/70 dark:hover:bg-card-foreground/5 shadow-xs hover:shadow-none transition-all rounded-sm px-1.5 py-0.5 flex items-center gap-1.5"
            >
              {techInfo?.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={techInfo.logoUrl}
                  alt={tag}
                  width={14}
                  height={14}
                  className={`object-contain ${techInfo.invertInDarkMode ? "dark:invert" : ""} ${techInfo.invertInLightMode ? "invert dark:invert-0" : ""}`}
                />
              )}
              {tag}
            </span>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border border-dashed">
        {liveLink && (
          <Link
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground w-full text-sm text-center text-nowrap transition-all border-r border-dashed"
          >
            Live link
          </Link>
        )}
        <Link
          href={gitHubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground w-full text-sm flex items-center justify-center gap-2 transition-all"
        >
          GitHub
          <GithubIcon />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
