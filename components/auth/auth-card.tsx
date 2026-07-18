// shared heading + body wrapper for every auth screen
type AuthCardProps = {
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
};

export function AuthCard({ eyebrow, title, sub, children }: AuthCardProps) {
  return (
    <div className="fade-up w-full max-w-100 space-y-6">
      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </div>
        <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight">{title}</h1>
        <p className="mt-2 text-[0.84375rem] leading-relaxed text-muted-foreground">{sub}</p>
      </div>
      {children}
    </div>
  );
}
