export function daysUntil(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export function deadlineLabel(deadline: string | null | undefined): string | null {
  const days = daysUntil(deadline);
  if (days === null) return null;
  if (days < 0) return "Expired";
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day remaining";
  return `${days} days remaining`;
}

export function isExpired(o: { deadline?: string | null; status?: string | null }): boolean {
  if (o.status === "expired") return true;
  const days = daysUntil(o.deadline);
  return days !== null && days < 0;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSalary(o: {
  salary_min?: number | null;
  salary_max?: number | null;
  stipend?: string | null;
  price?: string | null;
}): string | null {
  if (o.stipend) return o.stipend;
  if (o.price) return o.price;
  if (o.salary_min && o.salary_max)
    return `INR ${(o.salary_min / 100000).toFixed(1)}–${(o.salary_max / 100000).toFixed(1)} LPA`;
  if (o.salary_min) return `From INR ${(o.salary_min / 100000).toFixed(1)} LPA`;
  return null;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function initials(name: string | null | undefined): string {
  if (!name) return "OH";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
