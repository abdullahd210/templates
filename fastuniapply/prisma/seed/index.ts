import { PrismaClient, type DegreeLevel } from "@prisma/client";
import argon2 from "argon2";
import { countriesSeed, citiesSeed } from "./countries";
import { universitiesSeed } from "./universities";
import { scholarshipsSeed } from "./scholarships";
import { articleCategoriesSeed, articlesSeed } from "./articles";
import { documentTypesSeed, leadSourcesSeed, rolesSeed, permissionsSeed, rolePermissionMap } from "./reference-data";
import { testimonialsSeed } from "./testimonials";

const prisma = new PrismaClient();

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
      await prisma.program.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          universityId: university.id,
          degreeLevel: p.degreeLevel as DegreeLevel,
          field: p.field,
          major: p.major,
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

async function seedScholarships() {
  for (const s of scholarshipsSeed) {
    const university = s.universitySlug
      ? await prisma.university.findUnique({ where: { slug: s.universitySlug } })
      : null;
    const country = s.countrySlug ? await prisma.country.findUnique({ where: { slug: s.countrySlug } }) : null;

    await prisma.scholarship.upsert({
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
  }
  console.log(`✓ Scholarships: ${scholarshipsSeed.length}`);
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
  await seedScholarships();
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
