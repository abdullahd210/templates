import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the FastUniApply team and help international students reach the right university.",
};

// [DEMO CONTENT] — sample open roles for development/QA.
const openRoles = [
  { title: "Educational Consultant", location: "Istanbul, Türkiye (Hybrid)", type: "Full-time" },
  { title: "Admissions Officer", location: "Remote", type: "Full-time" },
  { title: "Content Editor (Arabic/English)", location: "Remote", type: "Part-time" },
  { title: "Partnerships Manager", location: "Istanbul, Türkiye", type: "Full-time" },
];

export default function CareersPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);

  return (
    <div>
      <section className="bg-brand-gradient py-16 text-center text-white">
        <div className="container">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Careers at FastUniApply</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Help us make world-class education reachable for students everywhere.
          </p>
        </div>
      </section>

      <div className="container py-14">
        <div className="mx-auto max-w-2xl space-y-4">
          {openRoles.map((role) => (
            <div
              key={role.title}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div>
                <p className="font-display font-semibold">{role.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {role.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {role.type}
                  </span>
                </div>
              </div>
              <Badge variant="muted">Open</Badge>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Don&apos;t see a role that fits? We&apos;d still like to hear from you.</p>
          <Button asChild variant="accent" className="mt-4">
            <Link href={`/${locale}/contact`}>Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
