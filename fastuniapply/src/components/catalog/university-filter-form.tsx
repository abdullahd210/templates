import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UniversityQuery } from "@/validation/university-query.schema";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import type { DegreeLevel } from "@prisma/client";

interface Option {
  value: string;
  label: string;
}

/**
 * Single source of truth for the university filter form — rendered once in
 * the desktop sidebar and once inside MobileFilterDrawer, both as plain GET
 * forms so filters are shareable URLs and work without client JS.
 */
export function UniversityFilterForm({
  locale,
  query,
  countries,
  cities,
  studyLanguages,
}: {
  locale: string;
  query: UniversityQuery;
  countries: Option[];
  cities: Option[];
  studyLanguages: string[];
}) {
  return (
    <form action={`/${locale}/universities`} method="GET" className="space-y-4">
      <input type="hidden" name="sort" value={query.sort} />
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Search</label>
        <Input name="q" defaultValue={query.q ?? ""} placeholder="Search universities…" />
      </div>
      <SelectField name="country" label="Country" defaultValue={query.country} options={countries} />
      <SelectField name="city" label="City" defaultValue={query.city} options={cities} />
      <SelectField
        name="type"
        label="Type"
        defaultValue={query.type}
        options={[
          { value: "PUBLIC", label: "Public" },
          { value: "PRIVATE", label: "Private" },
        ]}
      />
      <SelectField
        name="degreeLevel"
        label="Degree Level"
        defaultValue={query.degreeLevel}
        options={(Object.keys(degreeLevelLabel) as DegreeLevel[]).map((d) => ({ value: d, label: degreeLevelLabel[d] }))}
      />
      <SelectField
        name="studyLanguage"
        label="Study Language"
        defaultValue={query.studyLanguage}
        options={studyLanguages.map((l) => ({ value: l, label: l }))}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Min tuition (USD)</label>
          <Input type="number" min={0} name="minTuition" defaultValue={query.minTuition ? query.minTuition / 100 : ""} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Max tuition (USD)</label>
          <Input type="number" min={0} name="maxTuition" defaultValue={query.maxTuition ? query.maxTuition / 100 : ""} />
        </div>
      </div>
      <SelectField
        name="admission"
        label="Admission Status"
        defaultValue={query.admission}
        options={[
          { value: "OPEN", label: "Admissions Open" },
          { value: "UPCOMING", label: "Upcoming" },
          { value: "CLOSED", label: "Closed" },
        ]}
      />
      <CheckboxField name="scholarships" label="Scholarships available" defaultChecked={query.scholarships} />
      <CheckboxField name="featured" label="Featured universities only" defaultChecked={query.featured} />
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

function CheckboxField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
      />
      {label}
    </label>
  );
}
