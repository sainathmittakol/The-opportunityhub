import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Trophy, Users } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Button } from "@/components/ui/button";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { DeadlineBadge, Pill, VerifiedBadge } from "@/components/opportunity/badges";
import { fetchOpportunities } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { WORK_MODES } from "@/lib/constants";

export const Route = createFileRoute("/hackathons")({
  head: () => ({
    meta: [
      { title: "Hackathons & Competitions for Students — OpportunityHub" },
      {
        name: "description",
        content: "Find student hackathons and competitions with themes, prizes, team sizes and registration deadlines.",
      },
      { property: "og:title", content: "Hackathons & Competitions — OpportunityHub" },
      { property: "og:description", content: "Themes, prizes, team sizes and registration deadlines in one place." },
    ],
  }),
  component: HackathonsPage,
});

function HackathonsPage() {
  const [mode, setMode] = useState<string | null>(null);
  const [type, setType] = useState<string>("all");

  const types = type === "all" ? ["hackathon", "competition"] : [type];
  const query = useQuery({
    queryKey: ["hackathons", mode, type],
    queryFn: () =>
      fetchOpportunities({ types, workModes: mode ? [mode] : [], pageSize: 24 }),
  });

  return (
    <PublicPage>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Hackathons & competitions</h1>
          <p className="text-muted-foreground">
            Build something in a weekend, win prizes, and add real projects to your resume.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "hackathon", "competition"].map((t) => (
            <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)}>
              {t === "all" ? "All" : t === "hackathon" ? "Hackathons" : "Competitions"}
            </Button>
          ))}
          <span className="mx-1 hidden w-px bg-border sm:block" />
          {WORK_MODES.map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? "default" : "outline"}
              onClick={() => setMode(mode === m ? null : m)}
            >
              {m}
            </Button>
          ))}
        </div>

        {query.isLoading ? <CardSkeletonGrid count={3} /> : null}
        {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : null}
        {query.data && query.data.rows.length === 0 ? (
          <EmptyState
            title="No hackathons match these filters."
            description="Try clearing the work mode filter."
            actionLabel="Explore everything"
            actionTo="/explore"
          />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {(query.data?.rows ?? []).map((h) => (
            <article key={h.id} className="panel flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">{h.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {h.organizer ?? h.companies?.name ?? "Independent organiser"}
                  </p>
                </div>
                <VerifiedBadge verified={h.verified} />
              </div>
              {h.theme ? <Pill tone="primary">Theme: {h.theme}</Pill> : null}
              {h.description ? <p className="text-sm text-muted-foreground">{h.description}</p> : null}
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {h.prize ? (
                  <div>
                    <dt className="text-muted-foreground">Prize</dt>
                    <dd className="flex items-center gap-1.5 font-medium">
                      <Trophy className="size-4 text-warning" aria-hidden="true" /> {h.prize}
                    </dd>
                  </div>
                ) : null}
                {h.team_size ? (
                  <div>
                    <dt className="text-muted-foreground">Team size</dt>
                    <dd className="flex items-center gap-1.5 font-medium">
                      <Users className="size-4" aria-hidden="true" /> {h.team_size}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Mode</dt>
                  <dd className="font-medium">
                    {h.work_mode ?? "—"} {h.location ? `· ${h.location}` : ""}
                  </dd>
                </div>
                {h.event_date ? (
                  <div>
                    <dt className="text-muted-foreground">Event date</dt>
                    <dd className="flex items-center gap-1.5 font-medium">
                      <CalendarDays className="size-4" aria-hidden="true" /> {formatDate(h.event_date)}
                    </dd>
                  </div>
                ) : null}
              </dl>
              {h.eligibility ? (
                <p className="text-sm">
                  <span className="text-muted-foreground">Eligibility: </span>
                  {h.eligibility}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                <DeadlineBadge deadline={h.deadline} />
                <Button asChild size="sm">
                  <Link to="/opportunity/$id" params={{ id: h.id }}>
                    View & register
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PublicPage>
  );
}
