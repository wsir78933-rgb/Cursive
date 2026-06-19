"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const borderOrbitSize = 20;

type AnimatedButtonBorderProps = {
  className?: string;
};

export function AnimatedButtonBorder({ className }: AnimatedButtonBorderProps) {
  const orbitStyle = {
    width: borderOrbitSize,
    offsetPath: `rect(0 auto auto 0 round ${borderOrbitSize}px)`
  } satisfies CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-transparent border-inset [mask-clip:padding-box,border-box]",
        "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
      data-testid="animated-button-border"
    >
      <motion.div
        animate={{ offsetDistance: ["0%", "100%"] }}
        className="absolute aspect-square bg-gradient-to-r from-transparent via-accent to-accent"
        style={orbitStyle}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: "linear"
        }}
      />
    </div>
  );
}
