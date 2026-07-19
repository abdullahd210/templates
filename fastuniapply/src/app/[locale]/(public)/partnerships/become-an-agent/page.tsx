import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { PartnerRequestForm } from "@/components/forms/partner-request-form";
import { Wallet, LineChart, Headset } from "lucide-react";

export const metadata: Metadata = {
  title: "Become an Educational Agent",
  description: "Join FastUniApply's agent network — submit students, track applications, and earn commissions.",
};

const benefits = [
  { icon: Wallet, title: "Transparent Commissions", description: "Clear, published commission rates per university, paid on confirmed enrollment." },
  { icon: LineChart, title: "Real-Time Tracking", description: "Track every student you refer from lead to enrollment in your own agent dashboard." },
  { icon: Headset, title: "Marketing Support", description: "Access ready-to-use marketing materials and a dedicated FastUniApply account manager." },
];

export default function BecomeAgentPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);

  return (
    <div className="container py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">Become an Educational Agent</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Partner with FastUniApply to submit and track your students&apos; applications, and earn commission on
          every enrollment.
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
        <PartnerRequestForm type="AGENT" organizationLabel="Company / agency name" />
      </div>
    </div>
  );
}
