import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { PartnerRequestForm } from "@/components/forms/partner-request-form";
import { Users, TrendingUp, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Partner University",
  description: "Partner with FastUniApply to reach qualified, guided international student applicants.",
};

const benefits = [
  { icon: Users, title: "Qualified Applicants", description: "Every application we submit is reviewed for completeness before it reaches your admissions team." },
  { icon: TrendingUp, title: "Grow Your Intake", description: "Reach international students across 3 languages and multiple regions through our platform." },
  { icon: Handshake, title: "Dedicated Support", description: "A named FastUniApply partnerships manager works directly with your admissions office." },
];

export default function BecomePartnerPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);

  return (
    <div className="container py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">Become a Partner University</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Join FastUniApply&apos;s network of partner universities and reach motivated, guided international
          applicants.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <b.icon className="h-5.5 w-5.5" />
            </div>
            <p className="mt-3 font-display font-semibold">{b.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{b.description}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <PartnerRequestForm type="UNIVERSITY" organizationLabel="University name" />
      </div>
    </div>
  );
}
