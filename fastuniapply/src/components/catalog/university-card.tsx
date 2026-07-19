import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, GraduationCap } from "lucide-react";
import type { AppLocale } from "@/i18n/config";
import { PriceDisplay } from "@/components/shared/price-display";
import { FeaturedBadge } from "@/components/shared/status-badge";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { CompareButton } from "@/components/catalog/compare-button";
import type { UniversityType } from "@prisma/client";

export interface UniversityCardData {
  id: string;
  slug: string;
  name: string;
  countryName: string;
  city?: string | null;
  type: UniversityType;
  startingTuitionMinor: number | null;
  currency: string;
  programsCount: number;
  scholarshipsAvailable: boolean;
  logoUrl?: string | null;
  isFeatured?: boolean;
  isFavorited?: boolean;
}

export function UniversityCard({ university, locale }: { university: UniversityCardData; locale: AppLocale }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative flex items-center gap-3 border-b border-border bg-muted/40 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-soft">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold">{university.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {university.city ? `${university.city}, ` : ""}
            {university.countryName}
          </p>
        </div>
        <div className="absolute end-3 top-3 flex gap-1">
          <FavoriteButton entityType="UNIVERSITY" entityId={university.id} initialFavorited={university.isFavorited} locale={locale} />
          <CompareButton kind="universities" slug={university.slug} />
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{university.type === "PUBLIC" ? "Public" : "Private"}</Badge>
          <Badge variant="muted">{university.programsCount} programs</Badge>
          {university.scholarshipsAvailable && <Badge variant="accent">Scholarships available</Badge>}
          {university.isFeatured && <FeaturedBadge />}
        </div>
        <p className="text-sm text-muted-foreground">
          Starting from <PriceDisplay amountMinor={university.startingTuitionMinor} currency={university.currency} locale={locale} /> /year
        </p>
        <Button asChild className="mt-auto">
          <Link href={`/${locale}/universities/${university.slug}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
