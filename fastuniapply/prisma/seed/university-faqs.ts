// [DEMO DATA] — university-scoped FAQs (FAQ.context = "university",
// contextId = the university's id, resolved by slug at seed time), distinct
// from the site-wide FAQs in faqs.ts (context = "global").

export interface UniversityFaqSeed {
  universitySlug: string;
  order: number;
  question: string;
  answer: string;
}

export const universityFaqsSeed: UniversityFaqSeed[] = [
  {
    universitySlug: "istanbul-biruni-university",
    order: 1,
    question: "Is an English proficiency test required for all programs?",
    answer: "English-taught programs require IELTS 6.0 or equivalent. Turkish-taught programs with an English prep year do not require a separate test.",
  },
  {
    universitySlug: "istanbul-biruni-university",
    order: 2,
    question: "Does the university offer on-campus housing?",
    answer: "Yes — on-campus dormitories and partner student residences are available within 15 minutes of campus.",
  },
  {
    universitySlug: "technical-university-of-munich",
    order: 1,
    question: "Can I apply to an English-taught Master's without German language skills?",
    answer: "Yes, most Master's programs are taught fully in English. Undergraduate programs are generally taught in German.",
  },
  {
    universitySlug: "technical-university-of-munich",
    order: 2,
    question: "Is student housing guaranteed?",
    answer: "Housing through the Munich Studierendenwerk is limited — we recommend applying as early as possible after receiving an offer.",
  },
];
