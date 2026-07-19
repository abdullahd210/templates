"use server";

import { db } from "@/lib/db";
import { leadCaptureSchema, consultationSchema, contactSchema } from "@/validation/lead.schema";
import type { LeadCaptureInput, ConsultationInput, ContactInput } from "@/validation/lead.schema";
import { ValidationError, toUserMessage } from "@/lib/errors";

export interface ActionResult {
  success: boolean;
  message: string;
}

/** Public lead-capture form (homepage, program/university/scholarship pages). */
export async function createLead(input: LeadCaptureInput): Promise<ActionResult> {
  const parsed = leadCaptureSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const { fullName, email, phone, desiredMajor, marketingConsent } = parsed.data;

  try {
    const source = await db.leadSource.findUniqueOrThrow({ where: { key: "website" } });
    await db.lead.create({
      data: {
        fullName,
        email,
        phone,
        desiredMajor: desiredMajor || undefined,
        sourceId: source.id,
        marketingConsent,
      },
    });
    return { success: true, message: "Thank you! A FastUniApply consultant will reach out to you shortly." };
  } catch (error) {
    return { success: false, message: toUserMessage(error) };
  }
}

/** Free-consultation request form (/consultation). */
export async function createConsultationRequest(input: ConsultationInput): Promise<ActionResult> {
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const { fullName, email, phone, whatsapp, nationality, desiredCountrySlug, educationLevel, desiredMajor, preferredTime, notes, marketingConsent } =
    parsed.data;

  try {
    const desiredCountry = desiredCountrySlug
      ? await db.country.findUnique({ where: { slug: desiredCountrySlug } })
      : null;

    await db.consultation.create({
      data: {
        fullName,
        email,
        phone,
        whatsapp: whatsapp || undefined,
        nationality: nationality || undefined,
        desiredCountryId: desiredCountry?.id,
        educationLevel: educationLevel || undefined,
        desiredMajor: desiredMajor || undefined,
        preferredTime: preferredTime || undefined,
        notes: notes || undefined,
        marketingConsent,
      },
    });
    return {
      success: true,
      message: "Your consultation request has been received. We'll contact you within one business day.",
    };
  } catch (error) {
    return { success: false, message: toUserMessage(error) };
  }
}

/** General contact form (/contact). */
export async function submitContactMessage(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const { fullName, email, department, message } = parsed.data;

  try {
    const source = await db.leadSource.findUniqueOrThrow({ where: { key: "website" } });
    await db.lead.create({
      data: {
        fullName,
        email,
        sourceId: source.id,
        marketingConsent: true,
      },
    });
    // The message body + department routing are logged via LeadActivity so
    // staff see the original inquiry text, not just a bare Lead record.
    const lead = await db.lead.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
    if (lead) {
      await db.leadActivity.create({
        data: { leadId: lead.id, type: "note", body: `[${department}] ${message}` },
      });
    }
    return { success: true, message: "Thanks for reaching out — our team will reply within 1–2 business days." };
  } catch (error) {
    return { success: false, message: toUserMessage(error) };
  }
}
