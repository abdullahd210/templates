import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Languages, School } from "lucide-react";
import type { AppLocale } from "@/i18n/config";
import { formatMoney } from "@/lib/format";
import type { DegreeLevel } from "@prisma/client";

export interface ProgramCardData {
  slug: string;
  name: string;
  universityName: string;
  degreeLevel: DegreeLevel;
  studyLanguage: string;
  durationMonths: number;
  tuitionMinor: number | null;
  currency: string;
}

export const degreeLevelLabel: Record<DegreeLevel, string> = {
  FOUNDATION: "Foundation",
  DIPLOMA: "Diploma",
  BACHELORS: "Bachelor's",
  MASTERS: "Master's",
  PHD: "PhD",
  MEDICAL_SPECIALIZATION: "Medical Specialization",
  LANGUAGE: "Language Program",
};

export function ProgramCard({ program, locale }: { program: ProgramCardData; locale: AppLocale }) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <Badge variant="secondary" className="w-fit">
          {degreeLevelLabel[program.degreeLevel]}
        </Badge>
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
          <span className="font-semibold text-foreground">
            {program.tuitionMinor ? formatMoney(program.tuitionMinor, program.currency, locale) : "—"}
          </span>{" "}
          <span className="text-muted-foreground">/ year</span>
        </p>
        <Button asChild className="mt-auto">
          <Link href={`/${locale}/programs/${program.slug}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
