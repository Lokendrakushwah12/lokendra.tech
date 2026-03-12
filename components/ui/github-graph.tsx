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

const GitHubGraph = () => {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === "light" ? "light" : "dark";

  const customTheme = {
    dark: [
      "#0F1A1780", // level 0 - very dark slate green
      "#2A3F3A", // level 1 - low
      "#45665E", // level 2 - medium-low
      "#6F9188", // level 3 - medium
      "#A7C8BD", // level 4 - high
    ],
    light: [
      "#E9F4F0", // level 0 - very light slate green
      "#BFD6CD", // level 1 - low
      "#8FB4A8", // level 2 - medium-low
      "#52786E", // level 3 - medium
      "#195446", // level 4 - high
    ],
  };

  return (
    <TooltipProvider delay={0}>
      <div className="flex justify-center max-w-4xl w-full">
        <div className="w-full z-20 mx-auto border border-dashed rounded-lg bg-site-background p-2">
          <ScrollArea>
            <div style={{ minWidth: "max-content" }}>
              <GitHubCalendar
                username="Lokendrakushwah12"
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
