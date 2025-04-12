import { GithubIcon, XIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import FluidMenu from "@/components/ui/fluid-menu";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border border-dashed sticky top-0 bg-site-background/80 backdrop-blur-md z-50">
        <div className="px-4 py-2 max-w-screen-xl w-full mx-auto border-border border-dashed xl:border-x">
          <div className="flex items-center gap-4 justify-between h-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-medium font-mono tracking-tight text-sm"
            >
              <span>Lokendra</span>
              <span className="text-xl text-border">/</span>
              <span>ui</span>
            </Link>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link target="_blank" href="https://x.com/lokendratwt">
                  <XIcon className="size-3.5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  target="_blank"
                  href="https://github.com/lokendrakushwah12"
                >
                  <GithubIcon className="size-5" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-border border-dashed">
        <div className="px-4 py-12 max-w-screen-xl w-full mx-auto border-border border-dashed xl:border-x flex flex-col lg:flex-row items-center gap-x-4 gap-y-12 lg:justify-between">
          <div className="flex lg:flex-row flex-col gap-8">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex justify-between items-center gap-4">
                <div className="space-y-8">
                  <h1 className="text-5xl lg:text-6xl font-[538] tracking-[-0.03em] drop-shadow-xs text-center lg:text-left">
                    UI Animation <br className="hidden lg:block" />
                    Challenge
                  </h1>
                  <div className="*:text-lg leading-none *:lg:text-xl *:tracking-[-0.01em] *:font-[410] text-neutral-800 dark:text-neutral-300 flex flex-col gap-1 text-center lg:text-left">
                    <span>
                      5-day immersive challenge where you&apos;ll tackle
                    </span>
                    <span>and solve a daily animation challenge.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-border border-dashed">
        <div className="xl:border-x border-border border-dashed p-4 max-w-screen-xl w-full mx-auto space-y-4 h-[800px]">
          <div className="inline-flex items-center justify-center gap-1 font-normal font-mono tracking-tight text-xl">
            <span>Day 1</span>
            <span className="text-border">/</span>
            <h2 className="tracking-[-0.03em] drop-shadow-xs">
              Fluid Menu Animation
            </h2>
          </div>
          <div className="flex flex-col min-h-[400px] justify-between gap-8 rounded-2xl bg-background dark:bg-surface p-6 shadow-xs border border-border">
            <FluidMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
