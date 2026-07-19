// GitHub-style yearly issue-activity calendar, generated deterministically per year

export const YEARS = [2026, 2025, 2024];

export type ActivityCell = {
  date: string; // YYYY-MM-DD
  label: string; // "Thu, Jul 16 2026"
  count: number;
};

export type YearActivity = {
  weeks: (ActivityCell | null)[][]; // columns of 7 rows (Sun..Sat); null = padding
  months: { label: string; col: number }[];
  total: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");

// deterministic per-year issue counts — weekdays busier, seasonal drift, a few spikes
function dayCount(year: number, month: number, day: number, weekday: number, rnd: () => number) {
  const weekend = weekday === 0 || weekday === 6;
  let base = 6 + (weekend ? -3 : 4);
  base += Math.sin(((month + 1) / 12) * Math.PI * 2) * 4; // seasonal wave
  base += (rnd() - 0.5) * 10;
  // occasional incident bursts land on specific weekdays mid-year
  if ((month === 6 || month === 9) && day % 11 === 0 && !weekend) base += 22;
  if (rnd() > 0.94) base += 16;
  return Math.max(0, Math.round(base));
}

export function yearActivity(year: number): YearActivity {
  let s = ((year * 9301 + 49297) % 233280) || 7;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const weeks: (ActivityCell | null)[][] = [];
  const months: { label: string; col: number }[] = [];
  let total = 0;

  const first = new Date(year, 0, 1);
  const last = new Date(year, 11, 31);
  let col: (ActivityCell | null)[] = Array.from({ length: first.getDay() }, () => null); // lead padding

  for (const d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const month = d.getMonth();
    const day = d.getDate();
    const weekday = d.getDay();
    const count = dayCount(year, month, day, weekday, rnd);
    total += count;

    // the month's first day lands in the column currently being formed
    if (day === 1) months.push({ label: MONTHS[month], col: weeks.length });

    col.push({
      date: `${year}-${pad(month + 1)}-${pad(day)}`,
      label: `${WEEKDAYS[weekday]}, ${MONTHS[month]} ${day} ${year}`,
      count,
    });

    if (weekday === 6) {
      weeks.push(col);
      col = [];
    }
  }

  if (col.length) {
    while (col.length < 7) col.push(null);
    weeks.push(col);
  }

  return { weeks, months, total };
}
