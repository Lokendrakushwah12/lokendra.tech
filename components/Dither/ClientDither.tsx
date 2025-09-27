"use client";
import React from "react";
import Dither from "./Dither";

const ClientDither = () => {
  return (
    <div className="w-full h-screen fixed left-0 top-0 pointer-events-auto" style={{ zIndex: 0, opacity: 0.12 }}>
      <Dither
        waveColor={[0.11, 0.11, 0.12]}
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
