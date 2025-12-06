import Link from "next/link";
import { InducedAIIcon, KeychainIcon, SnipeIcon, UnoloIcon } from "../icons";
import TextButton from "./text-button";
import { cn } from "@/lib/utils";

export enum Company {
  Keychain = "Keychain",
  InducedAI = "Induced AI",
  Unolo = "Unolo",
  Snipe = "Snipe",
}

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

const getIcon = (companyName: string): React.ReactNode | null => {
  const iconMap: Record<Company, React.ReactNode> = {
    [Company.Keychain]: (
      <KeychainIcon className="size-11 sm:size-12 bg-[#FFEC44] border rounded-lg" />
    ),
    [Company.InducedAI]: (
      <InducedAIIcon className="size-11 sm:size-12 bg-[#090909] border rounded-lg" />
    ),
    [Company.Unolo]: (
      <UnoloIcon className="size-11 sm:size-12 bg-muted/50 backdrop-blur-2xl p-2 border rounded-lg" />
    ),
    [Company.Snipe]: (
      <SnipeIcon className="size-11 sm:size-12 bg-[#25224D] border rounded-lg" />
    ),
  };

  const company = Object.values(Company).find((c) => c === companyName);
  return company ? iconMap[company as Company] : null;
};

const ExperienceCard = ({
  companyName,
  role,
  startDate,
  endDate,
  link,
  isFirst,
}: ExperienceCardProps) => {
  const Icon = getIcon(companyName);
  return (
    <Link
      href={link}
      target="_blank"
      className="flex flex-col px-2 md:px-4 justify-center gap-2 group z-20"
    >
      <div className="flex justify-center items-center gap-3 transition-opacity duration-150 group-hover/experience:opacity-40 group-hover:!opacity-100">
        <div className="flex flex-col justify-center items-center">
          <div
            className={`w-px bg-border ${
              isFirst ? "h-0" : "h-12"
            }`}
          />
          {Icon && (
            <div className="icon-container size-11 sm:size-12 aspect-square">
              {Icon}
            </div>
          )}
        </div>

        <div className={cn("size-full", { "-mt-2": isFirst, "mt-10": !isFirst })}>
          <TextButton text={role} textSize={16} uppercase="capitalize" />
          <div className="flex w-full justify-between items-center">
            <p className="text-sm text-muted-foreground sm:w-[100px] sm:pr-0 pr-2 group-hover:text-foreground transition-colors">
              {companyName}
            </p>
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
