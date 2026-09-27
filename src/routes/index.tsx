import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  Briefcase,
  Code2,
  FileSearch,
  GraduationCap,
  Laptop,
  Rocket,
  Target,
  Trophy,
} from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Button } from "@/components/ui/button";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { CardSkeletonGrid, ErrorState } from "@/components/states";
import { fetchFeatured } from "@/lib/data";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpportunityHub — Your Next Opportunity Starts Here" },
      {
        name: "description",
        content:
          "Discover internships, jobs, hackathons, competitions and courses matched to your skills, interests and career goal. Track applications and check your resume against ATS rules.",
      },
      { property: "og:title", content: "OpportunityHub — Your Next Opportunity Starts Here" },
      {
        property: "og:description",
        content: "Student opportunity discovery, matching, application tracking and resume analysis in one place.",
      },
    ],
  }),
  component: Landing,
});

const CATEGORIES = [
  { label: "Internships", icon: GraduationCap, to: "/internships", desc: "Learn on real teams" },
  { label: "Jobs", icon: Briefcase, to: "/jobs", desc: "Fresher-friendly roles" },
  { label: "Freelance", icon: Laptop, to: "/jobs", desc: "Paid project work" },
  { label: "Hackathons", icon: Code2, to: "/hackathons", desc: "Build in a weekend" },
  { label: "Competitions", icon: Trophy, to: "/hackathons", desc: "Compete and win" },
  { label: "Courses", icon: Award, to: "/courses", desc: "Close your skill gaps" },
];

const STEPS = [
  { title: "Create your student profile", body: "Tell us your education, skills, interests and career goal." },
  { title: "Get matched", body: "A transparent rule-based engine scores every opportunity against your profile." },
  { title: "Explore and filter", body: "Search by type, location, work mode, experience, skills and deadline." },
  { title: "Save and apply", body: "Bookmark what interests you and apply on the official source." },
  { title: "Track your applications", body: "Move each application through your own status pipeline." },
  { title: "Improve and repeat", body: "Use resume analysis and skill-gap courses to become a stronger candidate." },
];

function Landing() {
  const featured = useQuery({ queryKey: ["featured"], queryFn: () => fetchFeatured(6) });

  return (
    <PublicPage wide>
      <section className="hero-glow relative overflow-hidden border-b border-border">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Rocket className="size-3.5 text-primary" aria-hidden="true" />
              Built for students and recent graduates
            </span>
            <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Your Next Opportunity Starts Here.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Internships, jobs, hackathons, competitions and courses — matched to your skills, interests and career
              goal, with application tracking and honest resume feedback.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/explore">
                  Explore Opportunities <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/signup">Create Student Profile</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No account needed to browse. Sign in when you want to save, track and analyse.
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Students collaborating on laptops while reviewing opportunity listings"
              className="w-full rounded-2xl border border-border object-cover shadow-2xl"
              width={1200}
              height={900}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Browse by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="panel group flex items-center gap-4 p-5 transition-colors hover:border-primary/50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display font-semibold">{c.label}</span>
                <span className="block text-sm text-muted-foreground">{c.desc}</span>
              </span>
              <ArrowRight
                className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured opportunities</h2>
              <p className="text-sm text-muted-foreground">Closing soon and verified first.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/explore">See all</Link>
            </Button>
          </div>
          <div className="mt-6">
            {featured.isLoading ? <CardSkeletonGrid /> : null}
            {featured.isError ? <ErrorState onRetry={() => featured.refetch()} /> : null}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(featured.data ?? []).map((o) => (
                <OpportunityCard key={o.id} opportunity={o} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">How OpportunityHub works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="panel p-5">
              <span className="font-display text-sm font-semibold text-primary">Step {i + 1}</span>
              <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <FileSearch className="size-4" aria-hidden="true" /> Resume & ATS
            </span>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              See how your resume reads before a recruiter does
            </h2>
            <p className="text-muted-foreground">
              Upload your resume and get an estimated ATS compatibility score broken down by keywords, skills,
              experience, projects and formatting — plus specific, honest suggestions.
            </p>
            <p className="text-sm text-muted-foreground">
              This is an estimated analysis. Different companies use different ATS software with different rules.
            </p>
            <Button asChild>
              <Link to="/resume">Analyse my resume</Link>
            </Button>
          </div>
          <div className="panel space-y-4 p-6">
            {[
              { label: "Keywords", v: 78 },
              { label: "Skills", v: 84 },
              { label: "Experience", v: 66 },
              { label: "Projects", v: 72 },
              { label: "Formatting", v: 90 },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm">
                  <span>{b.label}</span>
                  <span className="text-muted-foreground">{b.v}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${b.v}%` }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Illustrative example of a score breakdown.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="panel flex flex-col items-center gap-4 p-10 text-center">
          <Target className="size-8 text-primary" aria-hidden="true" />
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Ready to find opportunities that fit you?</h2>
          <p className="max-w-xl text-muted-foreground">
            Create your profile in a few minutes and start getting matched, tracking applications and closing skill
            gaps.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/signup">Create Student Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore">Explore Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
