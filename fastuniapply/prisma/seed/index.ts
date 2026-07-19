import { PrismaClient, type DegreeLevel, type EligibilityCriteriaType } from "@prisma/client";
import argon2 from "argon2";
import { countriesSeed, citiesSeed } from "./countries";
import { universitiesSeed } from "./universities";
import { scholarshipsSeed } from "./scholarships";
import { articleCategoriesSeed, articlesSeed } from "./articles";
import { documentTypesSeed, leadSourcesSeed, rolesSeed, permissionsSeed, rolePermissionMap } from "./reference-data";
import { testimonialsSeed } from "./testimonials";
import { countryGuidesSeed } from "./country-guides";
import { faqsSeed } from "./faqs";
import {
  universityRankingsSeed,
  universityAccreditationsSeed,
  universityGallerySeed,
  universityIntakesSeed,
} from "./university-extras";
import { universityFaqsSeed } from "./university-faqs";
import { scholarshipProgramLinksSeed, scholarshipUniversityLinksSeed } from "./scholarship-links";
import { localizedUniversitySample, localizedProgramSample, localizedScholarshipSample } from "./localized-samples";

const prisma = new PrismaClient();

/** Local slugify (kebab-case) — kept independent of src/lib/utils.ts since the seed script runs outside the app's module resolution/path aliases. */
function slugifyKey(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedReferenceData() {
  await prisma.documentType.createMany({
    data: documentTypesSeed.map((d) => ({ key: d.key, requiresExpiration: d.requiresExpiration, sortOrder: d.sortOrder })),
    skipDuplicates: true,
  });
  await prisma.leadSource.createMany({ data: [...leadSourcesSeed], skipDuplicates: true });

  for (const role of rolesSeed) {
    await prisma.role.upsert({ where: { key: role.key }, update: {}, create: role });
  }
  for (const key of permissionsSeed) {
    await prisma.permission.upsert({ where: { key }, update: {}, create: { key } });
  }
  for (const [roleKey, permKeys] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey } });
    for (const permKey of permKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
  console.log(`✓ Reference data: document types, lead sources, ${rolesSeed.length} roles, ${permissionsSeed.length} permissions`);
}

async function seedGeography() {
  for (const country of countriesSeed) {
    await prisma.country.upsert({ where: { isoCode: country.isoCode }, update: {}, create: country });
  }
  for (const city of citiesSeed) {
    const country = await prisma.country.findUniqueOrThrow({ where: { slug: city.countrySlug } });
    const existing = await prisma.city.findFirst({ where: { countryId: country.id, name: city.name } });
    if (!existing) {
      await prisma.city.create({ data: { countryId: country.id, name: city.name } });
    }
  }
  console.log(`✓ Geography: ${countriesSeed.length} countries, ${citiesSeed.length} cities`);
}

