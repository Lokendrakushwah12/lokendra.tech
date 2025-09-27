import userData from "@/config/userData";
import TextButton from "../ui/text-button";
import { InducedAIIcon, UnoloIcon } from "../icons";
import Link from "next/link";

const About = () => {
  const { about } = userData;

  // Split the about text into parts
  const beforeSoftwareEngineer = about.split("A software engineer")[0];
  const afterSoftwareEngineer = about.split("A software engineer")[1];
  const previouslyWorkedPart = afterSoftwareEngineer.split("\nPreviously I worked")[1];
  const mainPart = afterSoftwareEngineer.split("\nPreviously I worked")[0];

  return (
    <div className="border-b border-border border-dashed pt-12">
      <div className="border-x border-border border-dashed p-4 w-full mx-auto space-y-4 py-8 md:py-16">
        <div className="text-muted-foreground justify-between gap-8 rounded-2xl">
          {beforeSoftwareEngineer}
          <div className="mt-4">
            A&nbsp;
            <span className="border-b border-dashed inline-block border-foreground text-foreground">
              <TextButton text="Software Engineer" textSize={16} />
            </span>
            &nbsp;{mainPart}
          </div>
          
          {/* Previously I worked section */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Previously, I worked at</span>
            
              {/* Unolo */}
              <div className="inline-flex items-center gap-2 rounded-lg py-2">
                <UnoloIcon className="size-4" />
                <Link 
                  href="https://unolo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium border-b text-foreground/80 transition-colors z-10"
                >
                  Unolo
                </Link>
              </div>
              as software engineer intern.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;