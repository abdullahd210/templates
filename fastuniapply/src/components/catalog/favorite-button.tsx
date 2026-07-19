"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toggleFavoriteAction } from "@/server/actions/favorite";
import { cn } from "@/lib/utils";
import type { FavoriteEntityType } from "@prisma/client";

export function FavoriteButton({
  entityType,
  entityId,
  initialFavorited = false,
  locale,
  className,
  size = "icon",
}: {
  entityType: FavoriteEntityType;
  entityId: string;
  initialFavorited?: boolean;
  locale: string;
  className?: string;
  size?: "icon" | "default";
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (status !== "authenticated") {
      toast({ title: "Sign in required", description: "Create a free account to save favorites." });
      router.push(`/${locale}/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Optimistic toggle — reverted if the server action fails.
    const next = !favorited;
    setFavorited(next);
    startTransition(async () => {
      const result = await toggleFavoriteAction({ entityType, entityId });
      if (!result.success) {
        setFavorited(!next);
        toast({ title: "Couldn't update favorites", description: result.message, variant: "destructive" });
      }
    });
  }

  const label = favorited ? "Remove from favorites" : "Add to favorites";

  if (size === "default") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={favorited}
        className={className}
      >
        <Heart className={cn("h-4 w-4", favorited && "fill-destructive text-destructive")} />
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={label}
      className={className}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-destructive text-destructive")} />
    </Button>
  );
}
