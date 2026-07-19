"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadCaptureSchema, type LeadCaptureInput } from "@/validation/lead.schema";
import { createLead } from "@/server/actions/lead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LeadCaptureForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadCaptureInput>({ resolver: zodResolver(leadCaptureSchema) });

  async function onSubmit(values: LeadCaptureInput) {
    const res = await createLead(values);
    setResult(res);
  }

  if (result?.success) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
        <p className="font-display text-lg font-semibold text-primary">Thank you!</p>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
      {result && !result.success && (
        <Alert variant="destructive" className="sm:col-span-2">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
      <div className="sm:col-span-1">
        <Input placeholder="Full name" {...register("fullName")} aria-invalid={!!errors.fullName} />
        {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <Input placeholder="Email" type="email" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <Input placeholder="Phone / WhatsApp" {...register("phone")} aria-invalid={!!errors.phone} />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <Input placeholder="Desired major (optional)" {...register("desiredMajor")} />
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground sm:col-span-2">
        <Controller
          name="marketingConsent"
          control={control}
          render={({ field }) => (
            <Checkbox checked={field.value === true} onCheckedChange={(c) => field.onChange(c === true)} className="mt-0.5" />
          )}
        />
        I agree to be contacted by FastUniApply about my inquiry.
      </label>
      {errors.marketingConsent && (
        <p className="-mt-2 text-xs text-destructive sm:col-span-2">{errors.marketingConsent.message}</p>
      )}
      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="sm:col-span-2">
        {isSubmitting ? "Sending…" : "Get Free Consultation"}
      </Button>
    </form>
  );
}
