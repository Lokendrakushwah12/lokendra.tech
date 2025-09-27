"use client";
import React from "react";
import Dither from "./Dither";
import { useTheme } from "next-themes";

const ClientDither = () => {
  const { theme } = useTheme();
  
  // Theme-aware colors
  const waveColor = theme === 'dark' 
    ? [0.11, 0.11, 0.12] as [number, number, number]  // Dark theme
    : [0.8, 0.8, 0.9] as [number, number, number]; // Light theme
    
  const backgroundColor = theme === 'dark'
    ? [0.0, 0.0, 0.0] as [number, number, number]  // Black background for dark theme
    : [1.0, 1.0, 1.0] as [number, number, number]; // White background for light theme

  return (
    <div className="w-full h-screen fixed left-0 top-0 pointer-events-auto" style={{ zIndex: 0, opacity: 0.2}}>
      <Dither
        waveColor={waveColor}
        backgroundColor={backgroundColor}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.15}
        colorNum={3}
        waveAmplitude={0.3}
        waveFrequency={1}
        waveSpeed={0.06}
      />
    </div>
  );
};

export default ClientDither;
