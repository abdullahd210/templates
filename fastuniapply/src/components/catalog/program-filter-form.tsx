import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProgramQuery } from "@/validation/program-query.schema";
import { degreeLevelLabel } from "@/components/catalog/program-card";
import type { DegreeLevel } from "@prisma/client";

interface Option {
  value: string;
  label: string;
}

export function ProgramFilterForm({
  locale,
  query,
  countries,
  universities,
  fields,
  studyLanguages,
}: {
  locale: string;
  query: ProgramQuery;
  countries: Option[];
  universities: Option[];
  fields: string[];
  studyLanguages: string[];
}) {
  return (
    <form action={`/${locale}/programs`} method="GET" className="space-y-4">
      <input type="hidden" name="sort" value={query.sort} />
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Search</label>
        <Input name="q" defaultValue={query.q ?? ""} placeholder="Search programs…" />
      </div>
      <SelectField
        name="degreeLevel"
        label="Degree Level"
        defaultValue={query.degreeLevel}
        options={(Object.keys(degreeLevelLabel) as DegreeLevel[]).map((d) => ({ value: d, label: degreeLevelLabel[d] }))}
      />
      <SelectField name="field" label="Academic Field" defaultValue={query.field} options={fields.map((f) => ({ value: f, label: f }))} />
      <SelectField name="country" label="Country" defaultValue={query.country} options={countries} />
      <SelectField name="university" label="University" defaultValue={query.university} options={universities} />
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
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Max duration (months)</label>
        <Input type="number" min={0} name="maxDuration" defaultValue={query.maxDuration ?? ""} />
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
      <CheckboxField name="scholarships" label="Has linked scholarships" defaultChecked={query.scholarships} />
      <CheckboxField name="featured" label="Featured programs only" defaultChecked={query.featured} />
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
