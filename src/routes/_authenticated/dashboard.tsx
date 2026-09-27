import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bookmark, CalendarClock, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { DeadlineBadge } from "@/components/opportunity/badges";
import { fetchOpportunities, profileCompletion, skillNames } from "@/lib/data";
import { greeting } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useProfileData, useProfileMatcher } from "@/components/opportunity/useProfileMatcher";
import { useSavedIds } from "@/components/opportunity/useSaved";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — OpportunityHub" },
      { name: "description", content: "Your recommended opportunities, application stats and profile progress." },
      { property: "og:title", content: "Your dashboard — OpportunityHub" },
      { property: "og:description", content: "Recommended opportunities and application progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const profileQuery = useProfileData();
  const matcher = useProfileMatcher();
  const { data: savedIds } = useSavedIds();

  const stats = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const [saved, apps] = await Promise.all([
        supabase.from("saved_opportunities").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("applications").select("status").eq("user_id", user!.id),
      ]);
      const rows = apps.data ?? [];
      return {
        saved: saved.count ?? 0,
        applications: rows.length,
        interviews: rows.filter((r) => r.status === "Interview").length,
        shortlisted: rows.filter((r) => r.status === "Shortlisted").length,
        selected: rows.filter((r) => r.status === "Selected").length,
      };
    },
  });

  const recommended = useQuery({
    queryKey: ["recommended"],
    queryFn: () => fetchOpportunities({ pageSize: 30 }),
  });

  const deadlines = useQuery({
    queryKey: ["closing-soon"],
    queryFn: () => fetchOpportunities({ deadline: "week", pageSize: 5 }),
  });

  const completion = profileQuery.data ? profileCompletion(profileQuery.data) : null;
  const name = profileQuery.data?.profile?.full_name?.split(" ")[0] ?? "there";

  const top = (recommended.data?.rows ?? [])
    .map((o) => ({ row: o, score: matcher ? matcher({ ...o, skills: skillNames(o) }).score : 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          {greeting()}, {name}.
        </h1>
        <p className="text-muted-foreground">Here's where things stand today.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saved" value={stats.data?.saved} icon={Bookmark} to="/saved" />
        <StatCard label="Applications" value={stats.data?.applications} icon={Send} to="/applications" />
        <StatCard label="Interviews" value={stats.data?.interviews} icon={CalendarClock} to="/applications" />
        <StatCard label="Shortlisted" value={stats.data?.shortlisted} icon={Sparkles} to="/applications" />
      </section>

      {completion && completion.percent < 100 ? (
        <section className="panel space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Profile completion</h2>
            <span className="font-display text-lg text-primary">{completion.percent}%</span>
          </div>
          <Progress value={completion.percent} className="h-2" />
          <ul className="space-y-1 text-sm text-muted-foreground">
            {completion.tips.slice(0, 3).map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <Button asChild size="sm" variant="outline">
            <Link to="/profile">Update profile</Link>
          </Button>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">
            {matcher ? "Recommended for you" : "Latest opportunities"}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/explore">
              Explore all <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {!matcher ? (
          <p className="text-sm text-muted-foreground">
            Add your skills, interests and career goal to turn this into a personalised match list.
          </p>
        ) : null}
        {recommended.isLoading ? <CardSkeletonGrid /> : null}
        {recommended.isError ? <ErrorState onRetry={() => recommended.refetch()} /> : null}
        {recommended.data && top.length === 0 ? (
          <EmptyState title="No open opportunities right now." actionLabel="Explore" actionTo="/explore" />
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {top.map(({ row, score }) => (
            <OpportunityCard
              key={row.id}
              opportunity={row}
              saved={savedIds?.has(row.id) ?? false}
              matchScore={matcher ? score : undefined}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Closing this week</h2>
        {(deadlines.data?.rows ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing closes in the next seven days.</p>
        ) : (
          <ul className="space-y-2">
            {(deadlines.data?.rows ?? []).map((o) => (
              <li key={o.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link
                    to="/opportunity/$id"
                    params={{ id: o.id }}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {o.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{o.companies?.name ?? o.organizer ?? o.provider}</p>
                </div>
                <DeadlineBadge deadline={o.deadline} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  to,
}: {
  label: string;
  value: number | undefined;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
}) {
  return (
    <Link to={to} className="panel flex items-center gap-4 p-5 transition-colors hover:border-primary/50">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-display text-2xl font-semibold">{value ?? "—"}</span>
        <span className="block text-sm text-muted-foreground">{label}</span>
      </span>
    </Link>
  );
}
