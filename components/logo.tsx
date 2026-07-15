import { AiFillBug } from "react-icons/ai";
import { cn } from "@/lib/utils";

// size presets: [box, icon px, text]
const SIZES = {
  sm: { box: "h-6 w-6 rounded-md", icon: 14, text: "text-sm" },
  md: { box: "h-7 w-7 rounded-lg", icon: 17, text: "text-[15px]" },
  lg: { box: "h-9 w-9 rounded-xl", icon: 22, text: "text-xl" },
};

type LogoProps = {
  size?: keyof typeof SIZES;
  showText?: boolean;
  className?: string;
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground",
          s.box,
        )}
      >
        <AiFillBug size={s.icon} />
      </span>
      {showText && (
        <span className={cn("font-bold tracking-tight lowercase", s.text)}>
          obsly
        </span>
      )}
    </span>
  );
}
