import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, GraduationCap, Heart, Scale } from "lucide-react";
import type { AppLocale } from "@/i18n/config";
import { formatMoney } from "@/lib/format";

export interface UniversityCardData {
  slug: string;
  name: string;
  countryName: string;
  city: string;
  type: "PUBLIC" | "PRIVATE";
  startingTuitionMinor: number | null;
  currency: string;
  programsCount: number;
  scholarshipsAvailable: boolean;
  logoUrl?: string | null;
}

export function UniversityCard({ university, locale }: { university: UniversityCardData; locale: AppLocale }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-soft">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold">{university.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {university.city}, {university.countryName}
          </p>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{university.type === "PUBLIC" ? "Public" : "Private"}</Badge>
          <Badge variant="muted">{university.programsCount} programs</Badge>
          {university.scholarshipsAvailable && <Badge variant="accent">Scholarships available</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Starting from{" "}
          <span className="font-semibold text-foreground">
            {university.startingTuitionMinor
              ? formatMoney(university.startingTuitionMinor, university.currency, locale)
              : "—"}
          </span>
          /year
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link href={`/${locale}/universities/${university.slug}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="icon" aria-label="Add to favorites">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Compare">
            <Scale className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
