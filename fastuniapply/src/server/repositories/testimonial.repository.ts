import "server-only";
import { db } from "@/lib/db";

export async function listFeaturedTestimonials(take = 6) {
  return db.testimonial.findMany({
    where: { featured: true },
    include: { country: true, university: { include: { translations: true } } },
    take,
  });
}

export async function listFaqs(context: string, contextId: string | null, locale: string, take = 20) {
  const rows = await db.fAQ.findMany({
    where: { context, contextId },
    include: { translations: true },
    orderBy: { order: "asc" },
    take,
  });
  return rows
    .map((f) => {
      const translation = f.translations.find((t) => t.locale === locale) ?? f.translations.find((t) => t.locale === "en");
      return translation ? { ...f, translation } : null;
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);
}

export async function getPlatformStats() {
  const [universities, programs, countries, applications] = await Promise.all([
    db.university.count({ where: { deletedAt: null } }),
    db.program.count({ where: { deletedAt: null } }),
    db.country.count({ where: { deletedAt: null, universities: { some: { deletedAt: null } } } }),
    db.application.count({ where: { deletedAt: null } }),
  ]);
  return { universities, programs, countries, applications };
}
