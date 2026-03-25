"use client";

import { MOTION_EASE, cn, useLiteMotion } from "@/shared/lib";
import { motion, useInView } from "motion/react";
import type { Variant } from "motion/react";
import { useRef } from "react";

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right";

interface AnimatedRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  blur?: boolean;
}

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 100 },
  down: { x: 0, y: -100 },
  left: { x: 100, y: 0 },
  right: { x: -100, y: 0 },
  "up-left": { x: 80, y: 80 },
  "up-right": { x: -80, y: 80 },
  "down-left": { x: 80, y: -80 },
  "down-right": { x: -80, y: -80 },
};

const LITE_OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  "up-left": { x: 20, y: 20 },
  "up-right": { x: -20, y: 20 },
  "down-left": { x: 20, y: -20 },
  "down-right": { x: -20, y: -20 },
};

export function AnimatedReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  threshold = 0.2,
  once = true,
  blur = false,
}: AnimatedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const liteMotion = useLiteMotion();

  const { x, y } = (liteMotion ? LITE_OFFSETS : OFFSETS)[direction];
  const dur = liteMotion ? Math.min(duration, 0.45) : duration;
  const del = liteMotion ? Math.min(delay, 0.12) : delay;
  const backdropBlur = blur && !liteMotion ? "blur(18px)" : undefined;

  const hidden: Variant = { opacity: 0.001, x, y };
  const visible: Variant = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      ref={ref}
      className={cn("transform-gpu", className)}
      initial={hidden}
      animate={isInView ? visible : hidden}
      style={{
        ...(backdropBlur && {
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
        }),
        willChange: isInView ? "auto" : "transform, opacity",
      }}
      transition={{ duration: dur, delay: del, ease: MOTION_EASE }}
    >
      {children}
    </motion.div>
  );
}
