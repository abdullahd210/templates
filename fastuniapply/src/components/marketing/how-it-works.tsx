import { SearchCheck, MessagesSquare, FileUp, PlaneTakeoff } from "lucide-react";
import { SectionHeading } from "./section-heading";

const steps = [
  {
    icon: SearchCheck,
    title: "Discover",
    description: "Search universities, programs, and scholarships that match your goals and budget.",
  },
  {
    icon: MessagesSquare,
    title: "Get Guidance",
    description: "Book a free consultation with an education expert to plan your best-fit path.",
  },
  {
    icon: FileUp,
    title: "Apply & Upload",
    description: "Complete a guided application and upload your documents securely.",
  },
  {
    icon: PlaneTakeoff,
    title: "Get Accepted & Go",
    description: "Track your offer, confirm your seat, prepare your visa, and start your journey.",
  },
];

export function HowItWorks({ title }: { title: string }) {
  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Application Process" title={title} />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="relative rounded-xl border border-border bg-card p-6 shadow-soft">
            <span className="font-display text-4xl font-bold text-muted">{String(i + 1).padStart(2, "0")}</span>
            <step.icon className="mt-3 h-7 w-7 text-secondary" />
            <p className="mt-3 font-display text-base font-semibold">{step.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
