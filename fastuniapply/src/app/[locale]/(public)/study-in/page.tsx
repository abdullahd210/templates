import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listDestinationCountries } from "@/server/repositories/country.repository";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: AppLocale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("studyDestinations"), description: "Explore study guides for FastUniApply's partner destinations." };
}

export default async function StudyDestinationsPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const countries = await listDestinationCountries();

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-primary">{t("studyDestinations")}</h1>
      <p className="mt-2 text-muted-foreground">Country-specific guides covering education systems, costs, visas, and more.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <Link key={c.slug} href={`/${locale}/study-in/${c.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-elevated">
              <CardContent className="flex items-center justify-between gap-3 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c._count.universities} partner universities</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
