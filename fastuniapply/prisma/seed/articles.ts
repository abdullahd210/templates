export interface ArticleSeed {
  slug: string;
  categoryKey: string;
  readingTimeMinutes: number;
  title: string;
  excerpt: string;
  contentHtml: string;
}

// [DEMO DATA]
export const articleCategoriesSeed = [
  { key: "university_admissions", name: "University Admissions" },
  { key: "scholarships", name: "Scholarships" },
  { key: "student_visas", name: "Student Visas" },
  { key: "study_destinations", name: "Study Destinations" },
  { key: "academic_programs", name: "Academic Programs" },
  { key: "student_life", name: "Student Life" },
  { key: "application_tips", name: "Application Tips" },
  { key: "international_education_news", name: "International Education News" },
  { key: "university_rankings", name: "University Rankings" },
  { key: "career_guidance", name: "Career Guidance" },
];

export const articlesSeed: ArticleSeed[] = [
  {
    slug: "how-to-apply-to-university",
    categoryKey: "application_tips",
    readingTimeMinutes: 7,
    title: "How to Apply to University as an International Student",
    excerpt: "A step-by-step walkthrough of the international university application process, from shortlisting to enrollment.",
    contentHtml: "<p>Applying to university abroad can feel overwhelming, but breaking it into stages makes it manageable...</p>",
  },
  {
    slug: "top-5-mistakes-in-university-applications",
    categoryKey: "application_tips",
    readingTimeMinutes: 6,
    title: "Top 5 Mistakes Students Make in University Applications",
    excerpt: "Avoid these common pitfalls that delay or derail international admissions.",
    contentHtml: "<p>From missed deadlines to incomplete documents, here are the mistakes we see most often...</p>",
  },
  {
    slug: "how-to-find-a-full-scholarship-abroad",
    categoryKey: "scholarships",
    readingTimeMinutes: 8,
    title: "How to Find a Full Scholarship to Study Abroad",
    excerpt: "Where to look, what makes an application competitive, and common eligibility requirements.",
    contentHtml: "<p>Full scholarships are competitive but attainable with the right strategy...</p>",
  },
  {
    slug: "scholarship-application-checklist",
    categoryKey: "scholarships",
    readingTimeMinutes: 5,
    title: "Scholarship Application Checklist",
    excerpt: "The documents and steps every scholarship application should include.",
    contentHtml: "<p>Use this checklist before you submit any scholarship application...</p>",
  },
  {
    slug: "student-visa-guide-for-international-students",
    categoryKey: "student_visas",
    readingTimeMinutes: 9,
    title: "Student Visa Guide for International Students",
    excerpt: "Understand the general student visa process, required documents, and timelines.",
    contentHtml: "<p>Visa requirements vary by destination country, but most follow a similar pattern...</p>",
  },
  {
    slug: "study-in-turkiye-what-to-know",
    categoryKey: "study_destinations",
    readingTimeMinutes: 6,
    title: "Study in Türkiye: What International Students Should Know",
    excerpt: "An overview of Türkiye's education system, popular cities, and cost of living.",
    contentHtml: "<p>Türkiye has become one of the most popular study destinations for international students...</p>",
  },
  {
    slug: "study-in-hungary-medicine-programs",
    categoryKey: "study_destinations",
    readingTimeMinutes: 7,
    title: "Studying Medicine in Hungary: A Complete Overview",
    excerpt: "Why Hungary is a top choice for international medical students.",
    contentHtml: "<p>Hungary's medical schools are WHO-listed and taught in English...</p>",
  },
  {
    slug: "choosing-between-bachelors-and-foundation-year",
    categoryKey: "academic_programs",
    readingTimeMinutes: 5,
    title: "Choosing Between a Bachelor's Degree and a Foundation Year",
    excerpt: "How to decide if a foundation year is the right path for you.",
    contentHtml: "<p>Foundation years bridge gaps in language, academics, or curriculum differences...</p>",
  },
  {
    slug: "student-life-abroad-what-to-expect",
    categoryKey: "student_life",
    readingTimeMinutes: 6,
    title: "Student Life Abroad: What to Expect in Your First Semester",
    excerpt: "Practical tips on housing, budgeting, and settling into a new country.",
    contentHtml: "<p>Your first semester abroad comes with a learning curve — here's how to navigate it...</p>",
  },
  {
    slug: "understanding-global-university-rankings",
    categoryKey: "university_rankings",
    readingTimeMinutes: 6,
    title: "Understanding Global University Rankings",
    excerpt: "What rankings actually measure, and how much weight to give them in your decision.",
    contentHtml: "<p>Rankings are a useful signal, but they shouldn't be the only factor in your choice...</p>",
  },
  {
    slug: "career-paths-after-a-masters-abroad",
    categoryKey: "career_guidance",
    readingTimeMinutes: 7,
    title: "Career Paths After Completing a Master's Abroad",
    excerpt: "How an international Master's degree can shape your career options.",
    contentHtml: "<p>Graduating with an international Master's opens doors across industries and borders...</p>",
  },
  {
    slug: "2026-international-education-trends",
    categoryKey: "international_education_news",
    readingTimeMinutes: 5,
    title: "International Education Trends to Watch in 2026",
    excerpt: "From new scholarship programs to shifting visa policies — what's changing this year.",
    contentHtml: "<p>The international education landscape continues to evolve rapidly...</p>",
  },
];
