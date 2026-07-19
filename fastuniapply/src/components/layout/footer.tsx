import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { Logo } from "@/components/shared/logo";

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "nav" });

  const columns: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: "Discover",
      links: [
        { href: `/${locale}/universities`, label: t("universities") },
        { href: `/${locale}/programs`, label: t("programs") },
        { href: `/${locale}/scholarships`, label: t("scholarships") },
        { href: `/${locale}/study-in`, label: t("studyDestinations") },
      ],
    },
    {
      title: "Company",
      links: [
        { href: `/${locale}/about`, label: t("about") },
        { href: `/${locale}/success-stories`, label: "Success Stories" },
        { href: `/${locale}/careers`, label: "Careers" },
        { href: `/${locale}/contact`, label: t("contact") },
      ],
    },
    {
      title: "Partners",
      links: [
        { href: `/${locale}/partnerships/become-a-partner`, label: "Become a Partner University" },
        { href: `/${locale}/partnerships/become-an-agent`, label: "Become an Educational Agent" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: `/${locale}/legal/privacy-policy`, label: "Privacy Policy" },
        { href: `/${locale}/legal/terms-and-conditions`, label: "Terms & Conditions" },
        { href: `/${locale}/legal/cookie-policy`, label: "Cookie Policy" },
        { href: `/${locale}/legal/refund-policy`, label: "Refund Policy" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div>
          <Logo variant="inverted" />
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Your Fast Track to University Admission. Discover universities, compare
            programs, and apply with expert guidance.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
              {col.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-primary-foreground/85 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} FastUniApply. All rights reserved.</p>
          <p>Demo content is clearly labeled and intended for evaluation only.</p>
        </div>
      </div>
    </footer>
  );
}
