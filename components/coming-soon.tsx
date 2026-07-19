import { Card } from "@/components/ui/card";

type ComingSoonProps = {
  title: string;
  subtitle?: string;
};

export function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-[1.375rem] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <Card className="flex h-64 items-center justify-center p-5 text-sm text-muted-foreground">
        {title} — coming soon
      </Card>
    </div>
  );
}
