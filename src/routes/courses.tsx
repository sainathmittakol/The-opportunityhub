import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Clock, Signal } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Button } from "@/components/ui/button";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { Pill } from "@/components/opportunity/badges";
import { fetchOpportunities, fetchSkills, skillNames } from "@/lib/data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses & Certifications for Students — OpportunityHub" },
      {
        name: "description",
        content: "Free and paid courses and certifications to close your skill gaps, with difficulty and duration.",
      },
      { property: "og:title", content: "Courses & Certifications — OpportunityHub" },
      { property: "og:description", content: "Close your skill gaps with free and paid student courses." },
    ],
  }),
  component: CoursesPage,
});

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function CoursesPage() {
  const [freeOnly, setFreeOnly] = useState(false);
  const [certOnly, setCertOnly] = useState(false);
  const [levels, setLevels] = useState<string[]>([]);
  const [skill, setSkill] = useState<string | null>(null);

  const { data: allSkills = [] } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });

  const query = useQuery({
    queryKey: ["courses", freeOnly, certOnly, levels, skill],
    queryFn: () =>
      fetchOpportunities({
        types: ["course", "certification"],
        freeOnly,
        certificateOnly: certOnly,
        difficulty: levels,
        skills: skill ? [skill] : [],
        pageSize: 24,
      }),
  });

  const popular = allSkills.filter((s) =>
    ["Python", "SQL", "Power BI", "Machine Learning", "AWS", "Cybersecurity", "Excel"].includes(s.name),
  );

  return (
    <PublicPage>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Courses & certifications</h1>
          <p className="text-muted-foreground">
            Structured learning that maps directly to the skills employers ask for.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={freeOnly ? "default" : "outline"} onClick={() => setFreeOnly(!freeOnly)} aria-pressed={freeOnly}>
            Free
          </Button>
          <Button size="sm" variant={certOnly ? "default" : "outline"} onClick={() => setCertOnly(!certOnly)} aria-pressed={certOnly}>
            Certificate
          </Button>
          {LEVELS.map((l) => (
            <Button
              key={l}
              size="sm"
              variant={levels.includes(l) ? "default" : "outline"}
              onClick={() => setLevels(levels.includes(l) ? levels.filter((x) => x !== l) : [...levels, l])}
            >
              {l}
            </Button>
          ))}
          {popular.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant={skill === s.name ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setSkill(skill === s.name ? null : s.name)}
            >
              {s.name}
            </Button>
          ))}
        </div>

        {query.isLoading ? <CardSkeletonGrid /> : null}
        {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : null}
        {query.data && query.data.rows.length === 0 ? (
          <EmptyState
            title="No courses match your current filters."
            description="Try removing a filter to see more learning options."
            actionLabel="Clear filters"
            onAction={() => {
              setFreeOnly(false);
              setCertOnly(false);
              setLevels([]);
              setSkill(null);
            }}
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(query.data?.rows ?? []).map((c) => (
            <article key={c.id} className="panel flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">{c.provider ?? c.companies?.name}</p>
                {c.is_free ? <Pill tone="success">Free</Pill> : <Pill>{c.price ?? "Paid"}</Pill>}
              </div>
              <h2 className="font-display text-base font-semibold">{c.title}</h2>
              {c.description ? <p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p> : null}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {c.difficulty ? (
                  <span className="inline-flex items-center gap-1">
                    <Signal className="size-3.5" aria-hidden="true" /> {c.difficulty}
                  </span>
                ) : null}
                {c.duration ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" /> {c.duration}
                  </span>
                ) : null}
                {c.certificate ? (
                  <span className="inline-flex items-center gap-1">
                    <Award className="size-3.5" aria-hidden="true" /> Certificate
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillNames(c).slice(0, 3).map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-auto w-full">
                <Link to="/opportunity/$id" params={{ id: c.id }}>
                  View Details
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </PublicPage>
  );
}
