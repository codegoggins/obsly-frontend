"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

// shadcn-style calendar on react-day-picker v10; captionLayout="dropdown"
// renders month + year <select>s so you can jump years/months in one click
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  startMonth = new Date(2020, 0),
  endMonth = new Date(2027, 11),
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn("p-1", className)}
      classNames={{
        months: "relative flex flex-col gap-4",
        month: "relative flex flex-col gap-3",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "inline-flex items-center gap-1 text-sm font-medium",
        dropdowns: "flex items-center gap-1",
        dropdown_root: "relative inline-flex items-center rounded-md px-2 py-1 text-sm font-medium hover:bg-accent",
        dropdown: "absolute inset-0 cursor-pointer opacity-0",
        nav: "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-0.5",
        button_previous: "ring-focus pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30",
        button_next: "ring-focus pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-[0.6875rem] font-normal text-muted-foreground",
        weeks: "mt-1 flex flex-col gap-1",
        week: "flex w-full",
        day: "relative h-9 w-9 p-0 text-center text-sm",
        day_button: "ring-focus inline-flex h-9 w-9 items-center justify-center rounded-md font-normal transition-colors hover:bg-accent",
        today: "font-semibold text-primary",
        outside: "text-muted-foreground/40",
        disabled: "text-muted-foreground/30",
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary",
        range_start: "rounded-l-md bg-primary/15 [&>button]:bg-primary [&>button]:text-primary-foreground",
        range_end: "rounded-r-md bg-primary/15 [&>button]:bg-primary [&>button]:text-primary-foreground",
        range_middle: "bg-primary/15 [&>button]:rounded-none [&>button]:bg-transparent [&>button:hover]:bg-primary/20",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeft size={16} />;
          if (orientation === "right") return <ChevronRight size={16} />;
          return <ChevronDown size={14} className="ml-0.5 text-muted-foreground" />;
        },
      }}
      {...props}
    />
  );
}
