import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({
    meta: [
      { title: "Resume & ATS analysis — OpportunityHub" },
      { name: "description", content: "Upload your resume and get an estimated ATS compatibility breakdown." },
      { property: "og:title", content: "Resume & ATS analysis — OpportunityHub" },
      { property: "og:description", content: "Estimated ATS score with keyword, skill and formatting feedback." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Resume & ATS analysis</h1>
      <p className="text-muted-foreground">
        Secure private resume storage and the rule-based ATS analyser are the next part of the build. Uploads will be
        private to your account only.
      </p>
      <p className="text-sm text-muted-foreground">
        Any score shown here will be an estimate — different companies use different ATS software with different rules.
      </p>
      <Button asChild variant="outline">
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
