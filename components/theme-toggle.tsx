"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

// The app sets `disableTransitionOnChange`, so next-themes briefly forces
// `transition: none` on everything during a theme swap — that kills CSS
// transitions. Framer animates via JS (WAAPI/rAF), which isn't suppressed,
// so the icon still spins smoothly. The rotation reads clockwise: the old
// icon exits +90°, the new one enters from -90° to 0°.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="ring-focus relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {mounted ? (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute flex items-center justify-center"
          >
            {isDark ? <Moon size={17} /> : <Sun size={17} />}
          </motion.span>
        </AnimatePresence>
      ) : (
        <Sun size={17} />
      )}
    </button>
  );
}
