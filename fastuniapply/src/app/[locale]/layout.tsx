import type { Metadata } from "next";
import { Inter, Cairo, Fredoka } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, isRtl, type AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Fredoka is the brand's actual display typeface (per the official logo
// file's embedded font) — used for Latin-script locales (en/tr). It has no
// Arabic glyphs, so Arabic uses Cairo instead: also rounded, and the
// closest match to Fredoka's voice with native Arabic + Turkish coverage.
// Which one backs the `--font-display` token is set per-locale below.
const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka", display: "swap" });
const cairo = Cairo({ subsets: ["latin", "arabic"], weight: ["600", "700", "800"], variable: "--font-cairo", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: {
      default: "FastUniApply — Your Fast Track to University Admission",
      template: "%s | FastUniApply",
    },
    description:
      "Discover universities, compare academic programs, find scholarships, and apply to study abroad with expert guidance from FastUniApply.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      locale,
      siteName: "FastUniApply",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, session] = await Promise.all([getMessages(), auth()]);
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const displayFontVar = isRtl(locale) ? "var(--font-cairo)" : "var(--font-fredoka)";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${fredoka.variable} ${cairo.variable}`}
      style={{ "--font-display": displayFontVar } as React.CSSProperties}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider session={session}>
            {children}
            <Toaster />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
