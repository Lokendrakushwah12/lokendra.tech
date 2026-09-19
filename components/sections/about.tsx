import Link from "next/link";
import TechBadge from "../ui/tech-badge";
import { ArrowUpRightIcon, HBIcon, InducedAIIcon, KeychainIcon, UnoloIcon, XIcon } from "../icons";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
        <div className="text-muted-foreground text-base tracking-tight">
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

          {/* proof of work */}
          <div className="mt-6">
            <div className="text-muted-foreground leading-relaxed">
              Checkout my&nbsp;
              {/* Proof of Work */}
              <Link
                href="/work"
                rel="noopener noreferrer"
                className="border-b cursor-pointer border-dashed border-foreground/60 text-foreground hover:text-primary transition-colors inline-flex items-center gap-0.5"
              >
                Proof of Work
                <ArrowUpRightIcon className="size-2.5 shrink-0" />
              </Link>
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
              .&nbsp;Check the whole work&nbsp;
              <Link
                href="/humanbehavior-work"
                rel="noopener noreferrer"
                className="border-b cursor-pointer border-dashed border-foreground/60 text-foreground hover:text-primary transition-colors inline-flex items-center gap-0.5"
              >
                here
                <ArrowUpRightIcon className="size-2.5 shrink-0" />
              </Link>
              .
            </div>
          </div>
          {/* design work */}
          <div className="mt-6">
            <div className="text-muted-foreground leading-relaxed">
              Checkout my&nbsp;
              <Link
                href="/design"
                rel="noopener noreferrer"
                className="border-b cursor-pointer border-dashed border-foreground/60 text-foreground hover:text-primary transition-colors inline-flex items-center gap-0.5"
              >
                Design Work.
                <ArrowUpRightIcon className="size-2.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
