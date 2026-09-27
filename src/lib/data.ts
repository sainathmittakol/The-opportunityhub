import { supabase } from "@/integrations/supabase/client";
import { PAGE_SIZE } from "./constants";

export type OpportunityRow = {
  id: string;
  title: string;
  description: string | null;
  responsibilities: string | null;
  eligibility: string | null;
  opportunity_type: string;
  location: string | null;
  work_mode: string | null;
  experience_level: string | null;
  salary_min: number | null;
  salary_max: number | null;
  stipend: string | null;
  deadline: string | null;
  event_date: string | null;
  external_url: string | null;
  source_name: string | null;
  source_url: string | null;
  status: string;
  verified: boolean;
  verified_at: string | null;
  organizer: string | null;
  theme: string | null;
  prize: string | null;
  team_size: string | null;
  provider: string | null;
  difficulty: string | null;
  duration: string | null;
  price: string | null;
  is_free: boolean | null;
  certificate: boolean | null;
  company_id: string | null;
  created_at: string;
  companies?: { id: string; name: string; logo: string | null; website: string | null; location: string | null } | null;
  opportunity_skills?: { required: boolean; skills: { id: string; name: string } | null }[];
};

export function skillNames(o: Pick<OpportunityRow, "opportunity_skills">): string[] {
  return (o.opportunity_skills ?? []).map((s) => s.skills?.name).filter(Boolean) as string[];
}

const SELECT =
  "*, companies(id,name,logo,website,location), opportunity_skills(required, skills(id,name))";

export type OpportunityFilters = {
  search?: string;
  types?: string[];
  locations?: string[];
  workModes?: string[];
  experience?: string[];
  skills?: string[];
  deadline?: string | null;
  freeOnly?: boolean;
  certificateOnly?: boolean;
  difficulty?: string[];
  includeExpired?: boolean;
  page?: number;
  pageSize?: number;
};

export async function fetchOpportunities(filters: OpportunityFilters) {
  const pageSize = filters.pageSize ?? PAGE_SIZE;
  const page = filters.page ?? 0;

  let query = supabase.from("opportunities").select(SELECT, { count: "exact" });

  if (!filters.includeExpired) query = query.eq("status", "active");
  if (filters.types?.length) query = query.in("opportunity_type", filters.types);
  if (filters.locations?.length) query = query.in("location", filters.locations);
  if (filters.workModes?.length) query = query.in("work_mode", filters.workModes);
  if (filters.experience?.length) query = query.in("experience_level", filters.experience);
  if (filters.difficulty?.length) query = query.in("difficulty", filters.difficulty);
  if (filters.freeOnly) query = query.eq("is_free", true);
  if (filters.certificateOnly) query = query.eq("certificate", true);

  if (filters.search?.trim()) {
    const term = filters.search.trim().replace(/[%,()]/g, " ");
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%,opportunity_type.ilike.%${term}%,provider.ilike.%${term}%,organizer.ilike.%${term}%`,
    );
  }

  if (filters.deadline) {
    const now = new Date();
    const end = new Date();
    if (filters.deadline === "today") end.setHours(23, 59, 59, 999);
    if (filters.deadline === "week") end.setDate(now.getDate() + 7);
    if (filters.deadline === "month") end.setMonth(now.getMonth() + 1);
    query = query.gte("deadline", now.toISOString()).lte("deadline", end.toISOString());
  }

  query = query
    .order("verified", { ascending: false })
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  let rows = (data ?? []) as unknown as OpportunityRow[];

  if (filters.skills?.length) {
    const wanted = filters.skills.map((s) => s.toLowerCase());
    rows = rows.filter((r) => skillNames(r).some((s) => wanted.includes(s.toLowerCase())));
  }

  return { rows, count: count ?? 0 };
}

export async function fetchOpportunity(id: string) {
  const { data, error } = await supabase.from("opportunities").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as OpportunityRow) ?? null;
}

export async function fetchFeatured(limit = 6) {
  const { data, error } = await supabase
    .from("opportunities")
    .select(SELECT)
    .eq("status", "active")
    .order("verified", { ascending: false })
    .order("deadline", { ascending: true, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as OpportunityRow[];
}

export async function fetchSkills() {
  const { data, error } = await supabase.from("skills").select("id,name,category").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchInterests() {
  const { data, error } = await supabase.from("interests").select("id,name").order("name");
  if (error) throw error;
  return data ?? [];
}

export type FullProfile = {
  profile: {
    id: string;
    user_id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    bio: string | null;
    career_goal: string | null;
    experience_level: string | null;
    preferred_types: string[];
    preferred_locations: string[];
    preferred_work_modes: string[];
    onboarding_completed: boolean;
  } | null;
  education: {
    id: string;
    degree: string | null;
    field_of_study: string | null;
    college: string | null;
    university: string | null;
    graduation_year: number | null;
    percentage: number | null;
    cgpa: number | null;
  }[];
  skills: string[];
  interests: string[];
  goalSkills: string[];
};

export async function fetchFullProfile(userId: string): Promise<FullProfile> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!profile) return { profile: null, education: [], skills: [], interests: [], goalSkills: [] };

  const [edu, ps, pi] = await Promise.all([
    supabase.from("education").select("*").eq("user_id", userId).order("graduation_year", { ascending: false }),
    supabase.from("profile_skills").select("skill_id, skill_level, skills(name)").eq("user_id", userId),
    supabase.from("profile_interests").select("interest_id, interests(name)").eq("user_id", userId),
  ]);

  let goalSkills: string[] = [];
  if (profile.career_goal) {
    const { data } = await supabase
      .from("career_goal_skills")
      .select("skills(name)")
      .eq("career_goal", profile.career_goal);
    goalSkills = (data ?? []).map((r) => (r.skills as { name: string } | null)?.name).filter(Boolean) as string[];
  }

  return {
    profile: profile as FullProfile["profile"],
    education: (edu.data ?? []) as FullProfile["education"],
    skills: (ps.data ?? []).map((r) => (r.skills as { name: string } | null)?.name).filter(Boolean) as string[],
    interests: (pi.data ?? []).map((r) => (r.interests as { name: string } | null)?.name).filter(Boolean) as string[],
    goalSkills,
  };
}

export function profileCompletion(p: FullProfile) {
  if (!p.profile) return { percent: 0, tips: ["Create your student profile to get started."] };
  const checks: { ok: boolean; tip: string }[] = [
    { ok: Boolean(p.profile.full_name), tip: "Add your full name." },
    { ok: Boolean(p.profile.location), tip: "Add your location so we can match nearby opportunities." },
    { ok: Boolean(p.profile.bio), tip: "Write a short bio about what you are looking for." },
    { ok: Boolean(p.profile.phone), tip: "Add a contact number." },
    { ok: p.education.length > 0, tip: "Add your education details." },
    { ok: p.skills.length >= 3, tip: "Add at least three skills to improve matching." },
    { ok: p.interests.length >= 2, tip: "Pick at least two interests." },
    { ok: Boolean(p.profile.career_goal), tip: "Set a career goal to unlock skill-gap analysis." },
    { ok: Boolean(p.profile.experience_level), tip: "Set your experience level." },
    { ok: p.profile.preferred_types.length > 0, tip: "Choose the opportunity types you care about." },
    { ok: p.profile.preferred_work_modes.length > 0, tip: "Choose your preferred work modes." },
  ];
  const done = checks.filter((c) => c.ok).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    tips: checks.filter((c) => !c.ok).map((c) => c.tip),
  };
}
