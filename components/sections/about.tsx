import userData from "@/config/userData";
import TextButton from "../ui/text-button";
import { InducedAIIcon, UnoloIcon } from "../icons";
import Link from "next/link";

const About = () => {
  const { about } = userData;

  // Split the about text into parts
  const beforeSoftwareEngineer = about.split("A software engineer")[0];
  const afterSoftwareEngineer = about.split("A software engineer")[1];
  const previouslyWorkedPart = afterSoftwareEngineer.split(
    "\nPreviously I worked"
  )[1];
  const mainPart = afterSoftwareEngineer.split("\nPreviously I worked")[0];

  return (
    <div className="border-b border-border border-dashed">
      <div className="border-x border-border border-dashed p-4 w-full mx-auto space-y-4 py-8 md:py-16">
        <div className="text-muted-foreground text-base tracking-tight">
          {beforeSoftwareEngineer}
          <div className="mt-4">
            A&nbsp;
            <h1 className="inline-block border-foreground/60 text-foreground">
              Software Engineer
            </h1>
            &nbsp;{mainPart}
          </div>

          {/* Previously I worked section */}
          <div className="mt-6">
            <div className="text-muted-foreground leading-relaxed">
              Previously, I worked at&nbsp;
              {/* Induced AI */}
              <Link href="https://www.induced.ai/" target="_blank" rel="noopener noreferrer" className="cursor-pointer inline-flex items-center gap-1.5 mx-1 translate-y-1.5">
                <InducedAIIcon className="size-5.5 border border-[#212121] rounded-sm bg-gradient-to-b from-black to-black/90" />
                <span
                  className="text-sm border-b cursor-pointer border-dashed border-foreground/60 text-foreground hover:text-primary transition-colors"
                >
                  Induced AI
                </span>
              </Link>
              &nbsp;and&nbsp;
              {/* Unolo */}
              <Link href="https://unolo.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer inline-flex items-center gap-1.5 mx-1 translate-y-0.5">
                <UnoloIcon className="size-4" />
                <span
                  className="text-sm border-b cursor-pointer border-dashed border-foreground/60 text-foreground hover:text-primary transition-colors"
                >
                  Unolo
                </span>
              </Link>
              &nbsp;as Frontend Engineer.
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
                className="border-b cursor-pointer border-dashed border-foreground/60 text-foreground hover:text-primary transition-colors"
              >
                Proof of Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
