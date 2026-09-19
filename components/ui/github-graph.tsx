"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { cloneElement } from "react";
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { ScrollArea } from "./scroll-area";

const githubTooltipHandle = TooltipCreateHandle<{ count: number; date: string }>();

const GitHubCalendar = dynamic(
  () =>
    import("react-github-calendar").then((mod) => ({
      default: mod.GitHubCalendar,
    })),
  { ssr: false }
);

const GitHubGraph = ({
  username = "Lokendrakushwah12",
  profileSrc,
  scrollFade = true,
}: {
  username?: string;
  profileSrc?: string;
  scrollFade?: boolean;
}) => {

  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === "light" ? "light" : "dark";

  const customTheme = {
    // even lightness steps up to the cream peak (L* 10 / 22 / 40 / 68 / 91)
    dark: [
      "#1a1918", // stone-1000 - empty
      "#363533", // stone-900
      "#625d58", // stone-700
      "#aba69d", // stone-550
      "#eae6d7", // cream - high
    ],
    // mirrored: same steps running light to dark (L* 94 / 82 / 68 / 40 / 22)
    light: [
      "#f1ece5", // stone-200 - empty
      "#d4cfc6", // stone-400
      "#aba69d", // stone-550
      "#625d58", // stone-700
      "#363533", // stone-900 - high
    ],
  };

  return (
    <TooltipProvider delay={0}>
      <div className="flex justify-center max-w-4xl w-full">
        <div className="w-full z-20 mx-auto border border-dashed rounded-lg bg-site-background p-2 [&_[data-slot=scroll-area-viewport]]:overflow-y-hidden [&_[data-slot=scroll-area-viewport]]:overscroll-y-auto">
          {profileSrc && (
            <div className="px-1 pt-1 pb-2">
              <Tooltip>
                <TooltipTrigger
                  render={(triggerProps) => (
                    <a
                      {...triggerProps}
                      href={`https://github.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground border-b border-dashed border-foreground/60 hover:text-foreground transition-colors"
                    >
                      @{username}
                    </a>
                  )}
                />
                <TooltipPopup
                  side="top"
                  className="overflow-hidden p-0 **:data-[slot=tooltip-viewport]:p-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileSrc}
                    alt={`${username} on GitHub`}
                    decoding="async"
                    className="block shrink-0 w-[28rem] max-w-[80vw] object-cover"
                  />
                </TooltipPopup>
              </Tooltip>
            </div>
          )}
          <ScrollArea scrollFade={scrollFade}>
            <div style={{ minWidth: "max-content" }}>
              <GitHubCalendar
                username={username}
                theme={customTheme}
                colorScheme={currentTheme}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderBlock={(block: any, activity: any) => (
                  <TooltipTrigger
                    handle={githubTooltipHandle}
                    payload={{ count: activity.count, date: activity.date }}
                    render={(triggerProps) => {
                      const rect = cloneElement(block, triggerProps as Record<string, unknown>);
                      const { x, y, width, height } = block.props;
                      return (
                        <g>
                          {rect}
                          {activity.count > 0 && (
                            <text
                              x={x + width / 2}
                              y={y + height / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={8}
                              fill={
                                currentTheme === "dark"
                                  ? activity.level >= 3
                                    ? "rgba(0,0,0,0.9)"
                                    : "rgba(255,255,255,0.6)"
                                  : activity.level >= 3
                                    ? "rgba(255,255,255,0.8)"
                                    : "rgba(0,0,0,0.6)"
                              }
                              style={{ pointerEvents: "none", userSelect: "none" }}
                            >
                              {activity.count}
                            </text>
                          )}
                        </g>
                      );
                    }}
                  />
                )}
              />
            </div>
          </ScrollArea>

          <Tooltip handle={githubTooltipHandle}>
            {({ payload }) => (
              <TooltipPopup>
                {payload != null &&
                  `${payload.count} contributions on ${payload.date}`}
              </TooltipPopup>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GitHubGraph;
