import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { OpportunityRow } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({
    meta: [
      { title: "Saved opportunities — OpportunityHub" },
      { name: "description", content: "Every opportunity you bookmarked, in one place." },
      { property: "og:title", content: "Saved opportunities — OpportunityHub" },
      { property: "og:description", content: "Your bookmarked internships, jobs, hackathons and courses." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["saved-list", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select(
          "opportunity_id, created_at, opportunities(*, companies(id,name,logo,website,location), opportunity_skills(required, skills(id,name)))",
        )
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? [])
        .map((r) => r.opportunities as unknown as OpportunityRow | null)
        .filter(Boolean) as OpportunityRow[];
    },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Saved opportunities</h1>
        <p className="text-muted-foreground">Come back to these whenever you're ready to apply.</p>
      </header>

      {query.isLoading ? <CardSkeletonGrid /> : null}
      {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : null}
      {query.data && query.data.length === 0 ? (
        <EmptyState
          title="You haven't saved anything yet."
          description="Bookmark opportunities as you browse so you can return to them later."
          actionLabel="Explore Opportunities"
          actionTo="/explore"
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(query.data ?? []).map((o) => (
          <OpportunityCard key={o.id} opportunity={o} saved />
        ))}
      </div>
    </div>
  );
}
