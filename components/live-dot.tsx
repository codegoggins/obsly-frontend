// pulsing status dot used across the app
const TONE = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
};

type LiveDotProps = {
  tone?: keyof typeof TONE;
  size?: number;
};

export function LiveDot({ tone = "ok", size = 8 }: LiveDotProps) {
  return (
    <span
      className="live-dot inline-block rounded-full"
      style={{ width: size, height: size, background: `hsl(${TONE[tone]})` }}
    />
  );
}
