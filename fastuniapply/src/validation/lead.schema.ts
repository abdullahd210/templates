import { z } from "zod";

/**
 * Shared between the public lead-capture form (client, via zodResolver) and
 * the `createLead` server action — one schema, two enforcement points (see
 * docs/05-technical-architecture.md §6).
 */
export const leadCaptureSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  desiredMajor: z.string().max(120).optional().or(z.literal("")),
  marketingConsent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to be contacted about your inquiry" }),
  }),
});
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;

export const consultationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  whatsapp: z.string().max(30).optional().or(z.literal("")),
  nationality: z.string().max(80).optional().or(z.literal("")),
  desiredCountrySlug: z.string().optional().or(z.literal("")),
  educationLevel: z.string().max(80).optional().or(z.literal("")),
  desiredMajor: z.string().max(120).optional().or(z.literal("")),
  preferredTime: z.string().max(120).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  marketingConsent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to be contacted about your inquiry" }),
  }),
});
export type ConsultationInput = z.infer<typeof consultationSchema>;

export const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  department: z.enum(["admissions", "partnerships", "support", "general"]),
  message: z.string().min(10, "Please add a few details").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;
