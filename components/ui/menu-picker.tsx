"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheck,
} from "@/components/ui/dropdown-menu";

type Option = { value: string; label: string };

type MenuPickerProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: LucideIcon;
  align?: "start" | "center" | "end";
};

// secondary-styled trigger + single-select menu, used across toolbars
export function MenuPicker({ value, onChange, options, icon: Icon, align = "end" }: MenuPickerProps) {
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "lg" })}>
        {Icon && <Icon size={14} />} {current.label} <ChevronDown size={13} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {options.map((o) => (
          <DropdownMenuCheck key={o.value} checked={o.value === value} onClick={() => onChange(o.value)}>
            {o.label}
          </DropdownMenuCheck>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
