"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "ring-focus relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        "bg-input data-[checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[checked]:translate-x-[1.125rem]" />
    </SwitchPrimitive.Root>
  );
}
