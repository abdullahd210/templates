export interface TestimonialSeed {
  studentName: string;
  quote: string;
  countrySlug?: string;
  universitySlug?: string;
  featured: boolean;
  rating: number;
}

// [DEMO DATA]
export const testimonialsSeed: TestimonialSeed[] = [
  {
    studentName: "Amara Okafor",
    quote: "FastUniApply guided me from choosing a program to landing at my dorm in Istanbul. I never felt lost.",
    countrySlug: "turkiye",
    universitySlug: "istanbul-biruni-university",
    featured: true,
    rating: 5,
  },
  {
    studentName: "Farid Karimov",
    quote: "My consultant caught a missing document three times before submission — that attention to detail got me in.",
    countrySlug: "hungary",
    universitySlug: "eotvos-lorand-university",
    featured: true,
    rating: 5,
  },
  {
    studentName: "Layla Haddad",
    quote: "The scholarship search alone saved me thousands. Everything was in one dashboard.",
    countrySlug: "poland",
    universitySlug: "university-of-warsaw",
    featured: true,
    rating: 5,
  },
  {
    studentName: "Daniyar Suleimenov",
    quote: "I applied to three universities at once and tracked every status change without a single confusing email thread.",
    countrySlug: "germany",
    universitySlug: "technical-university-of-munich",
    featured: false,
    rating: 4,
  },
  {
    studentName: "Fatima Al Sayed",
    quote: "My agent in my home country and my FastUniApply consultant worked together seamlessly on my visa documents.",
    countrySlug: "malaysia",
    universitySlug: "taylors-university",
    featured: false,
    rating: 5,
  },
];
