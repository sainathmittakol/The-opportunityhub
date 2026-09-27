import { MATCH_WEIGHTS } from "./constants";

export type MatchProfile = {
  skills: string[];
  interests: string[];
  careerGoal: string | null;
  experienceLevel: string | null;
  preferredLocations: string[];
  preferredWorkModes: string[];
  preferredTypes: string[];
  goalSkills: string[];
};

export type MatchTarget = {
  title: string;
  description?: string | null;
  opportunity_type: string;
  location?: string | null;
  work_mode?: string | null;
  experience_level?: string | null;
  skills: string[];
};

export type MatchResult = {
  score: number;
  breakdown: { label: string; value: number }[];
  reasons: string[];
  matchedSkills: string[];
  missingSkills: string[];
};

const norm = (s: string) => s.trim().toLowerCase();

export function computeMatch(profile: MatchProfile, target: MatchTarget): MatchResult {
  const mySkills = new Set(profile.skills.map(norm));
  const needed = target.skills;
  const matchedSkills = needed.filter((s) => mySkills.has(norm(s)));
  const missingSkills = needed.filter((s) => !mySkills.has(norm(s)));

  const skillScore = needed.length
    ? Math.round((matchedSkills.length / needed.length) * 100)
    : profile.skills.length
      ? 60
      : 50;

  const haystack = `${target.title} ${target.description ?? ""} ${needed.join(" ")}`.toLowerCase();
  const matchedInterests = profile.interests.filter((i) => {
    const words = norm(i).split(/[\s/]+/).filter((w) => w.length > 2);
    return words.some((w) => haystack.includes(w));
  });
  const interestScore = profile.interests.length
    ? Math.min(100, Math.round((matchedInterests.length / Math.min(profile.interests.length, 3)) * 100))
    : 50;

  const expOrder = ["Fresher", "0-1 years", "1-3 years", "Other"];
  const mine = profile.experienceLevel ? expOrder.indexOf(profile.experienceLevel) : -1;
  const theirs = target.experience_level ? expOrder.indexOf(target.experience_level) : -1;
  let experienceScore = 70;
  if (mine >= 0 && theirs >= 0) {
    const diff = Math.abs(mine - theirs);
    experienceScore = diff === 0 ? 100 : diff === 1 ? 80 : 55;
  }

  let locationScore = 70;
  const prefLoc = profile.preferredLocations.map(norm);
  const prefMode = profile.preferredWorkModes.map(norm);
  const locMatch = target.location ? prefLoc.includes(norm(target.location)) : false;
  const modeMatch = target.work_mode ? prefMode.includes(norm(target.work_mode)) : false;
  if (prefLoc.length || prefMode.length) {
    locationScore = locMatch && modeMatch ? 100 : locMatch || modeMatch ? 85 : 45;
  }

  const goalSkills = new Set(profile.goalSkills.map(norm));
  const goalOverlap = needed.filter((s) => goalSkills.has(norm(s)));
  const typeMatch = profile.preferredTypes.map(norm).includes(norm(target.opportunity_type));
  let goalScore = 60;
  if (profile.careerGoal) {
    goalScore = 50;
    if (goalOverlap.length) goalScore += 35;
    if (typeMatch) goalScore += 15;
    goalScore = Math.min(100, goalScore);
  }

  const score = Math.round(
    skillScore * MATCH_WEIGHTS.skills +
      interestScore * MATCH_WEIGHTS.interests +
      experienceScore * MATCH_WEIGHTS.experience +
      locationScore * MATCH_WEIGHTS.location +
      goalScore * MATCH_WEIGHTS.careerGoal,
  );

  const reasons: string[] = [];
  if (matchedSkills.length)
    reasons.push(`Matches your ${matchedSkills.slice(0, 3).join(", ")} skill${matchedSkills.length > 1 ? "s" : ""}`);
  if (matchedInterests.length)
    reasons.push(`Matches your ${matchedInterests.slice(0, 2).join(" and ")} interest`);
  if (experienceScore >= 80) reasons.push("Suitable for your experience level");
  if (modeMatch) reasons.push(`Matches your preferred ${target.work_mode} work mode`);
  if (locMatch) reasons.push(`Located in ${target.location}, one of your preferred locations`);
  if (goalOverlap.length && profile.careerGoal)
    reasons.push(`Builds skills for your goal: ${profile.careerGoal}`);
  if (!reasons.length) reasons.push("Broadly related to your profile — review the details before applying");

  return {
    score,
    breakdown: [
      { label: "Skills", value: skillScore },
      { label: "Interests", value: interestScore },
      { label: "Experience", value: experienceScore },
      { label: "Location", value: locationScore },
      { label: "Career Goal", value: goalScore },
    ],
    reasons,
    matchedSkills,
    missingSkills,
  };
}