async function seedUniversitiesAndPrograms() {
  let programCount = 0;
  for (const u of universitiesSeed) {
    const country = await prisma.country.findUniqueOrThrow({ where: { slug: u.countrySlug } });

    const university = await prisma.university.upsert({
      where: { slug: u.slug },
      update: {},
      create: {
        slug: u.slug,
        countryId: country.id,
        type: u.type,
        rankingGlobal: u.rankingGlobal,
        rankingNational: u.rankingNational,
        accreditations: u.accreditations,
        scholarshipsAvailable: u.scholarshipsAvailable,
        admissionStatus: u.admissionStatus,
        startingTuitionMinor: u.startingTuitionMinor,
        currency: u.currency,
        websiteUrl: u.websiteUrl,
        foundedYear: u.foundedYear,
        isFeatured: u.isFeatured,
        isDemo: true,
        translations: {
          create: {
            locale: "en",
            name: u.name,
            aboutText: u.aboutText,
            admissionRequirements: u.admissionRequirements,
            languageRequirements: u.languageRequirements,
            accommodationInfo: u.accommodationInfo,
            studentLife: u.studentLife,
          },
        },
      },
    });

    const city = await prisma.city.findFirst({ where: { countryId: country.id, name: u.city } });
    if (city) {
      const existingCampus = await prisma.universityCampus.findFirst({ where: { universityId: university.id } });
      if (!existingCampus) {
        await prisma.universityCampus.create({
          data: { universityId: university.id, cityId: city.id, name: `${u.name} — Main Campus` },
        });
      }
    }

    for (const p of u.programs) {
      const academicField = await prisma.academicField.upsert({
        where: { key: slugifyKey(p.field) },
        update: {},
        create: { key: slugifyKey(p.field), name: p.field },
      });
      const major = await prisma.major.upsert({
        where: { key: slugifyKey(`${p.field}-${p.major}`) },
        update: {},
        create: { key: slugifyKey(`${p.field}-${p.major}`), name: p.major, academicFieldId: academicField.id },
      });

      await prisma.program.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          universityId: university.id,
          degreeLevel: p.degreeLevel as DegreeLevel,
          field: p.field,
          major: p.major,
          academicFieldId: academicField.id,
          majorId: major.id,
          studyLanguage: p.studyLanguage,
          durationMonths: p.durationMonths,
          applicationFeeMinor: p.applicationFeeMinor,
          currency: p.currency,
          featured: p.featured ?? false,
          isDemo: true,
          translations: {
            create: { locale: "en", name: p.name, overview: p.overview },
          },
          fees: {
            create: {
              tuitionMinor: p.tuitionMinor,
              discountedTuitionMinor: p.discountedTuitionMinor,
              currency: p.currency,
            },
          },
          intakes: {
            create: [
              { startDate: new Date("2026-09-15"), applicationDeadline: new Date("2026-07-15"), status: "OPEN" },
              { startDate: new Date("2027-02-01"), applicationDeadline: new Date("2026-12-01"), status: "UPCOMING" },
            ],
          },
        },
      });
      programCount++;
    }
  }
  console.log(`✓ Universities: ${universitiesSeed.length}, Programs: ${programCount}`);
}

async function seedUniversityExtras() {
  let rankings = 0;
  for (const r of universityRankingsSeed) {
    const university = await prisma.university.findUnique({ where: { slug: r.universitySlug } });
    if (!university) continue;
    const existing = await prisma.universityRanking.findFirst({
      where: { universityId: university.id, source: r.source, year: r.year, rankType: r.rankType },
    });
    if (existing) continue;
    await prisma.universityRanking.create({
      data: { universityId: university.id, source: r.source, year: r.year, rank: r.rank, rankType: r.rankType },
    });
    rankings++;
  }

  let accreditations = 0;
  for (const a of universityAccreditationsSeed) {
    const university = await prisma.university.findUnique({ where: { slug: a.universitySlug } });
    if (!university) continue;
    const existing = await prisma.universityAccreditation.findFirst({
      where: { universityId: university.id, name: a.name },
    });
    if (existing) continue;
    await prisma.universityAccreditation.create({
      data: { universityId: university.id, name: a.name, issuingBody: a.issuingBody, year: a.year },
    });
    accreditations++;
  }

  let galleryImages = 0;
  for (const g of universityGallerySeed) {
    const university = await prisma.university.findUnique({ where: { slug: g.universitySlug } });
    if (!university) continue;
    const existing = await prisma.universityGallery.findFirst({
      where: { universityId: university.id, imageUrl: g.imageUrl },
    });
    if (existing) continue;
    await prisma.universityGallery.create({
      data: { universityId: university.id, imageUrl: g.imageUrl, caption: g.caption, sortOrder: g.sortOrder },
    });
    galleryImages++;
  }

  let intakes = 0;
  for (const i of universityIntakesSeed) {
    const university = await prisma.university.findUnique({ where: { slug: i.universitySlug } });
    if (!university) continue;
    const existing = await prisma.universityIntake.findFirst({ where: { universityId: university.id, label: i.label } });
    if (existing) continue;
    await prisma.universityIntake.create({
      data: {
        universityId: university.id,
        label: i.label,
        startDate: new Date(i.startDate),
        applicationDeadline: new Date(i.applicationDeadline),
        status: i.status,
      },
    });
    intakes++;
  }

  console.log(`✓ University extras: ${rankings} rankings, ${accreditations} accreditations, ${galleryImages} gallery images, ${intakes} intakes`);
}

