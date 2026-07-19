import { IssueDetailView } from "@/components/issues/issue-detail-view";
import { ISSUES } from "@/lib/mock/issues";

export function generateStaticParams() {
  return ISSUES.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: id };
}

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IssueDetailView id={id} />;
}
