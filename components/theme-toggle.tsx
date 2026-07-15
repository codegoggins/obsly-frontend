"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // theme is only known in the browser, so wait until after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
    >
      {isDark ? "Switch to light" : "Switch to dark"}
    </button>
  );
}
