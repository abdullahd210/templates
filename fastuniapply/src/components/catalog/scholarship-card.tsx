import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CalendarClock } from "lucide-react";
import type { AppLocale } from "@/i18n/config";
import { formatDate } from "@/lib/format";

export interface ScholarshipCardData {
  slug: string;
  title: string;
  providerName: string;
  coverageType: "FULL" | "PARTIAL";
  coveragePercent: number | null;
  deadline: string | null;
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-accent">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-base font-semibold leading-snug">{scholarship.title}</p>
          <p className="text-sm text-muted-foreground">{scholarship.providerName}</p>
        </div>
        <Badge variant={scholarship.coverageType === "FULL" ? "accent" : "outline"} className="w-fit">
          {scholarship.coverageType === "FULL"
            ? "Full Scholarship"
            : `${scholarship.coveragePercent ?? ""}% Coverage`}
        </Badge>
        {scholarship.deadline && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" /> Deadline: {formatDate(scholarship.deadline, locale)}
          </p>
        )}
        <Button asChild variant="outline" className="mt-auto">
          <Link href={`/${locale}/scholarships/${scholarship.slug}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
