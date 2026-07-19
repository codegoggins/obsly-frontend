"use client";

import { useState } from "react";
import { ChevronsUpDown, Plus, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORGS } from "@/lib/mock/orgs";

// avatar with the org initial on the brand gradient
function OrgMark({ initial }: { initial: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-primary to-purple-500 text-[0.75rem] font-bold text-white">
      {initial}
    </span>
  );
}

export function OrgSwitcher() {
  const [orgId, setOrgId] = useState(ORGS[0].id);
  const current = ORGS.find((o) => o.id === orgId) ?? ORGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ring-focus flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-accent aria-expanded:border-primary/40 aria-expanded:bg-accent">
        <OrgMark initial={current.initial} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.78125rem] font-semibold">{current.name}</div>
          <div className="truncate text-[0.65625rem] text-muted-foreground">
            {current.plan} · {current.projects} projects
          </div>
        </div>
        <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[13.5rem]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {ORGS.map((org) => (
            <DropdownMenuItem key={org.id} onClick={() => setOrgId(org.id)}>
              <OrgMark initial={org.initial} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[0.78125rem] font-medium">{org.name}</div>
                <div className="truncate text-[0.65625rem] text-muted-foreground">{org.plan}</div>
              </div>
              {org.id === orgId ? (
                <Check size={15} className="text-primary" />
              ) : (
                <Badge tone="muted" className="text-[0.625rem]">
                  {org.projects}
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-foreground/85">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
            <Plus size={14} />
          </span>
          New organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
