"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { Badge } from "@/components/ui/badge";
import { CalendarHeatmap } from "@/components/ui/calendar-heatmap";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheck,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { YEARS, yearActivity } from "@/lib/mock/activity";

export function IssueFrequency() {
  const [year, setYear] = useState(YEARS[0]);
  const activity = useMemo(() => yearActivity(year), [year]);

  const yearPicker = (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "sm" })}>
        {year} <ChevronDown size={13} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {YEARS.map((y) => (
          <DropdownMenuCheck key={y} checked={y === year} onClick={() => setYear(y)}>
            {y}
          </DropdownMenuCheck>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card className="p-5">
      <SectionTitle icon={LayoutGrid} action={yearPicker}>
        Issue frequency
      </SectionTitle>
      <div className="-mt-1.5 mb-4 flex items-center gap-2 text-[0.75rem] text-muted-foreground">
        <span>Issues per day in {year} — darker means more.</span>
        <Badge tone="warn" className="font-mono">
          {activity.total.toLocaleString()} total
        </Badge>
      </div>
      <CalendarHeatmap activity={activity} tone="danger" />
    </Card>
  );
}
