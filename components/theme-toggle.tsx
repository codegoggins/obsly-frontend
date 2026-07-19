"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// icons are driven by the `.dark` class (pure CSS), so they cross-fade + rotate
// smoothly without waiting for JS — no mounted guard or hydration flash needed
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="ring-focus relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Sun
        size={17}
        className="rotate-0 scale-100 transition-all duration-500 ease-out dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={17}
        className="absolute rotate-90 scale-0 transition-all duration-500 ease-out dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}
