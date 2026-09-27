import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DEADLINE_FILTERS,
  EXPERIENCE_LEVELS,
  LOCATIONS,
  OPPORTUNITY_TYPES,
  WORK_MODES,
} from "@/lib/constants";
import type { OpportunityFilters } from "@/lib/data";

export type FilterState = {
  types: string[];
  locations: string[];
  workModes: string[];
  experience: string[];
  skills: string[];
  deadline: string | null;
};

export const emptyFilters: FilterState = {
  types: [],
  locations: [],
  workModes: [],
  experience: [],
  skills: [],
  deadline: null,
};

export function countActive(f: FilterState) {
  return (
    f.types.length +
    f.locations.length +
    f.workModes.length +
    f.experience.length +
    f.skills.length +
    (f.deadline ? 1 : 0)
  );
}

function Group({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{title}</legend>
      <div className="space-y-1.5">
        {options.map((o) => {
          const id = `${title}-${o.value}`;
          return (
            <div key={o.value} className="flex items-center gap-2">
              <Checkbox
                id={id}
                checked={selected.includes(o.value)}
                onCheckedChange={() => onToggle(o.value)}
              />
              <Label htmlFor={id} className="text-sm font-normal">
                {o.label}
              </Label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterPanel({
  filters,
  onChange,
  skills,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  skills: { id: string; name: string }[];
}) {
  const toggle = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    onChange({
      ...filters,
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Filters</h2>
        {countActive(filters) > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
            <X className="mr-1 size-3.5" aria-hidden="true" /> Clear
          </Button>
        ) : null}
      </div>

      <Group
        title="Opportunity Type"
        options={OPPORTUNITY_TYPES.map((t) => ({ value: t.value, label: t.singular }))}
        selected={filters.types}
        onToggle={(v) => toggle("types", v)}
      />
      <Group
        title="Location"
        options={LOCATIONS.map((l) => ({ value: l, label: l }))}
        selected={filters.locations}
        onToggle={(v) => toggle("locations", v)}
      />
      <Group
        title="Work Mode"
        options={WORK_MODES.map((l) => ({ value: l, label: l }))}
        selected={filters.workModes}
        onToggle={(v) => toggle("workModes", v)}
      />
      <Group
        title="Experience"
        options={EXPERIENCE_LEVELS.map((l) => ({ value: l, label: l }))}
        selected={filters.experience}
        onToggle={(v) => toggle("experience", v)}
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Deadline</legend>
        <div className="flex flex-wrap gap-2">
          {DEADLINE_FILTERS.map((d) => (
            <Button
              key={d.value}
              type="button"
              size="sm"
              variant={filters.deadline === d.value ? "default" : "outline"}
              onClick={() =>
                onChange({ ...filters, deadline: filters.deadline === d.value ? null : d.value })
              }
            >
              {d.label}
            </Button>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Skills</legend>
        <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto pr-1">
          {skills.map((s) => (
            <Button
              key={s.id}
              type="button"
              size="sm"
              variant={filters.skills.includes(s.name) ? "default" : "outline"}
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => toggle("skills", s.name)}
              aria-pressed={filters.skills.includes(s.name)}
            >
              {s.name}
            </Button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function FilterDrawer(props: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  skills: { id: string; name: string }[];
}) {
  const active = countActive(props.filters);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="mr-2 size-4" aria-hidden="true" />
          Filters{active ? ` (${active})` : ""}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Refine your results</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FilterPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function toQueryFilters(f: FilterState, search: string, page: number): OpportunityFilters {
  return {
    search,
    types: f.types,
    locations: f.locations,
    workModes: f.workModes,
    experience: f.experience,
    skills: f.skills,
    deadline: f.deadline,
    page,
  };
}
