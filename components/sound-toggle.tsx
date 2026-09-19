"use client";

import { useSound } from "./sound-provider";
import { Button } from "./ui/button";
import IconSwap from "./ui/icon-swap";

const SoundToggle = () => {
  const { enabled, toggle } = useSound();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={enabled ? "Sound on" : "Sound off"}
    >
      <IconSwap swapKey={enabled ? "on" : "off"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {enabled ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <path d="m22 9-6 6M16 9l6 6" />
        )}
      </svg>
      </IconSwap>
    </Button>
  );
};

export default SoundToggle;
