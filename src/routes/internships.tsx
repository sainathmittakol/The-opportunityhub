import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/layout/PublicPage";
import { ExploreView } from "@/components/opportunity/ExploreView";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Student Internships — OpportunityHub" },
      {
        name: "description",
        content: "Paid and unpaid internships across software, data, cloud, design and more.",
      },
      { property: "og:title", content: "Student Internships — OpportunityHub" },
      { property: "og:description", content: "Internships across software, data, cloud and design." },
    ],
  }),
  component: InternshipsPage,
});

function InternshipsPage() {
  return (
    <PublicPage>
      <ExploreView
        title="Internships"
        subtitle="Build real experience while you study."
        lockedTypes={["internship"]}
        placeholder="Search internships by role, skill or city..."
      />
    </PublicPage>
  );
}
