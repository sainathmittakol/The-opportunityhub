import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RowSkeleton } from "@/components/states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — OpportunityHub" },
      { name: "description", content: "Platform statistics and opportunity management." },
      { property: "og:title", content: "Admin — OpportunityHub" },
      { property: "og:description", content: "Platform statistics and content management." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();

  const stats = useQuery({
    queryKey: ["admin-stats"],
    enabled: isAdmin,
    queryFn: async () => {
      const count = async (table: "opportunities" | "applications" | "saved_opportunities" | "profiles", filter?: (q: ReturnType<typeof supabase.from>) => unknown) => {
        let q = supabase.from(table).select("id", { count: "exact", head: true });
        if (filter) q = filter(q) as typeof q;
        const { count: c } = await q;
        return c ?? 0;
      };
      return {
        students: await count("profiles"),
        opportunities: await count("opportunities"),
        active: await count("opportunities", (q) => (q as never as { eq: (a: string, b: string) => unknown }).eq("status", "active")),
        applications: await count("applications"),
        saved: await count("saved_opportunities"),
      };
    },
  });

  if (loading) return <RowSkeleton rows={2} />;

  if (!isAdmin) {
    return (
      <div className="panel mx-auto max-w-lg space-y-3 p-8 text-center">
        <h1 className="font-display text-xl font-semibold">This area is for administrators</h1>
        <p className="text-sm text-muted-foreground">
          Your account doesn't have admin access. If you think that's wrong, contact the platform owner.
        </p>
        <Button asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  const s = stats.data;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Admin overview</h1>
        <p className="text-muted-foreground">Platform statistics. Content management tools come next.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Students", v: s?.students },
          { label: "Opportunities", v: s?.opportunities },
          { label: "Active", v: s?.active },
          { label: "Applications", v: s?.applications },
          { label: "Saved", v: s?.saved },
        ].map((c) => (
          <div key={c.label} className="panel p-5">
            <p className="font-display text-2xl font-semibold">{c.v ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
