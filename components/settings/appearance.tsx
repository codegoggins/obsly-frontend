"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun, swatch: "bg-zinc-100", fg: "text-zinc-700" },
  { value: "dark", label: "Dark", icon: Moon, swatch: "bg-zinc-900", fg: "text-zinc-300" },
  { value: "system", label: "System", icon: Monitor, swatch: "bg-linear-to-r from-zinc-100 to-zinc-900", fg: "text-zinc-500" },
];

// HSL triplets so they slot straight into our token vars
const ACCENTS = [
  { value: "violet", hsl: "263 90% 67%" },
  { value: "blue", hsl: "217 91% 60%" },
  { value: "teal", hsl: "172 66% 50%" },
  { value: "amber", hsl: "38 92% 55%" },
  { value: "rose", hsl: "347 89% 65%" },
];

export function Appearance() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState("violet");

  const pickAccent = (a: (typeof ACCENTS)[number]) => {
    setAccent(a.value);
    const root = document.documentElement;
    for (const v of ["--primary", "--brand", "--ring"]) root.style.setProperty(v, a.hsl);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="text-[0.78125rem] text-muted-foreground">Personalize how Obsly looks.</p>
      </div>

      <Card className="p-5">
        <div className="mb-2 text-[0.8125rem] font-medium">Theme</div>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const active = theme === t.value;
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                )}
              >
                <div className={cn("flex h-14 w-full items-center justify-center rounded-md", t.swatch)}>
                  <Icon size={18} className={t.fg} />
                </div>
                <span className="flex items-center gap-1.5 text-[0.78125rem] font-medium">
                  {t.label}
                  {active && <Check size={13} className="text-primary" />}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-3 text-[0.8125rem] font-medium">
          Accent color <span className="ml-1 font-normal text-muted-foreground">— preview only</span>
        </div>
        <div className="flex items-center gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              onClick={() => pickAccent(a)}
              aria-label={a.value}
              className={cn(
                "h-9 w-9 rounded-full transition-transform hover:scale-110",
                accent === a.value && "ring-2 ring-offset-2 ring-offset-background",
              )}
              style={{ background: `hsl(${a.hsl})`, "--tw-ring-color": `hsl(${a.hsl})` } as React.CSSProperties}
            >
              {accent === a.value && <Check size={16} className="mx-auto text-white" />}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
