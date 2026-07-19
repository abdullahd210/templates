import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";
import { ContactForm } from "@/components/forms/contact-form";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with FastUniApply — office details, phone, WhatsApp, email, and a contact form.",
};

export default function ContactPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  setRequestLocale(locale);

  const details = [
    { icon: MapPin, label: "Office", value: "Levent, Istanbul, Türkiye" },
    { icon: Phone, label: "Phone", value: "+90 212 000 00 00" },
    { icon: MessageCircle, label: "WhatsApp", value: "+90 500 000 00 00" },
    { icon: Mail, label: "Email", value: "hello@fastuniapply.com" },
    { icon: Clock, label: "Hours", value: "Mon–Fri, 09:00–18:00 (GMT+3)" },
  ];

  return (
    <div className="container py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Have a question about a university, program, or your application? Reach out and our team will respond
          within 1–2 business days.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">{d.label}</p>
                <p className="font-medium">{d.value}</p>
              </div>
            </div>
          ))}
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title="FastUniApply office location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.97%2C41.07%2C29.03%2C41.10&layer=mapnik"
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
