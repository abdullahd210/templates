import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Success Stories",
  description: "Real stories from students who found their university and built their future with FastUniApply.",
};

export default async function SuccessStoriesPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const testimonials = await db.testimonial.findMany({
    include: { country: true, university: { include: { translations: true } } },
    orderBy: { featured: "desc" },
  });

  return (
    <div>
      <section className="bg-brand-gradient py-16 text-center text-white">
        <div className="container">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Student Success Stories</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Real students, real universities, real outcomes — hear from the people we&apos;ve guided from first
            search to enrollment.
          </p>
        </div>
      </section>

      <div className="container py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => {
            const universityName = t.university?.translations.find((tr) => tr.locale === locale)?.name ?? t.university?.translations[0]?.name;
            return (
              <figure key={t.id} className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <p className="font-semibold">{t.studentName}</p>
                  {(universityName || t.country?.name) && (
                    <p className="text-muted-foreground">{[universityName, t.country?.name].filter(Boolean).join(" · ")}</p>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
