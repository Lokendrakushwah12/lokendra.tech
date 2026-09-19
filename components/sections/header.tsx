import userData from "@/config/userData";
import Image from "next/image";
import Link from "next/link";
import { GithubIcon, XIcon } from "../icons";
import SoundToggle from "../sound-toggle";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

const Header = () => {
  const { name, profession, github, twitter } = userData.personalInfo;

  return (
    <div className="w-full lg:max-w-4xl">
      <div className="p-4 pt-12 w-full mx-auto">
        <div className="flex items-center gap-4 justify-between">
          <Link href="/" className="flex flex-col items-start gap-2 justify-center">
            <div className="relative size-20 shrink-0">
              <div className="size-20 rounded-md absolute inset-0 ring-[0.6px] ring-inset ring-black/10 dark:ring-white/15" />
              <Image
                src="/pfp.png"
                alt="logo"
                width={104}
                height={104}
                className="size-20 object-cover rounded-md select-none"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-start justify-start font-medium tracking-tight text-sm">
              <h1 className="text-base tracking-tight text-foreground">{name}</h1>

              <span className="text-sm -mt-1 font-normal text-muted-foreground">
                {profession}
              </span>
            </div>
          </Link>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link target="_blank" href={github}>
                <GithubIcon className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link target="_blank" href={twitter}>
                <XIcon className="size-4" />
              </Link>
            </Button>
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
