import { UserRound, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { IssueDetail } from "@/lib/mock/issue-detail";

// render **bold** spans inside the plain-english summary
function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function PlainEnglish({ detail }: { detail: IssueDetail }) {
  return (
    <Card className="border-primary/20 p-5">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <UserRound size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">In plain English</div>
          <p className="text-[0.9375rem] leading-relaxed text-foreground/90">{renderBold(detail.layman)}</p>
          {detail.impact && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-[0.78125rem]">
              <Flame size={13} className="text-danger" />
              <span className="font-medium text-foreground/90">{detail.impact}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
