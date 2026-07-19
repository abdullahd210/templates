import { z } from "zod";

export const partnerRequestSchema = z.object({
  contactName: z.string().min(2, "Please enter your name").max(120),
  contactEmail: z.string().email("Enter a valid email address"),
  contactPhone: z.string().max(30).optional().or(z.literal("")),
  companyOrUniversityName: z.string().min(2, "Please enter an organization name").max(200),
  message: z.string().max(2000).optional().or(z.literal("")),
});
export type PartnerRequestInput = z.infer<typeof partnerRequestSchema>;
