import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/layout/PublicPage";
import { ExploreView } from "@/components/opportunity/ExploreView";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Student Jobs & Graduate Roles — OpportunityHub" },
      {
        name: "description",
        content: "Full-time and freelance roles suitable for students and recent graduates.",
      },
      { property: "og:title", content: "Student Jobs & Graduate Roles — OpportunityHub" },
      { property: "og:description", content: "Full-time and freelance roles for students and graduates." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <PublicPage>
      <ExploreView
        title="Jobs & freelance work"
        subtitle="Full-time and project-based roles open to students and recent graduates."
        lockedTypes={["job", "freelance"]}
        placeholder="Search job titles, companies, locations..."
      />
    </PublicPage>
  );
}
