"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// wraps the app so any component can read or change the theme
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
