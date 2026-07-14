export const CONTENT_LIMITS = Object.freeze({
  experienceItems: 10,
  projectItems: 10,
  technologies: 12
});

const staticFields = new Map([
  ["introduction.name", 120],
  ["introduction.role", 120],
  ["introduction.statement", 260],
  ["introduction.body", 900],
  ["introduction.location", 160],
  ["introduction.availability", 180],
  ["contact.title", 180],
  ["contact.body", 600],
  ["contact.email", 254],
  ["contact.github", 400]
]);

const experienceFields = new Map([
  ["company", 180],
  ["role", 120],
  ["period", 100],
  ["projectOverview", 500],
  ["responsibilities", 700]
]);

const projectFields = new Map([
  ["type", 160],
  ["title", 180],
  ["description", 700],
  ["url", 400]
]);

function normalizeUrl(value) {
  const candidate = /^https:\/\//i.test(value) ? value : `https://${value.replace(/^https?:\/\//i, "")}`;
  const url = new URL(candidate);
  if (url.protocol !== "https:" || !url.hostname) throw new Error("Only HTTPS URLs are allowed");
  return url.toString();
}

function parseCount(value, max, key) {
  if (!/^\d+$/.test(value)) throw new Error(`Invalid value for ${key}`);
  const count = Number(value);
  if (count < 1 || count > max) throw new Error(`Invalid value for ${key}`);
  return String(count);
}

function fieldRule(key) {
  if (staticFields.has(key)) return { maxLength: staticFields.get(key) };
  if (key === "experience.itemCount") return { count: CONTENT_LIMITS.experienceItems };
  if (key === "project.itemCount") return { count: CONTENT_LIMITS.projectItems };

  let match = key.match(/^experience\.items\.(\d+)\.(company|role|period|projectOverview|responsibilities)$/);
  if (match) {
    const index = Number(match[1]);
    if (index < CONTENT_LIMITS.experienceItems) return { maxLength: experienceFields.get(match[2]), kind: "experience", index };
    return null;
  }

  match = key.match(/^experience\.items\.(\d+)\.technologies\.(\d+)$/);
  if (match) {
    const index = Number(match[1]);
    const technologyIndex = Number(match[2]);
    if (index < CONTENT_LIMITS.experienceItems && technologyIndex < CONTENT_LIMITS.technologies) {
      return { maxLength: 80, kind: "experience", index };
    }
    return null;
  }

  match = key.match(/^project\.items\.(\d+)\.(type|title|description|url)$/);
  if (match) {
    const index = Number(match[1]);
    if (index < CONTENT_LIMITS.projectItems) return { maxLength: projectFields.get(match[2]), kind: "project", index };
  }

  return null;
}

export function parseLocale(value) {
  return value === "en" || value === "vi" ? value : null;
}

export function validateContent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid content payload");
  const entries = Object.entries(input);
  if (entries.length === 0 || entries.length > 240) throw new Error("Invalid number of content fields");

  const content = {};
  const counts = {
    experience: typeof input["experience.itemCount"] === "string" ? Number(input["experience.itemCount"]) : null,
    project: typeof input["project.itemCount"] === "string" ? Number(input["project.itemCount"]) : null
  };

  for (const [key, rawValue] of entries) {
    const rule = fieldRule(key);
    if (!rule) throw new Error(`Field is not editable: ${key}`);
    if (typeof rawValue !== "string") throw new Error(`Invalid value for ${key}`);

    const value = rawValue.replace(/\s+/g, " ").trim();
    if (rule.count) {
      content[key] = parseCount(value, rule.count, key);
      continue;
    }

    if (!value || value.length > rule.maxLength) throw new Error(`Invalid length for ${key}`);
    if (rule.kind && counts[rule.kind] !== null && rule.index >= counts[rule.kind]) {
      throw new Error(`Field is outside ${rule.kind} item count: ${key}`);
    }
    if (key === "contact.email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Invalid email address");
    content[key] = key === "contact.github" || key.endsWith(".url") ? normalizeUrl(value) : value;
  }

  return content;
}
