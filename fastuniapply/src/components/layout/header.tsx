import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/shared/logo";

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const cta = await getTranslations({ locale, namespace: "cta" });

  const links = [
    { href: `/${locale}/universities`, label: t("universities") },
    { href: `/${locale}/programs`, label: t("programs") },
    { href: `/${locale}/scholarships`, label: t("scholarships") },
    { href: `/${locale}/study-in`, label: t("studyDestinations") },
    { href: `/${locale}/articles`, label: t("articles") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container relative flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher currentLocale={locale} />
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/login`}>{t("login")}</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link href={`/${locale}/consultation`}>{cta("getConsultation")}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher currentLocale={locale} />
          <MobileNav links={links} loginLabel={t("login")} loginHref={`/${locale}/login`} />
        </div>
      </div>
    </header>
  );
}
