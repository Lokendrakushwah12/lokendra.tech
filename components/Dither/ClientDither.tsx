"use client";
import { useTheme } from "next-themes";
import Dither from "./Dither";

const ClientDither = () => {
  const { theme } = useTheme();

  // Theme-aware colors
  const waveColor = theme === 'dark'
    ? [0.55, 0.55, 0.60] as [number, number, number]  // Dark theme
    : [0.8, 0.8, 0.9] as [number, number, number]; // Light theme

  const backgroundColor = theme === 'dark'
    ? [0.0, 0.0, 0.0] as [number, number, number]  // Black background for dark theme
    : [1.0, 1.0, 1.0] as [number, number, number]; // White background for light theme

  return (
    <div className="w-full h-screen fixed left-0 top-0 dark:opacity-[0.01] opacity-[0.12] pointer-events-none" style={{ zIndex: -1 }}>
      <Dither
        waveColor={waveColor}
        backgroundColor={backgroundColor}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.15}
        colorNum={3}
        pixelSize={3}
        waveAmplitude={0.3}
        waveFrequency={1}
        waveSpeed={0.06}
        dpr={2}
        fps={30}
      />
    </div>
  );
};

export default ClientDither;
