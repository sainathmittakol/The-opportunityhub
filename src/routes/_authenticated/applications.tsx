import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/states";
import { ApplicationStatusBadge } from "@/components/opportunity/badges";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: [
      { title: "Application tracker — OpportunityHub" },
      { name: "description", content: "Track every application you send, from applied through to selected." },
      { property: "og:title", content: "Application tracker — OpportunityHub" },
      { property: "og:description", content: "Your applications and their current status." },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,status,applied_at,notes,updated_at,opportunities(id,title,opportunity_type,companies(name))")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Status updated.");
    },
    onError: () => toast.error("We couldn't update that status. Please try again."),
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Application tracker</h1>
        <p className="text-muted-foreground">Keep every application and its status in one place.</p>
      </header>

      {query.isLoading ? <RowSkeleton /> : null}
      {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : null}
      {query.data && rows.length === 0 ? (
        <EmptyState
          title="No applications tracked yet."
          description="When you apply to an opportunity we'll ask if you want to track it here."
          actionLabel="Explore Opportunities"
          actionTo="/explore"
        />
      ) : null}

      <ul className="space-y-3">
        {rows.map((a) => {
          const o = a.opportunities as { id: string; title: string; companies: { name: string } | null } | null;
          return (
            <li key={a.id} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                {o ? (
                  <Link
                    to="/opportunity/$id"
                    params={{ id: o.id }}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {o.title}
                  </Link>
                ) : (
                  <span className="font-medium">Opportunity removed</span>
                )}
                <p className="text-sm text-muted-foreground">
                  {o?.companies?.name ?? "—"} · Applied {formatDate(a.applied_at)}
                </p>
                {a.notes ? <p className="mt-1 text-sm text-muted-foreground">{a.notes}</p> : null}
              </div>
              <div className="flex items-center gap-3">
                <ApplicationStatusBadge status={a.status} />
                <label className="sr-only" htmlFor={`status-${a.id}`}>
                  Update status
                </label>
                <select
                  id={`status-${a.id}`}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  value={a.status}
                  onChange={(e) => updateStatus.mutate({ id: a.id, status: e.target.value })}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