async function seedUniversityFaqs() {
  let count = 0;
  for (const f of universityFaqsSeed) {
    const university = await prisma.university.findUnique({ where: { slug: f.universitySlug } });
    if (!university) continue;
    const existing = await prisma.fAQ.findFirst({ where: { context: "university", contextId: university.id, order: f.order } });
    if (existing) continue;
    const faq = await prisma.fAQ.create({ data: { context: "university", contextId: university.id, order: f.order } });
    await prisma.fAQTranslation.create({
      data: { faqId: faq.id, locale: "en", question: f.question, answer: f.answer },
    });
    count++;
  }
  console.log(`✓ University FAQs: ${count}`);
}

async function seedCountryGuides() {
  for (const g of countryGuidesSeed) {
    const country = await prisma.country.findUniqueOrThrow({ where: { slug: g.countrySlug } });
    const guide = await prisma.countryGuide.upsert({
      where: { countryId: country.id },
      update: {},
      create: { countryId: country.id, published: true },
    });
    await prisma.countryGuideTranslation.upsert({
      where: { countryGuideId_locale: { countryGuideId: guide.id, locale: "en" } },
      update: {},
      create: {
        countryGuideId: guide.id,
        locale: "en",
        whyStudyHere: g.whyStudyHere,
        educationSystem: g.educationSystem,
        tuitionOverview: g.tuitionOverview,
        costOfLiving: g.costOfLiving,
        visaInformation: g.visaInformation,
        accommodation: g.accommodation,
        workOpportunities: g.workOpportunities,
        requiredDocuments: g.requiredDocuments,
      },
    });
  }
  console.log(`✓ Country guides: ${countryGuidesSeed.length}`);
}

async function seedFaqs() {
  for (const f of faqsSeed) {
    const existing = await prisma.fAQ.findFirst({
      where: { context: f.context, order: f.order },
    });
    if (existing) continue;
    const faq = await prisma.fAQ.create({ data: { context: f.context, order: f.order } });
    await prisma.fAQTranslation.create({
      data: { faqId: faq.id, locale: "en", question: f.question, answer: f.answer },
    });
  }
  console.log(`✓ FAQs: ${faqsSeed.length}`);
}

async function seedScholarships() {
  let eligibilityRows = 0;
  for (const s of scholarshipsSeed) {
    const university = s.universitySlug
      ? await prisma.university.findUnique({ where: { slug: s.universitySlug } })
      : null;
    const country = s.countrySlug ? await prisma.country.findUnique({ where: { slug: s.countrySlug } }) : null;

    const scholarship = await prisma.scholarship.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        universityId: university?.id,
        countryId: country?.id,
        coverageType: s.coverageType,
        coveragePercent: s.coveragePercent,
        fundingType: s.fundingType,
        deadline: new Date(s.deadline),
        eligibleDegreeLevels: s.eligibleDegreeLevels as DegreeLevel[],
        eligibleNationalities: s.eligibleNationalities,
        visible: true,
        isDemo: true,
        translations: {
          create: {
            locale: "en",
            title: s.title,
            providerName: s.providerName,
            eligibilityText: s.eligibilityText,
            requiredDocumentsNote: s.requiredDocumentsNote,
            applicationProcess: s.applicationProcess,
            termsAndConditions: s.termsAndConditions,
          },
        },
      },
    });

    // Structured eligibility criteria, auto-derived from the scalar
    // eligibleDegreeLevels/eligibleNationalities arrays above — gives the
    // ScholarshipEligibility model real rows without hand-duplicating data
    // that's already authored once per scholarship.
    const criteria: { criteriaType: EligibilityCriteriaType; value: string }[] = [
      ...s.eligibleDegreeLevels.map((level) => ({ criteriaType: "DEGREE_LEVEL" as EligibilityCriteriaType, value: level })),
      ...s.eligibleNationalities.map((nat) => ({ criteriaType: "NATIONALITY" as EligibilityCriteriaType, value: nat })),
    ];
    for (const c of criteria) {
      const existing = await prisma.scholarshipEligibility.findFirst({
        where: { scholarshipId: scholarship.id, criteriaType: c.criteriaType, value: c.value },
      });
      if (existing) continue;
      await prisma.scholarshipEligibility.create({
        data: { scholarshipId: scholarship.id, criteriaType: c.criteriaType, value: c.value },
      });
      eligibilityRows++;
    }
  }
  console.log(`✓ Scholarships: ${scholarshipsSeed.length}, eligibility criteria: ${eligibilityRows}`);
}

