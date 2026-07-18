// deterministic pseudo-random series so server and client render identical values
export function series(n: number, base: number, amp: number, seed = 7): number[] {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const wave = Math.sin(i / (n / 6)) * amp * 0.5;
    out.push(Math.max(0, Math.round(base + wave + (r - 0.5) * amp)));
  }
  return out;
}
