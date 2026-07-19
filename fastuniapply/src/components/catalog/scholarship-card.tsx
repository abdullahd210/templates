import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import type { AppLocale } from "@/i18n/config";
import { DeadlineDisplay } from "@/components/shared/deadline-display";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import type { ScholarshipCoverageType } from "@prisma/client";

export interface ScholarshipCardData {
  id: string;
  slug: string;
  title: string;
  providerName: string;
  coverageType: ScholarshipCoverageType;
  coveragePercent: string | number | null;
  deadline: Date | string | null;
  isFavorited?: boolean;
}

export function ScholarshipCard({
  scholarship,
  locale,
}: {
  scholarship: ScholarshipCardData;
  locale: AppLocale;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-accent">
            <Award className="h-5 w-5" />
          </div>
          <FavoriteButton entityType="SCHOLARSHIP" entityId={scholarship.id} initialFavorited={scholarship.isFavorited} locale={locale} />
        </div>
        <div>
          <p className="font-display text-base font-semibold leading-snug">{scholarship.title}</p>
          <p className="text-sm text-muted-foreground">{scholarship.providerName}</p>
        </div>
        <Badge variant={scholarship.coverageType === "FULL" ? "accent" : "outline"} className="w-fit">
          {scholarship.coverageType === "FULL" ? "Full Scholarship" : `${scholarship.coveragePercent ?? ""}% Coverage`}
        </Badge>
        <DeadlineDisplay date={scholarship.deadline} locale={locale} />
        <Button asChild variant="outline" className="mt-auto">
          <Link href={`/${locale}/scholarships/${scholarship.slug}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
