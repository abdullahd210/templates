"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, localeNames, type AppLocale } from "@/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

/** Swaps the leading `/{locale}` segment of the current path, preserving the rest of the URL. */
function withLocale(pathname: string, nextLocale: AppLocale): string {
  const segments = pathname.split("/");
  segments[1] = nextLocale;
  return segments.join("/") || "/";
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Change language">
          <Globe className="h-4 w-4" />
          <span>{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link href={withLocale(pathname, locale)} lang={locale}>
              {localeNames[locale]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
