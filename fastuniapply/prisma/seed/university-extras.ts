// [DEMO DATA] — sample rankings, accreditation records, gallery images, and
// university-level intake windows for a subset of universities, to exercise
// the new UniversityRanking/UniversityAccreditation/UniversityGallery/
// UniversityIntake models end-to-end. Not exhaustive for every seeded
// university — extend via the Admin > Universities module once real
// partnership data is onboarded.

export interface UniversityRankingSeed {
  universitySlug: string;
  source: string;
  year: number;
  rank: number;
  rankType: string;
}

export const universityRankingsSeed: UniversityRankingSeed[] = [
  { universitySlug: "technical-university-of-munich", source: "QS World University Rankings", year: 2026, rank: 37, rankType: "global" },
  { universitySlug: "technical-university-of-munich", source: "Times Higher Education", year: 2026, rank: 30, rankType: "global" },
  { universitySlug: "eotvos-lorand-university", source: "QS World University Rankings", year: 2026, rank: 601, rankType: "global" },
  { universitySlug: "university-of-warsaw", source: "QS World University Rankings", year: 2026, rank: 321, rankType: "global" },
  { universitySlug: "taylors-university", source: "QS World University Rankings", year: 2026, rank: 284, rankType: "global" },
  { universitySlug: "toronto-metropolitan-college", source: "Maclean's College Rankings", year: 2026, rank: 15, rankType: "national" },
];

export interface UniversityAccreditationSeed {
  universitySlug: string;
  name: string;
  issuingBody: string;
  year: number;
}

export const universityAccreditationsSeed: UniversityAccreditationSeed[] = [
  { universitySlug: "istanbul-biruni-university", name: "Higher Education Program Accreditation", issuingBody: "YÖK", year: 2022 },
  { universitySlug: "istanbul-biruni-university", name: "FIBAA Program Accreditation", issuingBody: "FIBAA", year: 2021 },
  { universitySlug: "technical-university-of-munich", name: "Engineering Program Accreditation", issuingBody: "ASIIN", year: 2023 },
  { universitySlug: "university-of-debrecen", name: "WHO-listed Medical School", issuingBody: "World Health Organization", year: 2020 },
  { universitySlug: "university-of-bedfordshire", name: "Quality Assurance Review", issuingBody: "QAA", year: 2024 },
];

export interface UniversityGallerySeed {
  universitySlug: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
}

// Unsplash URLs — approved remote image source in next.config.mjs.
export const universityGallerySeed: UniversityGallerySeed[] = [
  { universitySlug: "istanbul-biruni-university", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80", caption: "Main campus building", sortOrder: 0 },
  { universitySlug: "istanbul-biruni-university", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", caption: "Library reading hall", sortOrder: 1 },
  { universitySlug: "technical-university-of-munich", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", caption: "Engineering research lab", sortOrder: 0 },
  { universitySlug: "technical-university-of-munich", imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80", caption: "Campus courtyard", sortOrder: 1 },
  { universitySlug: "taylors-university", imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80", caption: "Student lakeside lounge", sortOrder: 0 },
];

export interface UniversityIntakeSeed {
  universitySlug: string;
  label: string;
  startDate: string;
  applicationDeadline: string;
  status: "OPEN" | "UPCOMING" | "CLOSED";
}

export const universityIntakesSeed: UniversityIntakeSeed[] = [
  { universitySlug: "istanbul-biruni-university", label: "Fall 2026", startDate: "2026-09-15", applicationDeadline: "2026-07-15", status: "OPEN" },
  { universitySlug: "istanbul-biruni-university", label: "Spring 2027", startDate: "2027-02-01", applicationDeadline: "2026-12-01", status: "UPCOMING" },
  { universitySlug: "technical-university-of-munich", label: "Winter Semester 2026/27", startDate: "2026-10-01", applicationDeadline: "2026-07-15", status: "OPEN" },
  { universitySlug: "university-of-warsaw", label: "Fall 2026", startDate: "2026-10-01", applicationDeadline: "2026-06-15", status: "OPEN" },
  { universitySlug: "taylors-university", label: "September 2026 Intake", startDate: "2026-09-01", applicationDeadline: "2026-07-01", status: "OPEN" },
  { universitySlug: "toronto-metropolitan-college", label: "Fall 2026", startDate: "2026-09-08", applicationDeadline: "2026-05-31", status: "OPEN" },
];
