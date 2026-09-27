import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Building2, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeadlineBadge, Pill, VerifiedBadge } from "./badges";
import { MatchRing } from "./MatchScore";
import { formatSalary } from "@/lib/format";
import { typeLabel } from "@/lib/constants";
import { skillNames, type OpportunityRow } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useToggleSave } from "./useSaved";
import { toast } from "sonner";

export function OpportunityCard({
  opportunity,
  saved = false,
  matchScore,
}: {
  opportunity: OpportunityRow;
  saved?: boolean;
  matchScore?: number;
}) {
  const { user } = useAuth();
  const toggle = useToggleSave();
  const skills = skillNames(opportunity).slice(0, 4);
  const pay = formatSalary(opportunity);
  const company = opportunity.companies?.name ?? opportunity.provider ?? opportunity.organizer;

  function onSave() {
    if (!user) {
      toast("Sign in to save opportunities", {
        description: "Create a free student profile to save and track opportunities.",
        action: { label: "Sign in", onClick: () => (window.location.href = "/login") },
      });
      return;
    }
    toggle.mutate({ id: opportunity.id, saved });
  }

  return (
    <article className="panel group flex h-full flex-col gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">{company ?? "Independent"}</p>
            <Pill tone="primary" className="mt-1">
              {typeLabel(opportunity.opportunity_type)}
            </Pill>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {typeof matchScore === "number" ? <MatchRing score={matchScore} size="sm" /> : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={toggle.isPending}
            aria-label={saved ? "Remove from saved" : "Save opportunity"}
            aria-pressed={saved}
          >
            {saved ? (
              <BookmarkCheck className="size-5 text-primary" aria-hidden="true" />
            ) : (
              <Bookmark className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      <div className="min-w-0 space-y-1">
        <h3 className="text-base leading-snug font-semibold">
          <Link
            to="/opportunity/$id"
            params={{ id: opportunity.id }}
            className="hover:text-primary focus-visible:text-primary"
          >
            {opportunity.title}
          </Link>
        </h3>
        {opportunity.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{opportunity.description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {opportunity.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" /> {opportunity.location}
          </span>
        ) : null}
        {pay ? (
          <span className="inline-flex items-center gap-1">
            <Wallet className="size-3.5" aria-hidden="true" /> {pay}
          </span>
        ) : null}
      </div>

      {skills.length ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <VerifiedBadge verified={opportunity.verified} />
        {opportunity.work_mode ? <Pill>{opportunity.work_mode}</Pill> : null}
        {opportunity.experience_level ? <Pill>{opportunity.experience_level}</Pill> : null}
        <DeadlineBadge deadline={opportunity.deadline} />
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link to="/opportunity/$id" params={{ id: opportunity.id }}>
          View Details
        </Link>
      </Button>
    </article>
  );
}