async function seedScholarshipLinks() {
  let programLinks = 0;
  for (const link of scholarshipProgramLinksSeed) {
    const scholarship = await prisma.scholarship.findUnique({ where: { slug: link.scholarshipSlug } });
    const program = await prisma.program.findUnique({ where: { slug: link.programSlug } });
    if (!scholarship || !program) continue;
    await prisma.scholarshipProgram.upsert({
      where: { scholarshipId_programId: { scholarshipId: scholarship.id, programId: program.id } },
      update: {},
      create: { scholarshipId: scholarship.id, programId: program.id },
    });
    programLinks++;
  }

  let universityLinks = 0;
  for (const link of scholarshipUniversityLinksSeed) {
    const scholarship = await prisma.scholarship.findUnique({ where: { slug: link.scholarshipSlug } });
    const university = await prisma.university.findUnique({ where: { slug: link.universitySlug } });
    if (!scholarship || !university) continue;
    await prisma.scholarshipUniversity.upsert({
      where: { scholarshipId_universityId: { scholarshipId: scholarship.id, universityId: university.id } },
      update: {},
      create: { scholarshipId: scholarship.id, universityId: university.id },
    });
    universityLinks++;
  }

  console.log(`✓ Scholarship links: ${programLinks} program links, ${universityLinks} university links`);
}

async function seedLocalizedSamples() {
  const university = await prisma.university.findUnique({ where: { slug: localizedUniversitySample.slug } });
  if (university) {
    for (const t of localizedUniversitySample.translations) {
      await prisma.universityTranslation.upsert({
        where: { universityId_locale: { universityId: university.id, locale: t.locale } },
        update: {},
        create: { universityId: university.id, ...t },
      });
    }
  }

  const program = await prisma.program.findUnique({ where: { slug: localizedProgramSample.slug } });
  if (program) {
    for (const t of localizedProgramSample.translations) {
      await prisma.programTranslation.upsert({
        where: { programId_locale: { programId: program.id, locale: t.locale } },
        update: {},
        create: { programId: program.id, ...t },
      });
    }
  }

  const scholarship = await prisma.scholarship.findUnique({ where: { slug: localizedScholarshipSample.slug } });
  if (scholarship) {
    for (const t of localizedScholarshipSample.translations) {
      await prisma.scholarshipTranslation.upsert({
        where: { scholarshipId_locale: { scholarshipId: scholarship.id, locale: t.locale } },
        update: {},
        create: { scholarshipId: scholarship.id, ...t },
      });
    }
  }

  console.log("✓ Localized samples: ar/tr translations for 1 university, 1 program, 1 scholarship");
}

