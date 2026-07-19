import { ShieldCheck, Globe2, Clock, Users } from "lucide-react";
import { SectionHeading } from "./section-heading";

const reasons = [
  {
    icon: Globe2,
    title: "Global Reach",
    description: "Partnered with universities across 11+ study destinations worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Guidance",
    description: "Every application is reviewed by admissions experts before submission.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Streamlined document review and a real-time application tracker.",
  },
  {
    icon: Users,
    title: "Dedicated Consultant",
    description: "A personal consultant guides you from first search to enrollment.",
  },
];

export function WhyChooseUs({ title }: { title: string }) {
  return (
    <section className="bg-muted/40 py-16">
      <div className="container">
        <SectionHeading eyebrow="FastUniApply Advantage" title={title} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="rounded-xl bg-card p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <reason.icon className="h-5.5 w-5.5" />
              </div>
              <p className="mt-4 font-display text-base font-semibold">{reason.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
