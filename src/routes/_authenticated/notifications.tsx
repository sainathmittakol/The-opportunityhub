import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/states";
import { formatDate } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — OpportunityHub" },
      { name: "description", content: "Updates about deadlines, matches and your applications." },
      { property: "og:title", content: "Notifications — OpportunityHub" },
      { property: "og:description", content: "Deadline, match and application updates." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id?: string) => {
      let q = supabase.from("notifications").update({ read: true }).eq("user_id", user!.id);
      if (id) q = q.eq("id", id);
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">Deadlines, matches and application updates.</p>
        </div>
        {rows.some((r) => !r.read) ? (
          <Button variant="outline" size="sm" onClick={() => markRead.mutate(undefined)}>
            Mark all as read
          </Button>
        ) : null}
      </header>

      {query.isLoading ? <RowSkeleton /> : null}
      {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : null}
      {query.data && rows.length === 0 ? (
        <EmptyState
          title="No notifications yet."
          description="We'll let you know when a deadline is close or an opportunity matches your profile."
          actionLabel="Explore Opportunities"
          actionTo="/explore"
        />
      ) : null}

      <ul className="space-y-2">
        {rows.map((n) => (
          <li
            key={n.id}
            className={`panel flex flex-wrap items-start justify-between gap-3 p-4 ${n.read ? "opacity-70" : ""}`}
          >
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
            </div>
            {!n.read ? (
              <Button size="sm" variant="ghost" onClick={() => markRead.mutate(n.id)}>
                Mark read
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
