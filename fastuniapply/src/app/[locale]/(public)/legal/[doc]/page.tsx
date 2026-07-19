import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/config";

interface LegalDoc {
  title: string;
  sections: { heading: string; body: string }[];
}

// [DEMO CONTENT] — placeholder legal copy for development/QA. Must be
// reviewed and replaced by qualified legal counsel before production launch.
const legalDocs: Record<string, LegalDoc> = {
  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      { heading: "1. Information We Collect", body: "We collect information you provide directly (name, contact details, academic history, documents you upload) and information collected automatically (device, browser, and usage data) to operate the FastUniApply platform." },
      { heading: "2. How We Use Your Information", body: "We use your information to match you with universities and programs, process applications on your behalf, communicate with you about your applications, and improve our services." },
      { heading: "3. Sharing With Universities and Partners", body: "We share the minimum necessary application data with the universities, agents, or partners you choose to apply through. We never sell your personal data." },
      { heading: "4. Document Security", body: "Uploaded documents are stored in private, access-controlled storage and are never publicly accessible. Access is limited to you, your assigned consultant, and the universities you apply to." },
      { heading: "5. Your Rights", body: "You may access, correct, export, or request deletion of your personal data at any time by contacting privacy@fastuniapply.com, subject to records we're required to retain for legal or academic-record purposes." },
      { heading: "6. Data Retention", body: "We retain your data for as long as your account is active and as required to support any ongoing or completed applications, after which it is anonymized or deleted in line with applicable law." },
    ],
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    sections: [
      { heading: "1. Acceptance of Terms", body: "By creating an account or using FastUniApply, you agree to these Terms & Conditions and our Privacy Policy." },
      { heading: "2. Our Role", body: "FastUniApply provides educational consultancy and application-support services. We do not guarantee admission, scholarship award, or visa approval — final decisions rest with universities and government authorities." },
      { heading: "3. Account Responsibilities", body: "You are responsible for the accuracy of the information and documents you submit, and for keeping your account credentials secure." },
      { heading: "4. Fees", body: "Some services carry a fee, always disclosed before payment. University application and tuition fees are separate and are set by the receiving institution." },
      { heading: "5. Acceptable Use", body: "You agree not to submit false documents, misuse the platform, or attempt to access accounts or data that are not yours." },
      { heading: "6. Limitation of Liability", body: "FastUniApply is not liable for decisions made by third parties (universities, embassies, immigration authorities) or for delays outside our reasonable control." },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    sections: [
      { heading: "1. What Are Cookies", body: "Cookies are small text files stored on your device that help our website function correctly and let us understand how it's used." },
      { heading: "2. Types of Cookies We Use", body: "Essential cookies (required for login and core functionality), analytics cookies (to understand usage and improve the platform), and preference cookies (to remember your language and settings)." },
      { heading: "3. Managing Cookies", body: "You can control or disable cookies through your browser settings. Disabling essential cookies may affect core site functionality such as staying logged in." },
      { heading: "4. Third-Party Cookies", body: "Some analytics and marketing cookies may be set by trusted third-party providers we use to measure site performance." },
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    sections: [
      { heading: "1. Service Fees", body: "FastUniApply service fees are refundable in full if a request is made before your assigned consultant begins active work on your application." },
      { heading: "2. University Application Fees", body: "Application fees paid directly to a university are governed by that university's own refund policy and are generally non-refundable once submitted." },
      { heading: "3. Tuition Deposits", body: "Tuition deposits are held and refunded according to the receiving university's enrollment and deposit policy, which will be shared with you before payment." },
      { heading: "4. How to Request a Refund", body: "Submit a refund request through your student dashboard or by emailing billing@fastuniapply.com. Approved refunds are processed within 10 business days." },
    ],
  },
  "application-service-agreement": {
    title: "Application Service Agreement",
    sections: [
      { heading: "1. Scope of Service", body: "FastUniApply agrees to provide university and program guidance, application preparation support, document review, and submission assistance for the programs you select." },
      { heading: "2. Student Obligations", body: "You agree to provide accurate, complete, and timely documents and information required for your application(s)." },
      { heading: "3. Consultant Assignment", body: "You will be assigned a dedicated educational consultant who will guide you through each stage of your application and remain your primary point of contact." },
      { heading: "4. Application Outcomes", body: "While we prepare and review every application for completeness and quality, admission decisions are made solely by the receiving university." },
      { heading: "5. Termination", body: "Either party may terminate this agreement in writing at any time; fees for work already completed remain payable as described in our Refund Policy." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

export async function generateMetadata({ params: { doc } }: { params: { doc: string } }): Promise<Metadata> {
  const entry = legalDocs[doc];
  if (!entry) return {};
  return { title: entry.title };
}

export default function LegalDocPage({ params: { locale, doc } }: { params: { locale: AppLocale; doc: string } }) {
  setRequestLocale(locale);
  const entry = legalDocs[doc];
  if (!entry) notFound();

  return (
    <div className="container max-w-3xl py-14">
      <h1 className="font-display text-3xl font-bold text-primary">{entry.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026 — demo content for development and QA purposes.</p>
      <div className="mt-8 space-y-8">
        {entry.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-lg font-semibold text-primary">{s.heading}</h2>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
