"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { MenuPicker } from "@/components/ui/menu-picker";

const RANGES = ["Last 1h", "Last 24h", "Last 7d", "Last 30d"].map((r) => ({ value: r, label: r }));

// self-contained time-range dropdown used across toolbars
export function RangePicker({ defaultValue = "Last 24h" }: { defaultValue?: string }) {
  const [range, setRange] = useState(defaultValue);
  return <MenuPicker value={range} onChange={setRange} options={RANGES} icon={Clock} />;
}
