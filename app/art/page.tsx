"use client";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, { useEffect, useMemo, useState } from "react";

import { reverseArray } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface PhotographyAsset {
  url: string;
  title?: string;
}

interface GridSlot extends PhotographyAsset {
  id: string;
  col: number;
  index: number;
  row: number;
}

interface GridItemProps {
  data: GridSlot;
  mapX: MotionValue<number>;
  mapY: MotionValue<number>;
  winSize: { w: number; h: number };
  totalW: number;
  totalH: number;
  index: number;
}

const CELL_WIDTH = 380;
const CELL_HEIGHT = 475;
const GAP = 30;
const INITIAL_PADDING = 100;

const MY_PHOTOGRAPHY: PhotographyAsset[] = reverseArray([
  { url: "/pfp.png" },
  { url: "/apple-icon.png" },
  { url: "/images/ai/0003.webp" },
  { url: "/images/ai/0004.webp" },
  { url: "/images/ai/0005.webp" },
  { url: "/images/ai/0006.webp" },
  { url: "/images/ai/0007.webp" },
  { url: "/images/ai/0008.webp" },
  { url: "/images/ai/0009.webp" },
  { url: "/images/ai/0010.webp" },
  { url: "/images/ai/0011.webp" },
  { url: "/images/ai/0012.webp" },
  { url: "/images/ai/0013.webp" },
  { url: "/images/ai/0014.webp" },
  { url: "/images/ai/0015.webp" },
  { url: "/images/ai/0016.webp" },
  { url: "/images/ai/0017.webp" },
  { url: "/images/ai/0018.webp" },
  { url: "/images/ai/0019.webp" },
  { url: "/images/ai/0020.webp" },
  { url: "/images/ai/0021.webp" },
  { url: "/images/ai/0022.webp" },
  { url: "/images/ai/0023.webp" },
  { url: "/images/ai/0024.webp" },
  { url: "/images/ai/0025.webp" },
  { url: "/images/ai/0026.webp" },
  { url: "/images/ai/0027.webp" },
  { url: "/images/ai/0028.webp" },
  { url: "/images/ai/0029.webp" },
  { url: "/images/ai/0030.webp" },
  { url: "/images/ai/0031.webp" },
  { url: "/images/ai/0032.webp" },
  { url: "/images/ai/0033.webp" },
]);

export default function InfiniteGrid() {
  const mapX = useMotionValue(INITIAL_PADDING);
  const mapY = useMotionValue(INITIAL_PADDING);

  const [winSize, setWinSize] = useState({ w: 0, h: 0 });

  const [isFullView, setIsFullView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWinSize({ w: window.innerWidth, h: window.innerHeight });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridLayout = useMemo(() => {
    if (winSize.w === 0) return { slots: [], totalW: 0, totalH: 0 };

    const cols = Math.ceil(winSize.w / (CELL_WIDTH + GAP)) + 2;
    const rows = Math.ceil(winSize.h / (CELL_HEIGHT + GAP)) + 2;

    const finalCols = Math.max(cols, 6);
    const finalRows = Math.max(rows, 5);

    const totalW = finalCols * (CELL_WIDTH + GAP);
    const totalH = finalRows * (CELL_HEIGHT + GAP);

    const slots: GridSlot[] = Array.from({ length: finalCols * finalRows }).map(
      (_, i) => {
        const assetIndex = i % MY_PHOTOGRAPHY.length;
        return {
          id: `slot-${i}`,
          ...MY_PHOTOGRAPHY[assetIndex],
          index: MY_PHOTOGRAPHY.length - assetIndex,
          col: i % finalCols,
          row: Math.floor(i / finalCols),
        };
      }
    );

    return { slots, totalW, totalH };
  }, [winSize]);

  const springX = useSpring(mapX, { stiffness: 40, damping: 20, mass: 0.6 });
  const springY = useSpring(mapY, { stiffness: 40, damping: 20, mass: 0.6 });

  const handleWheel = (e: React.WheelEvent) => {
    mapX.set(mapX.get() - e.deltaX);
    mapY.set(mapY.get() - e.deltaY);
  };

  const handlePan = (_: PointerEvent, info: { delta: { x: number; y: number } }) => {
    mapX.set(mapX.get() + info.delta.x);
    mapY.set(mapY.get() + info.delta.y);
  };

  const viewport = "h-screen w-screen overflow-hidden relative touch-none bg-neutral-50";

  if (winSize.w === 0) return <div className={viewport} />;

  return (
    <>
      <div className={viewport} onWheel={handleWheel}>
        {!isFullView && <div className="fixed inset-0 bg-black/50 pointer-events-none z-3" />}
        <Button className="z-999999 absolute" onClick={() => setIsFullView(true)}> Full View </Button>
        <Button className="z-999999 absolute" onClick={() => setIsFullView(false)}> Close </Button>

        <motion.div
          className="w-full h-full absolute inset-0"
          onPan={handlePan}
          style={{ cursor: "grab" }}
          whileTap={{ cursor: "grabbing" }}
        >
          {gridLayout.slots.map((slot) => (
            <GridItem
              key={slot.id}
              data={slot}
              mapX={springX}
              mapY={springY}
              winSize={winSize}
              totalW={gridLayout.totalW}
              totalH={gridLayout.totalH}
              index={slot.index}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
}

function GridItem({
  data,
  mapX,
  mapY,
  winSize,
  index,
  totalW,
  totalH,
}: GridItemProps) {
  const baseX = data.col * (CELL_WIDTH + GAP);
  const baseY = data.row * (CELL_HEIGHT + GAP);

  const x = useTransform(mapX, (latest) => {
    let rawX = (baseX + latest + totalW * 1000) % totalW;
    if (rawX < -CELL_WIDTH) rawX += totalW;
    if (rawX > winSize.w + (CELL_WIDTH + GAP)) rawX -= totalW;
    return rawX;
  });

  const y = useTransform(mapY, (latest) => {
    let rawY = (baseY + latest + totalH * 1000) % totalH;
    if (rawY < -CELL_HEIGHT) rawY += totalH;
    if (rawY > winSize.h + (CELL_HEIGHT + GAP)) rawY -= totalH;
    return rawY;
  });

  const opacity = useTransform([x, y], ([latestX, latestY]) => {
    const buffer = 200;
    return (latestX as number) > -CELL_WIDTH - buffer &&
      (latestX as number) < winSize.w + buffer &&
      (latestY as number) > -CELL_HEIGHT - buffer &&
      (latestY as number) < winSize.h + buffer
      ? 1
      : 0;
  });

  return (
    <motion.div
      className="group absolute bg-neutral-100 user-select-none will-change-transform overflow-hidden"
      style={{ x, y, opacity, width: CELL_WIDTH, height: CELL_HEIGHT }}
    >
      <img
        src={data.url}
        className="w-full h-full object-cover pointer-events-none transition-transform duration-800 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
        alt={data.title || "Alt image description"}
        loading="lazy"
      />
      <p className="absolute select-none bottom-4 left-4 text-xs text-muted-foreground font-mono font-medium text-uppercase mix-blend-difference">INDX. {index.toString().padStart(9, "0")}</p>
    </motion.div>
  );
}