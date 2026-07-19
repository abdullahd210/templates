import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { listAllCountries } from "@/server/repositories/country.repository";
import { ConsultationForm } from "@/components/forms/consultation-form";

export const metadata: Metadata = {
  title: "Free Consultation",
  description: "Book a free consultation with a FastUniApply education expert to plan your university application.",
};

export default async function ConsultationPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale };
  searchParams: { country?: string };
}) {
  setRequestLocale(locale);
  const countries = await listAllCountries();

  return (
    <div className="container max-w-3xl py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">Get Your Free Consultation</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Tell us about your goals and one of our education consultants will reach out within one business day to
          help you find the right university and program.
        </p>
      </div>
      <div className="mt-10">
        <ConsultationForm
          countries={countries.map((c) => ({ slug: c.slug, name: c.name }))}
          defaultCountrySlug={searchParams.country}
        />
      </div>
    </div>
  );
}
