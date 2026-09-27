import { Check } from "lucide-react";
import type { MatchResult } from "@/lib/match";
import { Progress } from "@/components/ui/progress";

export function MatchRing({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "size-11 text-xs" : "size-16 text-sm";
  return (
    <div
      className={`relative flex ${dim} shrink-0 items-center justify-center rounded-full font-semibold`}
      style={{
        background: `conic-gradient(var(--color-primary) ${score * 3.6}deg, var(--color-muted) 0deg)`,
      }}
      role="img"
      aria-label={`${score} percent match with your profile`}
    >
      <span className="flex size-[78%] items-center justify-center rounded-full bg-card text-foreground">
        {score}%
      </span>
    </div>
  );
}

export function MatchBreakdown({ match }: { match: MatchResult }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <MatchRing score={match.score} />
        <div>
          <p className="text-lg font-semibold">Your Match: {match.score}%</p>
          <p className="text-sm text-muted-foreground">
            A transparent, rule-based score — not a guarantee of selection.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {match.breakdown.map((b) => (
          <div key={b.label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="text-muted-foreground">{b.label}</span>
            <Progress value={b.value} className="h-2" />
            <span className="text-right font-medium">{b.value}%</span>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Why this opportunity matches you</p>
        <ul className="space-y-1.5">
          {match.reasons.map((r) => (
            <li key={r} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
