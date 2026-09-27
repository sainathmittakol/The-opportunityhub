import { BadgeCheck, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil, deadlineLabel } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/constants";

export function Pill({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "success" | "warning" | "destructive" | "ink";
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/18 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
    ink: "bg-ink text-ink-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return <Pill tone="muted">Unverified</Pill>;
  return (
    <Pill tone="success">
      <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified
    </Pill>
  );
}

export function DeadlineBadge({ deadline }: { deadline: string | null | undefined }) {
  const label = deadlineLabel(deadline);
  if (!label) return null;
  const days = daysUntil(deadline) ?? 0;
  const tone = days < 0 ? "destructive" : days <= 3 ? "warning" : "muted";
  return (
    <Pill tone={tone}>
      <CalendarClock className="size-3.5" aria-hidden="true" /> {label}
    </Pill>
  );
}

const STATUS_TONE: Record<string, "muted" | "primary" | "success" | "warning" | "destructive"> = {
  Saved: "muted",
  Applied: "primary",
  "Under Review": "primary",
  Shortlisted: "warning",
  Interview: "warning",
  Selected: "success",
  Rejected: "destructive",
  Withdrawn: "muted",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus | string }) {
  return <Pill tone={STATUS_TONE[status] ?? "muted"}>{status}</Pill>;
}
