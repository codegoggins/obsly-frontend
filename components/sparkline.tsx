// tiny inline SVG line chart, deterministic so it is SSR-safe
const TONE: Record<string, string> = {
  brand: "var(--brand)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  ok: "var(--ok)",
};

type SparklineProps = {
  data: number[];
  w?: number;
  h?: number;
  tone?: keyof typeof TONE;
  fill?: boolean;
  strokeW?: number;
};

export function Sparkline({
  data,
  w = 84,
  h = 26,
  tone = "brand",
  fill = true,
  strokeW = 1.6,
}: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1][0].toFixed(1)} ${h} L${points[0][0].toFixed(1)} ${h} Z`;
  const color = `hsl(${TONE[tone]})`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      {fill && <path d={area} fill={color} fillOpacity={0.12} />}
      <path
        d={line}
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
