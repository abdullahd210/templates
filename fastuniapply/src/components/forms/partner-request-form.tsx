"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerRequestSchema, type PartnerRequestInput } from "@/validation/partner.schema";
import { submitPartnerRequest } from "@/server/actions/partner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PartnerType } from "@prisma/client";

export function PartnerRequestForm({ type, organizationLabel }: { type: PartnerType; organizationLabel: string }) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerRequestInput>({ resolver: zodResolver(partnerRequestSchema) });

  async function onSubmit(values: PartnerRequestInput) {
    const res = await submitPartnerRequest(type, values);
    setResult(res);
  }

  if (result?.success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
        <p className="font-display text-xl font-semibold text-primary">Request received!</p>
        <p className="mt-2 text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-soft">
      {result && !result.success && (
        <Alert variant="destructive">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="contactName">Your name</Label>
        <Input id="contactName" className="mt-1.5" {...register("contactName")} aria-invalid={!!errors.contactName} />
        {errors.contactName && <p className="mt-1 text-xs text-destructive">{errors.contactName.message}</p>}
      </div>
      <div>
        <Label htmlFor="contactEmail">Email</Label>
        <Input id="contactEmail" type="email" className="mt-1.5" {...register("contactEmail")} aria-invalid={!!errors.contactEmail} />
        {errors.contactEmail && <p className="mt-1 text-xs text-destructive">{errors.contactEmail.message}</p>}
      </div>
      <div>
        <Label htmlFor="contactPhone">Phone (optional)</Label>
        <Input id="contactPhone" className="mt-1.5" {...register("contactPhone")} />
      </div>
      <div>
        <Label htmlFor="companyOrUniversityName">{organizationLabel}</Label>
        <Input
          id="companyOrUniversityName"
          className="mt-1.5"
          {...register("companyOrUniversityName")}
          aria-invalid={!!errors.companyOrUniversityName}
        />
        {errors.companyOrUniversityName && (
          <p className="mt-1 text-xs text-destructive">{errors.companyOrUniversityName.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="message">Tell us about yourselves (optional)</Label>
        <Textarea id="message" className="mt-1.5" rows={4} {...register("message")} />
      </div>
      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
