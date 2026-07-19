import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Languages, School } from "lucide-react";
import type { AppLocale } from "@/i18n/config";
import { PriceDisplay } from "@/components/shared/price-display";
import { FeaturedBadge } from "@/components/shared/status-badge";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { CompareButton } from "@/components/catalog/compare-button";
import type { DegreeLevel } from "@prisma/client";

export interface ProgramCardData {
  id: string;
  slug: string;
  name: string;
  universityName: string;
  degreeLevel: DegreeLevel;
  studyLanguage: string;
  durationMonths: number;
  tuitionMinor: number | null;
  currency: string;
  featured?: boolean;
  isFavorited?: boolean;
}

export const degreeLevelLabel: Record<DegreeLevel, string> = {
  FOUNDATION: "Foundation",
  DIPLOMA: "Diploma",
  ASSOCIATE: "Associate Degree",
  BACHELORS: "Bachelor's",
  MASTERS: "Master's",
  PHD: "PhD",
  MEDICAL_SPECIALIZATION: "Medical Specialization",
  LANGUAGE: "Language Program",
  CERTIFICATE: "Certificate Program",
};

export function ProgramCard({ program, locale }: { program: ProgramCardData; locale: AppLocale }) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="w-fit">
              {degreeLevelLabel[program.degreeLevel]}
            </Badge>
            {program.featured && <FeaturedBadge />}
          </div>
          <div className="flex shrink-0 gap-1">
            <FavoriteButton entityType="PROGRAM" entityId={program.id} initialFavorited={program.isFavorited} locale={locale} />
            <CompareButton kind="programs" slug={program.slug} />
          </div>
        </div>
        <div>
          <p className="font-display text-base font-semibold leading-snug">{program.name}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <School className="h-3.5 w-3.5" /> {program.universityName}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {program.durationMonths} months
          </span>
          <span className="flex items-center gap-1">
            <Languages className="h-3.5 w-3.5" /> {program.studyLanguage}
          </span>
        </div>
        <p className="text-sm">
          <PriceDisplay amountMinor={program.tuitionMinor} currency={program.currency} locale={locale} size="sm" /> <span className="text-muted-foreground">/ year</span>
        </p>
        <Button asChild className="mt-auto">
          <Link href={`/${locale}/programs/${program.slug}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
