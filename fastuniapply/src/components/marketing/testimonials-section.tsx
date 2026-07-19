import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";

export interface TestimonialData {
  studentName: string;
  quote: string;
  countryName?: string | null;
  universityName?: string | null;
  rating?: number | null;
}

export function TestimonialsSection({ title, testimonials }: { title: string; testimonials: TestimonialData[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Success Stories" title={title} />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.studentName} className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex gap-0.5 text-accent">
              {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm">
              <p className="font-semibold">{t.studentName}</p>
              {(t.universityName || t.countryName) && (
                <p className="text-muted-foreground">{[t.universityName, t.countryName].filter(Boolean).join(" · ")}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
