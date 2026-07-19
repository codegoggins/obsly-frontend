import { cn } from "@/lib/utils";

// tiny token highlighter: strings, keywords, literals — returns react nodes
function highlight(line: string) {
  if (line.trim().startsWith("//")) return line;
  const re = /("[^"]*"|\b(?:import|from|init|process|env|true|false)\b|[{}])/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    const t = m[0];
    let cls = "";
    if (t.startsWith('"')) cls = "text-ok";
    else if (/import|from/.test(t)) cls = "text-primary";
    else if (/init|process|env/.test(t)) cls = "text-warn";
    else if (/true|false/.test(t)) cls = "text-danger";
    parts.push(
      cls ? (
        <span key={key++} className={cls}>
          {t}
        </span>
      ) : (
        t
      ),
    );
    last = m.index + t.length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

type CodeBlockProps = {
  code: string;
  className?: string;
};

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-muted/50", className)}>
      <pre className="overflow-x-auto p-3.5 font-mono text-[0.75rem] leading-[1.7] text-foreground/85">
        {code.split("\n").map((line, i) => (
          <div key={i} className={cn(line.trim().startsWith("//") && "text-muted-foreground/70")}>
            {highlight(line)}
          </div>
        ))}
      </pre>
    </div>
  );
}
