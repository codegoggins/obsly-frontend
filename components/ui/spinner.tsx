"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: number;
  className?: string;
};

// loading spinner; inherits the current text color
export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <motion.span
      className={cn("inline-block rounded-full border-2 border-current/25 border-t-current", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}
