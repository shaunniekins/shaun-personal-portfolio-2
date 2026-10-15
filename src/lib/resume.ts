import data from "$lib/portfolio-data.json";

/**
 * The /resume sheet, derived from portfolio-data.json so one edit updates both.
 * Only what a printed resume needs on its own (title, email, phone) lives in the
 * `resume` block of the JSON; everything else is read from the portfolio sections.
 */

const MONTHS: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec"
};

/** "September 2025 – Present" → "Sept 2025 - Present", matching the original sheet. */
function shortPeriod(period: string) {
  return period
    .replace(/[–—]/g, "-")
    .replace(/\b[A-Z][a-z]+\b/g, (month) => MONTHS[month] ?? month);
}

function social(name: string) {
  const match = data.contact.socials.find((s) => s.name === name);
  if (!match) throw new Error(`portfolio-data.json has no "${name}" social link`);
  return match.url;
}

const { resume } = data;

export const name = data.name;
export const title = resume.title;
/** Base64 — decoded only while printing. See the /resume page. */
export const encodedPhone = resume.phone;

export const contacts = [
  { label: "LinkedIn", url: social("LinkedIn"), icon: "linkedin" },
  { label: new URL(resume.website).hostname.replace(/^www\./, ""), url: resume.website, icon: "globe" },
  { label: resume.email, url: `mailto:${resume.email}`, icon: "mail" },
  { label: "GitHub", url: social("GitHub"), icon: "github" }
] as const;

export const experience = data.experience.jobs
  .filter((job) => !("onResume" in job) || job.onResume !== false)
  .map((job) => {
    const location = "location" in job ? job.location : "";
    const remote = "remote" in job && job.remote;
    return {
      company: job.company,
      where: [location, remote ? "(Remote)" : ""].filter(Boolean).join(" "),
      period: shortPeriod(job.period),
      role: "employment" in job ? `${job.role}, ${job.employment}` : job.role,
      bullets: job.responsibilities
    };
  });

/** Every skill group, flattened in order, without duplicates. */
export const skills = [...new Set(data.about.skillGroups.flatMap((group) => group.items))];

export const projects = data.projects.items.flatMap((project) =>
  "resume" in project && project.resume
    ? [
        {
          name: "name" in project.resume ? project.resume.name : project.name,
          url: project.repoUrl !== "#" ? project.repoUrl : null,
          summary: project.resume.summary
        }
      ]
    : []
);

export const education = data.education;
