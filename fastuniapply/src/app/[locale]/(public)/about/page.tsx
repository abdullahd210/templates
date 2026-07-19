import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { getPlatformStats } from "@/server/repositories/testimonial.repository";
import { Button } from "@/components/ui/button";
import { Target, Eye, HeartHandshake, Globe2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About FastUniApply",
  description: "FastUniApply's mission, vision, values, and story — helping international students find and apply to the right university, faster.",
};

const values = [
  { icon: ShieldCheck, title: "Trust", description: "Every recommendation and application is guided by what's actually best for the student." },
  { icon: Sparkles, title: "Speed", description: "We remove friction — clear steps, fast document review, real-time status tracking." },
  { icon: Globe2, title: "Access", description: "Quality education guidance shouldn't depend on where you were born or what you can afford." },
  { icon: HeartHandshake, title: "Partnership", description: "We work as an extension of our partner universities' admissions teams, not just a lead source." },
];

export default async function AboutPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const stats = await getPlatformStats();

  return (
    <div>
      <section className="bg-brand-gradient py-16 text-white">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-bold md:text-4xl">About FastUniApply</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            We help international students discover the right university, get expert guidance, and apply with
            confidence — from first search to enrollment day.
          </p>
        </div>
      </section>

      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">Our Story</h2>
            <p className="mt-3 text-muted-foreground">
              FastUniApply started from a simple observation: choosing and applying to a university abroad is one of
              the biggest decisions in a young person&apos;s life, yet the process is scattered across agents,
              outdated PDFs, and endless WhatsApp threads. We built a single platform where students can research
              universities and programs, get real consultation from education experts, and track every step of
              their application — while our partner universities get organized, qualified applicants instead of
              incomplete files.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <Target className="h-6 w-6 text-secondary" />
              <h3 className="mt-3 font-display text-lg font-semibold">Mission</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Make world-class higher education discoverable and reachable for every student, everywhere.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Eye className="h-6 w-6 text-secondary" />
              <h3 className="mt-3 font-display text-lg font-semibold">Vision</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                A world where geography and guesswork no longer decide where a student gets to study.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-center font-display text-2xl font-bold text-primary">Our Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="h-5.5 w-5.5" />
                </div>
                <p className="mt-3 font-display font-semibold">{v.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-8 text-center md:grid-cols-4">
          <StatItem value={`${stats.universities}+`} label="Partner Universities" />
          <StatItem value={`${stats.programs}+`} label="Academic Programs" />
          <StatItem value={`${stats.countries}`} label="Study Destinations" />
          <StatItem value={`${stats.applications}+`} label="Applications Guided" />
        </div>

        <div className="mt-16 text-center">
          <h2 className="font-display text-2xl font-bold text-primary">Work with us</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            We partner with universities and educational agents worldwide. If you&apos;d like to join us, we&apos;d
            love to hear from you.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent">
              <Link href={`/${locale}/partnerships/become-a-partner`}>Become a Partner University</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/partnerships/become-an-agent`}>Become an Educational Agent</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-primary md:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground md:text-sm">{label}</p>
    </div>
  );
}
