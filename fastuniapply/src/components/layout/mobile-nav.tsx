"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({
  links,
  loginLabel,
  loginHref,
}: {
  links: { href: string; label: string }[];
  loginLabel: string;
  loginHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background shadow-elevated">
          <nav className="container flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={loginHref}
              className="mt-2 rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {loginLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
