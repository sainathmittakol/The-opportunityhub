import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchFullProfile } from "@/lib/data";
import { computeMatch, type MatchResult, type MatchTarget } from "@/lib/match";
import { useAuth } from "@/lib/auth";

export function useProfileData() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["full-profile", user?.id],
    enabled: Boolean(user),
    queryFn: () => fetchFullProfile(user!.id),
  });
}

export type Matcher = (target: MatchTarget) => MatchResult;

/** Returns a matcher when the student has a usable profile, otherwise null. */
export function useProfileMatcher(): Matcher | null {
  const { data } = useProfileData();

  return useMemo(() => {
    const p = data?.profile;
    if (!p) return null;
    const usable = (data?.skills.length ?? 0) > 0 || (data?.interests.length ?? 0) > 0 || Boolean(p.career_goal);
    if (!usable) return null;
    return (target: MatchTarget) =>
      computeMatch(
        {
          skills: data?.skills ?? [],
          interests: data?.interests ?? [],
          careerGoal: p.career_goal,
          experienceLevel: p.experience_level,
          preferredLocations: p.preferred_locations ?? [],
          preferredWorkModes: p.preferred_work_modes ?? [],
          preferredTypes: p.preferred_types ?? [],
          goalSkills: data?.goalSkills ?? [],
        },
        target,
      );
  }, [data]);
}
