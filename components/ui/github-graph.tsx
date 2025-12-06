"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
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
      "#0F1A17", // level 0 - very dark slate green
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
    <div className="flex justify-center">
      <div className="w-full z-20 max-w-4xl mx-auto border border-dashed rounded-lg  p-2 overflow-x-auto">
        <GitHubCalendar
          username="Lokendrakushwah12"
          theme={customTheme}
          colorScheme={currentTheme}
        />
      </div>
    </div>
  );
};

export default GitHubGraph;
