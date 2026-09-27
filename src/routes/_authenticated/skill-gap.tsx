import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill gap analysis — OpportunityHub" },
      { name: "description", content: "Compare your current skills against your career target and find courses." },
      { property: "og:title", content: "Skill gap analysis — OpportunityHub" },
      { property: "og:description", content: "See which skills to learn next for your career goal." },
    ],
  }),
  component: SkillGapPage,
});

function SkillGapPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Skill gap analysis</h1>
      <p className="text-muted-foreground">
        Pick a career target and compare it against your current skills — coming in the next build step, together with
        recommended courses from the catalogue.
      </p>
      <Button asChild>
        <Link to="/courses">Browse courses</Link>
      </Button>
    </div>
  );
}
