import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listFaqs } from "@/server/repositories/testimonial.repository";
import { FaqSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = { title: "Frequently Asked Questions" };

export default async function FaqPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const faqs = await listFaqs("global", null, locale, 50);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.translation.question,
      acceptedAnswer: { "@type": "Answer", text: f.translation.answer },
    })),
  };

  return (
    <div className="py-6">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container pt-6 text-center">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">Frequently Asked Questions</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Everything you need to know about applying with FastUniApply.
        </p>
      </div>
      <FaqSection title="" items={faqs.map((f) => ({ question: f.translation.question, answer: f.translation.answer }))} />
    </div>
  );
}
