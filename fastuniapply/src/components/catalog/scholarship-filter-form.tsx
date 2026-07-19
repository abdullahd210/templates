import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ScholarshipQuery } from "@/validation/scholarship-query.schema";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import type { DegreeLevel } from "@prisma/client";

interface Option {
  value: string;
  label: string;
}

export function ScholarshipFilterForm({
  locale,
  query,
  countries,
  universities,
}: {
  locale: string;
  query: ScholarshipQuery;
  countries: Option[];
  universities: Option[];
}) {
  return (
    <form action={`/${locale}/scholarships`} method="GET" className="space-y-4">
      <input type="hidden" name="sort" value={query.sort} />
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Search</label>
        <Input name="q" defaultValue={query.q ?? ""} placeholder="Search scholarships…" />
      </div>
      <SelectField name="country" label="Country" defaultValue={query.country} options={countries} />
      <SelectField name="university" label="University" defaultValue={query.university} options={universities} />
      <SelectField
        name="coverageType"
        label="Coverage"
        defaultValue={query.coverageType}
        options={[
          { value: "FULL", label: "Full" },
          { value: "PARTIAL", label: "Partial" },
        ]}
      />
      <SelectField
        name="degreeLevel"
        label="Degree Level"
        defaultValue={query.degreeLevel}
        options={(Object.keys(degreeLevelLabel) as DegreeLevel[]).map((d) => ({ value: d, label: degreeLevelLabel[d] }))}
      />
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Nationality</label>
        <Input name="nationality" defaultValue={query.nationality ?? ""} placeholder="e.g. Egyptian, Nigerian…" />
      </div>
      <SelectField
        name="status"
        label="Status"
        defaultValue={query.status}
        options={[
          { value: "active", label: "Active (open)" },
          { value: "expired", label: "Expired" },
        ]}
      />
      <Button type="submit" className="w-full">
        Apply Filters
      </Button>
    </form>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: Option[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select name={name} defaultValue={defaultValue || "all"}>
        <SelectTrigger>
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
