import { Bug } from "lucide-react";
import { cn } from "@/lib/utils";

// size presets: [box, icon px, text]
const SIZES = {
  sm: { box: "h-6 w-6 rounded-md", icon: 12, text: "text-sm" },
  md: { box: "h-7 w-7 rounded-lg", icon: 18, text: "text-lg" },
  lg: { box: "h-9 w-9 rounded-xl", icon: 30, text: "text-[2rem]" },
};

type LogoProps = {
  size?: keyof typeof SIZES;
  showText?: boolean;
  className?: string;
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span
        className={cn("flex items-center justify-center text-white", s.box)}
      >
        <Bug size={s.icon} />
      </span>
      {showText && (
        <span
          className={cn("font-bold tracking-tight lowercase mb-0.5", s.text)}
        >
          obsly
        </span>
      )}
    </span>
  );
}
