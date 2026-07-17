import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import type { AppLocale } from "@/i18n/config";

export default function PublicLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: AppLocale };
}) {
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </div>
  );
}
