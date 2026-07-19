import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, isRtl, type AppLocale } from "@/i18n/config";
import { auth } from "@/server/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Cairo: the brand display font — rounded, native Arabic + Turkish-safe Latin
// glyph coverage, so headings read consistently in all three locales.
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

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
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
