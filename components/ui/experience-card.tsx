import Link from "next/link";
import TextButton from "./text-button";

type ExperienceCardProps = {
  id: number;
  companyName: string;
  role: string;
  startDate: string;
  endDate: string;
  link: string;
  isFirst: boolean;
  isLast: boolean;
};

// Map company names to slugs
const getExperienceSlug = (companyName: string) => {
  const slugMap: { [key: string]: string } = {
    "Induced AI": "induced-ai",
    "Unolo": "unolo", 
    "Snipe": "snipe"
  };
  return slugMap[companyName] || companyName.toLowerCase().replace(/\s+/g, '-');
};

const ExperienceCard = ({
  id,
  companyName,
  role,
  startDate,
  endDate,
  link,
  isFirst,
  isLast
}: ExperienceCardProps) => {
  const slug = getExperienceSlug(companyName);
  
  return (
    <Link
      // href={`/experience/${slug}`}
      href={link}
      target="_blank"
      className="flex flex-col px-2 md:px-4 justify-center gap-2 group"
    >
      <div className="flex justify-center items-start gap-3">
        <div className="flex flex-col justify-center items-center">
          <div className={`w-[1px] h-3 ${isFirst ? "bg-transparent" : "bg-muted-foreground/30"}`} />
          <div className={`${isFirst ? "bg-muted-foreground" : "bg-muted-foreground/30"} rounded-full size-3 group-hover:bg-foreground transition-colors`} />
          <div className={`w-[1px] bg-muted-foreground/30 ${isLast ? "h-0" : "h-12"}`} />
        </div>
        <div className="size-full">
          <TextButton text={role} textSize={16} uppercase="capitalize" />
          <div className="flex w-full justify-between items-center">
            <p className="text-sm text-muted-foreground w-[100px] group-hover:text-foreground transition-colors">
              {companyName}</p>
            <div className="flex-grow border-b border-dashed border-border" />
            <p className="text-sm text-muted-foreground text-right w-[170px] group-hover:text-foreground transition-colors">
              {startDate} - {endDate}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
