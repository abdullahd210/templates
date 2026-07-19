"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema, type ConsultationInput } from "@/validation/lead.schema";
import { createConsultationRequest } from "@/server/actions/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ConsultationForm({
  countries,
  defaultCountrySlug,
}: {
  countries: { slug: string; name: string }[];
  defaultCountrySlug?: string;
}) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { desiredCountrySlug: defaultCountrySlug ?? "" },
  });

  async function onSubmit(values: ConsultationInput) {
    const res = await createConsultationRequest(values);
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
      {result && !result.success && (
        <Alert variant="destructive" className="sm:col-span-2">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" className="mt-1.5" {...register("fullName")} aria-invalid={!!errors.fullName} />
        {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="mt-1.5" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" className="mt-1.5" {...register("phone")} aria-invalid={!!errors.phone} />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
        <Input id="whatsapp" className="mt-1.5" {...register("whatsapp")} />
      </div>
      <div>
        <Label htmlFor="nationality">Nationality (optional)</Label>
        <Input id="nationality" className="mt-1.5" {...register("nationality")} />
      </div>
      <div>
        <Label>Desired country</Label>
        <Controller
          name="desiredCountrySlug"
          control={control}
          render={({ field }) => (
            <Select value={field.value || "any"} onValueChange={(v) => field.onChange(v === "any" ? "" : v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Not sure yet</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="educationLevel">Current education level (optional)</Label>
        <Input id="educationLevel" className="mt-1.5" {...register("educationLevel")} />
      </div>
      <div>
        <Label htmlFor="desiredMajor">Desired major (optional)</Label>
        <Input id="desiredMajor" className="mt-1.5" {...register("desiredMajor")} />
      </div>
      <div>
        <Label htmlFor="preferredTime">Preferred consultation time (optional)</Label>
        <Input id="preferredTime" className="mt-1.5" placeholder="e.g. weekday evenings" {...register("preferredTime")} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" className="mt-1.5" rows={4} {...register("notes")} />
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
        {isSubmitting ? "Sending…" : "Request Free Consultation"}
      </Button>
    </form>
  );
}
