// [DEMO DATA] — explicit ScholarshipProgram / ScholarshipUniversity join
// rows for a subset of scholarships, so the "Eligible Programs" and
// "Related Universities" detail-page sections have real data to render.

export interface ScholarshipProgramLinkSeed {
  scholarshipSlug: string;
  programSlug: string;
}

export const scholarshipProgramLinksSeed: ScholarshipProgramLinkSeed[] = [
  { scholarshipSlug: "central-european-partial-award", programSlug: "international-business-masters" },
  { scholarshipSlug: "central-european-partial-award", programSlug: "psychology-bachelors" },
  { scholarshipSlug: "tum-excellence-scholarship", programSlug: "electrical-engineering-masters" },
  { scholarshipSlug: "tum-excellence-scholarship", programSlug: "robotics-phd" },
  { scholarshipSlug: "taylors-hospitality-talent-scholarship", programSlug: "hospitality-management-bachelors" },
  { scholarshipSlug: "debrecen-medicine-merit-award", programSlug: "general-medicine-debrecen-medical-specialization" },
  { scholarshipSlug: "warsaw-international-award", programSlug: "economics-bachelors" },
  { scholarshipSlug: "warsaw-international-award", programSlug: "international-relations-masters" },
];

export interface ScholarshipUniversityLinkSeed {
  scholarshipSlug: string;
  universitySlug: string;
}

// Country-wide scholarships (no single primary university) linked to the
// partner universities in that country that honor the award.
export const scholarshipUniversityLinksSeed: ScholarshipUniversityLinkSeed[] = [
  { scholarshipSlug: "full-scholarship-turkiye", universitySlug: "istanbul-biruni-university" },
  { scholarshipSlug: "full-scholarship-turkiye", universitySlug: "ankara-science-university" },
];
