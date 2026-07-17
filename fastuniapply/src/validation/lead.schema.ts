import { z } from "zod";

/**
 * Shared between the public lead-capture form (client, via zodResolver) and the
 * server action / API route that creates the Lead record — one schema, two
 * enforcement points (see docs/05-technical-architecture.md §6).
 */
export const leadCaptureSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  desiredCountry: z.string().optional(),
  desiredMajor: z.string().optional(),
  marketingConsent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to be contacted about your inquiry" }),
  }),
});

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
