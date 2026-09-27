import { createFileRoute, Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RowSkeleton } from "@/components/states";
import { profileCompletion } from "@/lib/data";
import { useProfileData } from "@/components/opportunity/useProfileMatcher";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — OpportunityHub" },
      { name: "description", content: "Your student profile, completion score and suggestions." },
      { property: "og:title", content: "Your profile — OpportunityHub" },
      { property: "og:description", content: "Profile completion and matching preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, isLoading } = useProfileData();
  if (isLoading || !data) return <RowSkeleton />;
  const c = profileCompletion(data);
  const p = data.profile;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{p?.full_name ?? "Your profile"}</h1>
        <p className="text-muted-foreground">{p?.email}</p>
      </header>

      <section className="panel space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Profile completion</h2>
          <span className="font-display text-lg text-primary">{c.percent}%</span>
        </div>
        <Progress value={c.percent} className="h-2" />
        {c.tips.length ? (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {c.tips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Your OpportunityHub profile is ready.</p>
        )}
        <Button asChild size="sm">
          <Link to="/onboarding">Edit profile details</Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Skills</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.skills.length ? data.skills.join(", ") : "No skills added yet."}
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Interests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.interests.length ? data.interests.join(", ") : "No interests added yet."}
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Career goal</h2>
          <p className="mt-2 text-sm text-muted-foreground">{p?.career_goal ?? "Not set yet."}</p>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-lg font-semibold">Education</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {data.education.length ? (
              data.education.map((e) => (
                <li key={e.id}>
                  {e.degree} {e.field_of_study ? `· ${e.field_of_study}` : ""} {e.college ? `· ${e.college}` : ""}
                </li>
              ))
            ) : (
              <li>No education added yet.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
