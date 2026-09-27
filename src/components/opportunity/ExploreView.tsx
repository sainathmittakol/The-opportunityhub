import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { OpportunityCard } from "./OpportunityCard";
import { FilterDrawer, FilterPanel, emptyFilters, type FilterState } from "./Filters";
import { fetchOpportunities, fetchSkills, skillNames } from "@/lib/data";
import { PAGE_SIZE } from "@/lib/constants";
import { useSavedIds } from "./useSaved";
import { useProfileMatcher } from "./useProfileMatcher";

export function ExploreView({
  title,
  subtitle,
  lockedTypes,
  placeholder = "Search jobs, internships, hackathons, courses...",
}: {
  title: string;
  subtitle?: string;
  lockedTypes?: string[];
  placeholder?: string;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [page, setPage] = useState(0);

  const { data: skills = [] } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const { data: savedIds } = useSavedIds();
  const matcher = useProfileMatcher();

  const types = lockedTypes ?? filters.types;

  const query = useQuery({
    queryKey: ["opportunities", { search, filters, page, lockedTypes }],
    queryFn: () =>
      fetchOpportunities({
        search,
        types,
        locations: filters.locations,
        workModes: filters.workModes,
        experience: filters.experience,
        skills: filters.skills,
        deadline: filters.deadline,
        page,
      }),
  });

  const totalPages = Math.max(1, Math.ceil((query.data?.count ?? 0) / PAGE_SIZE));

  const cards = useMemo(() => {
    return (query.data?.rows ?? []).map((o) => ({
      row: o,
      score: matcher ? matcher({ ...o, skills: skillNames(o) }).score : undefined,
    }));
  }, [query.data, matcher]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>

      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(0);
          setSearch(searchInput);
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={placeholder}
            aria-label="Search opportunities"
            className="h-11 pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="h-11 flex-1 sm:flex-none">
            Search
          </Button>
          {!lockedTypes ? <FilterDrawer filters={filters} onChange={(f) => { setFilters(f); setPage(0); }} skills={skills} /> : null}
        </div>
      </form>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        {!lockedTypes ? (
          <div className="hidden lg:block">
            <div className="panel sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
              <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setPage(0); }} skills={skills} />
            </div>
          </div>
        ) : null}

        <div className="min-w-0 space-y-5">
          {query.isLoading ? <CardSkeletonGrid /> : null}
          {query.isError ? (
            <ErrorState
              title="We couldn't load opportunities."
              description="Check your connection and try again."
              onRetry={() => query.refetch()}
            />
          ) : null}
          {query.data && cards.length === 0 ? (
            <EmptyState
              title="No opportunities match your current filters."
              description="Try removing a filter or searching for a broader term."
              actionLabel="Clear filters"
              onAction={() => {
                setFilters(emptyFilters);
                setSearch("");
                setSearchInput("");
                setPage(0);
              }}
            />
          ) : null}

          {cards.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {query.data?.count} opportunit{query.data?.count === 1 ? "y" : "ies"} found
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map(({ row, score }) => (
                  <OpportunityCard
                    key={row.id}
                    opportunity={row}
                    saved={savedIds?.has(row.id) ?? false}
                    {...(score !== undefined ? { matchScore: score } : {})}
                  />
                ))}
              </div>
              {totalPages > 1 ? (
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