async function seedContentAndStaff() {
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@fastuniapply.demo" },
    update: {},
    create: {
      email: "admin@fastuniapply.demo",
      name: "Demo Super Admin",
      passwordHash: await argon2.hash("ChangeMe123!"),
      emailVerified: new Date(),
      staffProfile: { create: { department: "Platform", title: "Super Administrator", twoFactorEnabled: false } },
    },
    include: { staffProfile: true },
  });
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { key: "super_admin" } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: superAdminRole.id },
  });

  for (const category of articleCategoriesSeed) {
    await prisma.articleCategory.upsert({ where: { key: category.key }, update: {}, create: category });
  }

  for (const article of articlesSeed) {
    const category = await prisma.articleCategory.findUniqueOrThrow({ where: { key: article.categoryKey } });
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        categoryId: category.id,
        authorId: adminUser.id,
        readingTimeMinutes: article.readingTimeMinutes,
        published: true,
        publishedAt: new Date(),
        translations: {
          create: { locale: "en", title: article.title, excerpt: article.excerpt, contentHtml: article.contentHtml },
        },
      },
    });
  }
  console.log(`✓ Content: ${articleCategoriesSeed.length} article categories, ${articlesSeed.length} articles`);

  for (const t of testimonialsSeed) {
    const country = t.countrySlug ? await prisma.country.findUnique({ where: { slug: t.countrySlug } }) : null;
    const university = t.universitySlug ? await prisma.university.findUnique({ where: { slug: t.universitySlug } }) : null;
    const existing = await prisma.testimonial.findFirst({ where: { studentName: t.studentName } });
    if (!existing) {
      await prisma.testimonial.create({
        data: {
          studentName: t.studentName,
          quote: t.quote,
          countryId: country?.id,
          universityId: university?.id,
          featured: t.featured,
          rating: t.rating,
        },
      });
    }
  }
  console.log(`✓ Testimonials: ${testimonialsSeed.length}`);

  return { adminUser };
}

async function seedStaffConsultantsAndOfficers() {
  const consultantUser = await prisma.user.upsert({
    where: { email: "consultant@fastuniapply.demo" },
    update: {},
    create: {
      email: "consultant@fastuniapply.demo",
      name: "Demo Consultant",
      passwordHash: await argon2.hash("ChangeMe123!"),
      emailVerified: new Date(),
      staffProfile: { create: { department: "Admissions", title: "Educational Consultant" } },
    },
    include: { staffProfile: true },
  });
  const officerUser = await prisma.user.upsert({
    where: { email: "officer@fastuniapply.demo" },
    update: {},
    create: {
      email: "officer@fastuniapply.demo",
      name: "Demo Admissions Officer",
      passwordHash: await argon2.hash("ChangeMe123!"),
      emailVerified: new Date(),
      staffProfile: { create: { department: "Admissions", title: "Admissions Officer" } },
    },
    include: { staffProfile: true },
  });

  const consultantRole = await prisma.role.findUniqueOrThrow({ where: { key: "consultant" } });
  const officerRole = await prisma.role.findUniqueOrThrow({ where: { key: "admissions_officer" } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: consultantUser.id, roleId: consultantRole.id } },
    update: {},
    create: { userId: consultantUser.id, roleId: consultantRole.id },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: officerUser.id, roleId: officerRole.id } },
    update: {},
    create: { userId: officerUser.id, roleId: officerRole.id },
  });

  console.log("✓ Staff: 1 consultant, 1 admissions officer");
  return {
    consultant: consultantUser.staffProfile!,
    officer: officerUser.staffProfile!,
  };
}

