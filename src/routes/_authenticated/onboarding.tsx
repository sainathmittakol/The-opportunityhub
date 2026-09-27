import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your profile — OpportunityHub" },
      { name: "description", content: "Add your education, skills, interests, career goal and preferences." },
      { property: "og:title", content: "Set up your profile — OpportunityHub" },
      { property: "og:description", content: "Six quick steps to better opportunity matching." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Set up your profile</h1>
      <p className="text-muted-foreground">
        The guided six-step setup (basic info, education, skills, interests, career goal and preferences) is being
        built next. Your account is already active, so you can explore and save opportunities in the meantime.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link to="/explore">Explore Opportunities</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
