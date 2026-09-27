import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarDays,
  MapPin,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { PublicPage } from "@/components/layout/PublicPage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeadlineBadge, Pill, VerifiedBadge } from "@/components/opportunity/badges";
import { MatchBreakdown } from "@/components/opportunity/MatchScore";
import { ErrorState } from "@/components/states";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOpportunity, skillNames } from "@/lib/data";
import { formatDate, formatSalary, isExpired } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { useSavedIds, useToggleSave } from "@/components/opportunity/useSaved";
import { useProfileMatcher } from "@/components/opportunity/useProfileMatcher";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/opportunity/$id")({
  head: () => ({
    meta: [
      { title: "Opportunity details — OpportunityHub" },
      { name: "description", content: "Full details, eligibility, skills and deadline for this student opportunity." },
      { property: "og:title", content: "Opportunity details — OpportunityHub" },
      { property: "og:description", content: "Eligibility, skills, deadline and how to apply." },
    ],
  }),
  component: OpportunityDetail,
});

function OpportunityDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [askApplied, setAskApplied] = useState(false);

  const query = useQuery({ queryKey: ["opportunity", id], queryFn: () => fetchOpportunity(id) });
  const { data: savedIds } = useSavedIds();
  const matcher = useProfileMatcher();
  const toggleSave = useToggleSave();

  const { data: application } = useQuery({
    queryKey: ["application", id, user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,status")
        .eq("user_id", user!.id)
        .eq("opportunity_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const createApplication = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("applications")
        .insert({ user_id: user!.id, opportunity_id: id, status: "Applied" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["application", id] });
      qc.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Added to your application tracker.");
      setAskApplied(false);
    },
    onError: () => toast.error("We couldn't save that application. Please try again."),
  });

  if (query.isLoading) {
    return (
      <PublicPage>
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </PublicPage>
    );
  }

  if (query.isError) {
    return (
      <PublicPage>
        <ErrorState title="We couldn't load this opportunity." onRetry={() => query.refetch()} />
      </PublicPage>
    );
  }

  const o = query.data;
  if (!o) {
    return (
      <PublicPage>
        <div className="panel p-10 text-center">
          <h1 className="font-display text-2xl font-semibold">This opportunity is no longer available.</h1>
          <Button asChild className="mt-4">
            <Link to="/explore">Explore Opportunities</Link>
          </Button>
        </div>
      </PublicPage>
    );
  }

  const skills = skillNames(o);
  const expired = isExpired(o.deadline) || o.status === "expired";
  const saved = savedIds?.has(o.id) ?? false;
  const match = matcher ? matcher({ ...o, skills }) : null;

  function onSave() {
    if (!user) {
      toast("Sign in to save opportunities", {
        action: { label: "Sign in", onClick: () => navigate({ to: "/login" }) },
      });
      return;
    }
    toggleSave.mutate({ id: o!.id, saved });
  }

  function onApply() {
    if (!o?.external_url) {
      toast.error("This listing has no application link yet.");
      return;
    }
    window.open(o.external_url, "_blank", "noopener,noreferrer");
    if (user && !application) setAskApplied(true);
  }

  return (
    <PublicPage>
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <article className="min-w-0 space-y-6">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="primary">{o.opportunity_type}</Pill>
              <VerifiedBadge verified={o.verified} />
              {expired ? <Pill tone="destructive">Expired</Pill> : <DeadlineBadge deadline={o.deadline} />}
            </div>
            <h1 className="font-display text-3xl font-semibold">{o.title}</h1>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-4" aria-hidden="true" />
                {o.companies?.name ?? o.organizer ?? o.provider ?? "Independent"}
              </span>
              {o.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {o.location} {o.work_mode ? `· ${o.work_mode}` : ""}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-4" aria-hidden="true" />
                {formatSalary(o)}
              </span>
              {o.event_date ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDate(o.event_date)}
                </span>
              ) : null}
            </p>
          </header>

          {o.description ? (
            <section className="panel p-6">
              <h2 className="font-display text-lg font-semibold">About this opportunity</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{o.description}</p>
            </section>
          ) : null}

          {o.responsibilities ? (
            <section className="panel p-6">
              <h2 className="font-display text-lg font-semibold">What you'll do</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{o.responsibilities}</p>
            </section>
          ) : null}

          {o.eligibility ? (
            <section className="panel p-6">
              <h2 className="font-display text-lg font-semibold">Eligibility</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{o.eligibility}</p>
            </section>
          ) : null}

          {skills.length ? (
            <section className="panel p-6">
              <h2 className="font-display text-lg font-semibold">Skills involved</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            </section>
          ) : null}

          {(o.theme || o.prize || o.team_size || o.duration || o.difficulty) ? (
            <section className="panel grid gap-4 p-6 sm:grid-cols-2">
              {o.theme ? <Detail label="Theme" value={o.theme} /> : null}
              {o.prize ? <Detail label="Prize" value={o.prize} /> : null}
              {o.team_size ? <Detail label="Team size" value={o.team_size} /> : null}
              {o.difficulty ? <Detail label="Difficulty" value={o.difficulty} /> : null}
              {o.duration ? <Detail label="Duration" value={o.duration} /> : null}
              {o.certificate ? <Detail label="Certificate" value="Included" /> : null}
            </section>
          ) : null}

          {o.source_name ? (
            <p className="text-xs text-muted-foreground">
              Listing source: {o.source_name}. Always confirm details on the official page before applying.
            </p>
          ) : null}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="panel space-y-3 p-5">
            {expired ? (
              <p className="text-sm text-muted-foreground">
                The deadline for this opportunity has passed, so applications are closed.
              </p>
            ) : (
              <Button className="w-full" onClick={onApply} disabled={!o.external_url}>
                Apply Now <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={onSave} disabled={toggleSave.isPending}>
              {saved ? (
                <>
                  <BookmarkCheck className="mr-2 size-4" aria-hidden="true" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 size-4" aria-hidden="true" /> Save Opportunity
                </>
              )}
            </Button>
            {application ? (
              <p className="text-center text-sm text-muted-foreground">
                Tracked as <span className="font-medium text-foreground">{application.status}</span> ·{" "}
                <Link to="/applications" className="text-primary hover:underline">
                  View tracker
                </Link>
              </p>
            ) : null}
            {o.deadline ? (
              <p className="text-center text-xs text-muted-foreground">Deadline: {formatDate(o.deadline)}</p>
            ) : null}
          </div>

          {match ? (
            <div className="panel p-5">
              <MatchBreakdown result={match} />
            </div>
          ) : user ? (
            <div className="panel space-y-2 p-5 text-sm">
              <p className="font-medium">Want a match score for this?</p>
              <p className="text-muted-foreground">Add your skills, interests and career goal to see how you fit.</p>
              <Button asChild size="sm" variant="outline">
                <Link to="/onboarding">Complete profile</Link>
              </Button>
            </div>
          ) : (
            <div className="panel space-y-2 p-5 text-sm">
              <p className="font-medium">See how well this matches you</p>
              <p className="text-muted-foreground">Create a student profile to get a transparent match breakdown.</p>
              <Button asChild size="sm">
                <Link to="/signup">Create Student Profile</Link>
              </Button>
            </div>
          )}
        </aside>
      </div>

      <Dialog open={askApplied} onOpenChange={setAskApplied}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Did you apply?</DialogTitle>
            <DialogDescription>
              If you submitted an application on the official page, we'll add it to your tracker with the status
              "Applied". You can change the status any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAskApplied(false)}>
              Not yet
            </Button>
            <Button onClick={() => createApplication.mutate()} disabled={createApplication.isPending}>
              Yes, I applied
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PublicPage>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
