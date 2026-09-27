/**
 * Rule-based, transparent ATS compatibility estimation.
 * Runs on text extracted from the uploaded resume in the browser.
 */

export type AtsResult = {
  overall: number;
  keyword: number;
  skills: number;
  experience: number;
  projects: number;
  formatting: number;
  suggestions: string[];
  detectedSkills: string[];
};

const SECTION_HINTS = [
  "education",
  "experience",
  "skills",
  "projects",
  "certification",
  "summary",
  "achievements",
];

const ACTION_VERBS = [
  "built",
  "developed",
  "designed",
  "implemented",
  "analysed",
  "analyzed",
  "led",
  "improved",
  "automated",
  "created",
  "delivered",
  "reduced",
  "increased",
];

function pct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function analyseResume(text: string, knownSkills: string[]): AtsResult {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const suggestions: string[] = [];

  const detectedSkills = knownSkills.filter((s) => lower.includes(s.toLowerCase()));

  // Sections / formatting
  const sectionsFound = SECTION_HINTS.filter((s) => lower.includes(s));
  let formatting = pct((sectionsFound.length / 5) * 100);
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(text);
  const hasPhone = /(\+?\d[\d\s-]{7,})/.test(text);
  if (!hasEmail || !hasPhone) {
    formatting -= 12;
    suggestions.push("Add clear contact details (email and phone) near the top so parsers can find them.");
  }
  if (words.length < 200) {
    formatting -= 10;
    suggestions.push("Your resume looks short. Expand your experience and project descriptions.");
  }
  if (/\t{2,}|\|{2,}/.test(text)) {
    suggestions.push("Avoid multi-column tables — many applicant tracking systems read them out of order.");
  }
  if (!lower.includes("skills")) {
    suggestions.push("Add a dedicated Skills section listing tools and technologies you genuinely use.");
  }
  formatting = pct(formatting);

  // Keywords
  const keywordHits = detectedSkills.length;
  const keyword = pct(30 + keywordHits * 7);
  if (keywordHits < 5) {
    suggestions.push(
      "Consider adding relevant keywords from the target role, but only where they accurately describe your experience.",
    );
  }

  // Skills
  const skills = pct(25 + detectedSkills.length * 8);

  // Experience
  const hasDates = (text.match(/(20\d{2})/g) || []).length;
  const verbUsage = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  let experience = pct(30 + hasDates * 6 + verbUsage * 5);
  if (hasDates < 2) {
    experience -= 5;
    suggestions.push("Use a consistent date format (for example Jan 2024 – Jun 2024) for every role or internship.");
  }
  if (verbUsage < 4) {
    suggestions.push("Start bullet points with action verbs such as built, analysed or improved.");
  }
  experience = pct(experience);

  // Projects
  const projectMentions = (lower.match(/project/g) || []).length;
  const hasNumbers = (text.match(/\d+%|\d+\s?(users|records|hours|students|rows)/gi) || []).length;
  let projects = pct(25 + projectMentions * 12 + hasNumbers * 10);
  if (!hasNumbers) {
    suggestions.push("Add measurable outcomes to project descriptions where applicable (for example 'cut report time by 40%').");
  }
  if (projectMentions === 0) {
    suggestions.push("Include 2–3 projects with a one-line problem, approach and result.");
  }
  projects = pct(projects);

  const overall = pct(
    keyword * 0.2 + skills * 0.25 + experience * 0.2 + projects * 0.15 + formatting * 0.2,
  );

  if (!suggestions.length) {
    suggestions.push("Your resume covers the basics well. Keep tailoring keywords to each opportunity you apply to.");
  }

  return { overall, keyword, skills, experience, projects, formatting, suggestions, detectedSkills };
}

/** Very small text extractor that works for PDF and DOCX in the browser. */
export async function extractText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

  if (file.name.toLowerCase().endsWith(".docx")) {
    // DOCX is a zip; readable text still appears between XML tags in the stored parts.
    const stripped = raw.replace(/<[^>]+>/g, " ");
    return cleanup(stripped);
  }

  // PDF: pull text out of parenthesised string literals in content streams.
  const literals = raw.match(/\(([^()\\]{2,})\)/g);
  if (literals && literals.length > 20) {
    return cleanup(literals.map((l) => l.slice(1, -1)).join(" "));
  }
  return cleanup(raw.replace(/[^\x20-\x7E\n]+/g, " "));
}

function cleanup(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, " ")
    .trim();
}
