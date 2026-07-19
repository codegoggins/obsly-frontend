import { IssuesView } from "@/components/issues/issues-view";

export const metadata = { title: "Issues" };

export default async function IssuesPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; date?: string }> }) {
  const sp = await searchParams;
  const from = sp.from ?? sp.date ?? null;
  const to = sp.to ?? sp.date ?? null;
  return <IssuesView from={from} to={to} />;
}
