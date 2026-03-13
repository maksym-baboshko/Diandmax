"use client";

import { useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";
import { cn } from "@/shared/lib/cn";

type Direction = "up" | "down" | "left" | "right" | "up-left" | "up-right" | "down-left" | "down-right";

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

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 100 },
  down: { x: 0, y: -100 },
  left: { x: 100, y: 0 },
  right: { x: -100, y: 0 },
  "up-left": { x: 80, y: 80 },
  "up-right": { x: -80, y: 80 },
  "down-left": { x: 80, y: -80 },
  "down-right": { x: -80, y: -80 },
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

  const { x, y } = directionOffsets[direction];

  const hidden: Variant = {
    opacity: 0.001,
    x,
    y,
    ...(blur && { backdropFilter: "blur(0px)" }),
  };

  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(blur && { backdropFilter: "blur(32px)" }),
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
        ...(blur && { backdropFilter: { duration: duration * 1.5, ease: "easeOut" } }),
      }}
    >
      {children}
    </motion.div>
  );
}