async function seedStudentsLeadsAndApplications(consultantId: string, officerId: string) {
  const demoStudentsData = [
    { email: "aisha.student@fastuniapply.demo", name: "Aisha Bello", nationality: "NG", programSlug: "computer-engineering-bachelors" },
    { email: "emre.student@fastuniapply.demo", name: "Emre Yildiz", nationality: "EG", programSlug: "international-business-masters" },
    { email: "layla.student@fastuniapply.demo", name: "Layla Haddad", nationality: "JO", programSlug: "hospitality-management-bachelors" },
  ];

  const applicationStatuses = ["DOCUMENTS_UNDER_REVIEW", "SUBMITTED_TO_UNIVERSITY", "CONDITIONAL_ACCEPTANCE"] as const;

  for (let i = 0; i < demoStudentsData.length; i++) {
    const s = demoStudentsData[i]!;
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        name: s.name,
        passwordHash: await argon2.hash("ChangeMe123!"),
        emailVerified: new Date(),
        studentProfile: {
          create: {
            assignedConsultantId: consultantId,
            budgetMinorAmount: 1500000,
            budgetCurrency: "USD",
          },
        },
      },
      include: { studentProfile: true },
    });
    const studentRole = await prisma.role.findUniqueOrThrow({ where: { key: "student" } });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: studentRole.id } },
      update: {},
      create: { userId: user.id, roleId: studentRole.id },
    });

    const program = await prisma.program.findUnique({ where: { slug: s.programSlug } });
    if (program && user.studentProfile) {
      const existingApp = await prisma.application.findFirst({
        where: { studentId: user.studentProfile.id, programId: program.id },
      });
      if (!existingApp) {
        const status = applicationStatuses[i % applicationStatuses.length]!;
        await prisma.application.create({
          data: {
            studentId: user.studentProfile.id,
            programId: program.id,
            status,
            assignedConsultantId: consultantId,
            assignedOfficerId: officerId,
            createdBy: "STUDENT",
            statusHistory: {
              create: [
                { toStatus: "DRAFT", note: "Application started" },
                { toStatus: "DOCUMENTS_PENDING", note: "Awaiting document upload" },
                { toStatus: status, note: "Demo seed progression" },
              ],
            },
          },
        });
      }
    }
  }
  console.log(`✓ Students: ${demoStudentsData.length} with applications across multiple statuses`);

  const websiteSource = await prisma.leadSource.findUniqueOrThrow({ where: { key: "website" } });
  const instagramSource = await prisma.leadSource.findUniqueOrThrow({ where: { key: "instagram" } });
  const agentSource = await prisma.leadSource.findUniqueOrThrow({ where: { key: "educational_agent" } });

  const demoLeads = [
    { fullName: "Karim Aziz", email: "karim.lead@example.com", stage: "NEW_LEAD" as const, sourceId: websiteSource.id },
    { fullName: "Nadia Rahman", email: "nadia.lead@example.com", stage: "CONTACTED" as const, sourceId: instagramSource.id },
    { fullName: "Yusuf Demir", email: "yusuf.lead@example.com", stage: "CONSULTATION_BOOKED" as const, sourceId: websiteSource.id },
    { fullName: "Grace Mensah", email: "grace.lead@example.com", stage: "DOCUMENTS_REQUESTED" as const, sourceId: agentSource.id },
    { fullName: "Omar Farouk", email: "omar.lead@example.com", stage: "NOT_INTERESTED" as const, sourceId: websiteSource.id },
  ];

  for (const lead of demoLeads) {
    const existing = await prisma.lead.findFirst({ where: { email: lead.email } });
    if (!existing) {
      await prisma.lead.create({
        data: { ...lead, assignedStaffId: consultantId, marketingConsent: true },
      });
    }
  }
  console.log(`✓ Leads: ${demoLeads.length} across multiple pipeline stages`);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run demo seed data against a production environment.");
  }

  await seedReferenceData();
  await seedGeography();
  await seedUniversitiesAndPrograms();
  await seedUniversityExtras();
  await seedUniversityFaqs();
  await seedCountryGuides();
  await seedFaqs();
  await seedScholarships();
  await seedScholarshipLinks();
  await seedLocalizedSamples();
  await seedContentAndStaff();
  const { consultant, officer } = await seedStaffConsultantsAndOfficers();
  await seedStudentsLeadsAndApplications(consultant.id, officer.id);

  console.log("\n✅ Seed complete. Demo login: admin@fastuniapply.demo / ChangeMe123! (and consultant@/officer@/*.student@fastuniapply.demo)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
