"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/validation/lead.schema";
import { submitContactMessage } from "@/server/actions/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const departments = [
  { value: "admissions", label: "Admissions" },
  { value: "partnerships", label: "Partnerships" },
  { value: "support", label: "Student Support" },
  { value: "general", label: "General Inquiry" },
] as const;

export function ContactForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { department: "general" } });

  async function onSubmit(values: ContactInput) {
    const res = await submitContactMessage(values);
    setResult(res);
  }

  if (result?.success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
        <p className="font-display text-xl font-semibold text-primary">Message sent!</p>
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
        <Label>Department</Label>
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" className="mt-1.5" rows={5} {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
