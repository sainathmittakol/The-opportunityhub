export const OPPORTUNITY_TYPES = [
  { value: "job", label: "Jobs", singular: "Full-time Job" },
  { value: "internship", label: "Internships", singular: "Internship" },
  { value: "freelance", label: "Freelance", singular: "Freelance" },
  { value: "hackathon", label: "Hackathons", singular: "Hackathon" },
  { value: "competition", label: "Competitions", singular: "Competition" },
  { value: "course", label: "Courses", singular: "Course" },
  { value: "certification", label: "Certifications", singular: "Certification" },
] as const;

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]["value"];

export function typeLabel(value: string | null | undefined) {
  return OPPORTUNITY_TYPES.find((t) => t.value === value)?.singular ?? "Opportunity";
}

export const LOCATIONS = ["Remote", "Pune", "Mumbai", "Bengaluru", "Hyderabad", "Other"];
export const WORK_MODES = ["Remote", "Hybrid", "On-site"];
export const EXPERIENCE_LEVELS = ["Fresher", "0-1 years", "1-3 years", "Other"];
export const DEADLINE_FILTERS = [
  { value: "today", label: "Ending today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export const APPLICATION_STATUSES = [
  "Saved",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
  "Withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const CAREER_GOALS = [
  "Get my first job",
  "Find an internship",
  "Become a Data Analyst",
  "Become a Software Developer",
  "Learn AI/ML",
  "Build portfolio",
  "Prepare for placements",
  "Freelance",
  "Other",
];

export const MATCH_WEIGHTS = {
  skills: 0.4,
  interests: 0.25,
  experience: 0.15,
  location: 0.1,
  careerGoal: 0.1,
};

export const PAGE_SIZE = 12;
