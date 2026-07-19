import Link from "next/link";
import { Search, GraduationCap, BookOpen, FileCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppLocale } from "@/i18n/config";

export function Hero({
  locale,
  title,
  subtitle,
  searchPlaceholder,
  ctas,
}: {
  locale: AppLocale;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  ctas: { findUniversity: string; explorePrograms: string; startApplication: string; getConsultation: string };
}) {
  return (
    <section className="relative overflow-hidden bg-brand-gradient text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, white 0, transparent 40%), radial-gradient(circle at 85% 60%, white 0, transparent 35%)",
        }}
      />
      <div className="container relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-white/85 md:text-lg">{subtitle}</p>

          <form
            action={`/${locale}/search`}
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-elevated"
          >
            <Search className="ms-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              name="q"
              placeholder={searchPlaceholder}
              className="h-11 border-none text-foreground shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="default" className="shrink-0">
              Search
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href={`/${locale}/apply`}>
                <FileCheck className="h-4 w-4" /> {ctas.startApplication}
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href={`/${locale}/universities`}>
                <GraduationCap className="h-4 w-4" /> {ctas.findUniversity}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/15"
            >
              <Link href={`/${locale}/programs`}>
                <BookOpen className="h-4 w-4" /> {ctas.explorePrograms}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/15"
            >
              <Link href={`/${locale}/consultation`}>
                <MessageCircle className="h-4 w-4" /> {ctas.getConsultation}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
