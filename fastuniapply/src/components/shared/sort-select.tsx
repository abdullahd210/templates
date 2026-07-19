"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortOption } from "@/validation/query.schema";

const sortLabels: Record<SortOption, string> = {
  relevance: "Relevance",
  featured: "Featured First",
  name_asc: "Name (A–Z)",
  tuition_asc: "Lowest Tuition",
  tuition_desc: "Highest Tuition",
  newest: "Newest",
  deadline: "Deadline (Soonest)",
};

export function SortSelect({ options }: { options: readonly SortOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sort") as SortOption) || "relevance";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {sortLabels[opt]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
