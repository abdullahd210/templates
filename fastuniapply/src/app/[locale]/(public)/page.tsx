import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { AppLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

// This is a Phase 1 infrastructure shell, not the marketing homepage.
// It exists to prove the stack (i18n, RTL, auth, design system, layout) works
// end-to-end. The real homepage is built in Phase 3 — see
// docs/08-development-roadmap.md.

const shellChecklist = [
  "Next.js App Router + TypeScript",
  "Tailwind CSS design tokens + shadcn/ui-style components",
  "next-intl localization (English, Arabic, Turkish) with RTL",
  "Auth.js authentication foundation (Credentials + Prisma adapter)",
  "Prisma schema modeling the full platform",
  "Role-based access control primitives",
];

export default async function HomePage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center gap-10 py-20 text-center">
      <div>
        <Badge variant="muted" className="mb-4">
          Phase 1 — Infrastructure Shell
        </Badge>
        <h1 className="text-balance font-display text-3xl font-bold text-primary md:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">{t("heroSubtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href={`/${locale}/register`}>{nav("getStarted")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/login`}>{nav("login")}</Link>
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-xl text-start">
        <CardHeader>
          <CardTitle>Application shell status</CardTitle>
          <CardDescription>
            The public catalog, dashboards, and CRM ship in later phases (see the roadmap).
            This page exists to verify the foundation renders correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {shellChecklist.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
