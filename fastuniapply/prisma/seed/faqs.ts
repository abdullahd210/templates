export interface FaqSeed {
  context: "global";
  order: number;
  question: string;
  answer: string;
}

// [DEMO DATA]
export const faqsSeed: FaqSeed[] = [
  {
    context: "global",
    order: 1,
    question: "Is FastUniApply free for students?",
    answer: "Discovery, comparison, and your first consultation are completely free. Some application services carry a service fee, which is always shown transparently before you pay anything.",
  },
  {
    context: "global",
    order: 2,
    question: "Which countries can I apply to through FastUniApply?",
    answer: "We currently support Türkiye, Hungary, Germany, Poland, Italy, Malaysia, the United Kingdom, the United States, Canada, Cyprus, and the United Arab Emirates.",
  },
  {
    context: "global",
    order: 3,
    question: "How do I track my application status?",
    answer: "Every application you submit gets a live status timeline in your student dashboard, from Draft all the way through Enrollment — no more chasing emails.",
  },
  {
    context: "global",
    order: 4,
    question: "Can I apply to more than one university at a time?",
    answer: "Yes. Most students apply to 2–4 universities in parallel to compare offers and maximize their chances of acceptance and scholarship funding.",
  },
  {
    context: "global",
    order: 5,
    question: "Do I need to know which program I want before signing up?",
    answer: "No — many students start with a free consultation to narrow down their options based on budget, academic background, and career goals.",
  },
  {
    context: "global",
    order: 6,
    question: "How long does the application process usually take?",
    answer: "It varies by university and intake, but most applications move from document collection to a university decision within 4–8 weeks.",
  },
  {
    context: "global",
    order: 7,
    question: "What documents will I need to upload?",
    answer: "Typically your passport, academic transcripts and diplomas, a language certificate (if required), a CV, and a motivation letter. Your consultant will confirm the exact list for your chosen program.",
  },
  {
    context: "global",
    order: 8,
    question: "Can FastUniApply help with my student visa?",
    answer: "Yes. Once you accept an offer, your consultant guides you through the visa document checklist and preparation for your destination country.",
  },
];
