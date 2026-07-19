import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/shared/logo";
import type { AppLocale } from "@/i18n/config";

export default function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: AppLocale };
}) {
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`}>
          <Logo />
        </Link>
        <LanguageSwitcher currentLocale={locale} />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">{children}</main>
    </div>
  );
}
