import type { LucideIcon } from "lucide-react";

// card/section heading with an optional right-aligned action
type SectionTitleProps = {
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function SectionTitle({ icon: Icon, action, children }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {Icon && <Icon size={15} className="text-muted-foreground" />}
        {children}
      </div>
      {action}
    </div>
  );
}
