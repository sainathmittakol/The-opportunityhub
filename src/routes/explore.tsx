import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/layout/PublicPage";
import { ExploreView } from "@/components/opportunity/ExploreView";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Opportunities — OpportunityHub" },
      {
        name: "description",
        content:
          "Search and filter jobs, internships, freelance work, hackathons, competitions, courses and certifications for students.",
      },
      { property: "og:title", content: "Explore Opportunities — OpportunityHub" },
      {
        property: "og:description",
        content: "Search and filter student opportunities by type, location, work mode, skills and deadline.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <PublicPage>
      <ExploreView
        title="Find your next opportunity"
        subtitle="Browse everything in one place — no account needed to look around."
      />
    </PublicPage>
  );
}
