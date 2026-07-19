"use server";

import { db } from "@/lib/db";
import { partnerRequestSchema, type PartnerRequestInput } from "@/validation/partner.schema";
import { ValidationError, toUserMessage } from "@/lib/errors";
import type { PartnerType } from "@prisma/client";
import type { ActionResult } from "./lead";

export async function submitPartnerRequest(type: PartnerType, input: PartnerRequestInput): Promise<ActionResult> {
  const parsed = partnerRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  try {
    await db.partner.create({
      data: { type, ...parsed.data, status: "PENDING" },
    });
    return {
      success: true,
      message:
        type === "UNIVERSITY"
          ? "Thank you! Our partnerships team will review your request and reach out within 3–5 business days."
          : "Thank you! Our team will review your agent application and follow up within 3–5 business days.",
    };
  } catch (error) {
    return { success: false, message: toUserMessage(error) };
  }
}
