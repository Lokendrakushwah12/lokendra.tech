import Link from "next/link";
import TechBadge from "../ui/tech-badge";
import { FileTextIcon, PenToolIcon } from "lucide-react";
import { ArrowUpRightIcon, HBIcon, InducedAIIcon, KeychainIcon, TrophyIcon, UnoloIcon, XIcon } from "../icons";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const pages = [
  {
    href: "/work",
    title: "Proof of Work",
    description: "What I built at Keychain, Induced AI and Unolo",
    icon: <TrophyIcon className="size-4" />,
  },
  {
    href: "/humanbehavior-work",
    title: "Human Behavior",
    description: "Revamping the whole dashboard with Amogh",
    icon: <HBIcon className="size-4" />,
  },
  {
    href: "/design",
    title: "Design Work",
    description: "Selected design and frontend work",
    icon: <PenToolIcon className="size-4" />,
  },
  {
    href: "/skills",
    title: "Skills",
    description: "Agent skills I use, mine and other creators'",
    icon: <FileTextIcon className="size-4" />,
  },
];

const About = () => {

  return (
    <div>
      {/* preload the tooltip avatar so it never shows a loading flash on hover */}
      <img
        src="https://lokendrakushwah12.github.io/cdn/amogh.webp"
        alt=""
        aria-hidden="true"
        className="hidden"
        decoding="async"
      />
      <div className="p-4 w-full mx-auto space-y-4 pb-8">
        <div className="enter-list text-muted-foreground text-base tracking-tight">
          <div className="">
            I&rsquo;m a&nbsp;
            <h1 className="inline-block border-foreground/60 text-foreground">
              Software Engineer
            </h1>
            &nbsp;at&nbsp;
            <TechBadge
              tag="Keychain"
              href="https://www.keychain.com/?utm_source=lokendra.tech"
              icon={<KeychainIcon className="size-3.5" />}
            />
            , where we&apos;re building the AI Operating System for food &amp; beverage manufacturers. I care deeply about the details, and I like building products people can trust to get things right.
          </div>

          {/* Previously I worked section */}
          <div className="mt-6">
            <div className="text-muted-foreground leading-relaxed">
              Previously, I worked at&nbsp;
              {/* Induced AI */}
              <TechBadge
                tag="Induced AI"
                href="https://www.induced.ai/?utm_source=lokendra.tech"
                icon={<InducedAIIcon className="size-3.5 rounded-[2px] bg-gradient-to-b from-black to-black/90" />}
              />
              &nbsp;and&nbsp;
              {/* Unolo */}
              <TechBadge
                tag="Unolo"
                href="https://unolo.com?utm_source=lokendra.tech"
                icon={<UnoloIcon className="size-3.5" />}
              />
              &nbsp;as a Frontend Engineer.
            </div>
          </div>

          {/* whom i have worked with */}
          <div className="mt-6">
            <div className="text-muted-foreground leading-relaxed">
              Worked with&nbsp;
              <TooltipProvider delay={0}>
                <Tooltip>
                  <TooltipTrigger className="inline-flex">
                      <TechBadge
                        tag="Amogh"
                        href="https://x.com/OfficialAmogh"
                        icon={<XIcon className="size-3" />}
                      />
                  </TooltipTrigger>
                  <TooltipPopup
                    side="top"
                    className="overflow-hidden p-0 **:data-[slot=tooltip-viewport]:p-0"
                  >
                    <img
                      src="https://lokendrakushwah12.github.io/cdn/amogh.webp"
                      alt="Amogh"
                      decoding="async"
                      className="block shrink-0 w-60 object-cover"
                    />
                  </TooltipPopup>
                </Tooltip>
              </TooltipProvider>
              &nbsp;to revamp the entire dashboard of&nbsp;


              <TooltipProvider delay={0}>
                <Tooltip>
                  <TooltipTrigger className="inline-flex">
                      <TechBadge
                        tag="Human Behavior"
                        href="https://www.humanbehavior.co/"
                        icon={<HBIcon className="size-3.5" />}
                      />
                  </TooltipTrigger>
                  <TooltipPopup
                    side="top"
                    className="overflow-hidden p-0 **:data-[slot=tooltip-viewport]:p-0"
                  >
                    <img
                      src="https://lokendrakushwah12.github.io/cdn/hb.webp"
                      alt="Amogh"
                      decoding="async"
                      className="block shrink-0 w-60 object-cover"
                    />
                  </TooltipPopup>
                </Tooltip>
              </TooltipProvider>
              .
            </div>
          </div>
          {/* pages */}
          <ul className="mt-8 border-t border-dashed">
            {pages.map(({ href, title, description, icon }) => (
              <li key={href} className="border-b border-dashed">
                <Link href={href} className="group flex items-center gap-3 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-dashed bg-white text-muted-foreground shadow-xs transition-colors group-hover:text-foreground dark:bg-background/50">
                    {icon}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="leading-snug text-foreground">{title}</span>
                    <span className="truncate text-sm text-muted-foreground">
                      {description}
                    </span>
                  </span>
                  <ArrowUpRightIcon className="ml-auto size-3 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
