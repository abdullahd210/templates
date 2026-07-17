import Link from "next/link";
import { MessageCircle } from "lucide-react";

/** Sticky WhatsApp contact button, required on every public page (docs/01 spec). */
export function WhatsAppButton({ phoneNumber = "10000000000" }: { phoneNumber?: string }) {
  return (
    <Link
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </Link>
  );
}
