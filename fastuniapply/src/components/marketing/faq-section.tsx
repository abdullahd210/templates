import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./section-heading";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="container py-16">
      {title && <SectionHeading eyebrow="Support" title={title} />}
      <div className="mx-auto mt-8 max-w-3xl divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item) => (
          <details key={item.question} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {item.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
