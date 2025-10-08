"use client";

import { useTheme } from "next-themes";
import { ThemeToggleIcon } from "./icons";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Use resolvedTheme to get the actual theme being displayed (handles 'system')
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      data-slot="button"
      onClick={toggleTheme}
      className="relative size-8 p-0"
      variant="ghost"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <ThemeToggleIcon />
    </Button>
  );
}
