const allowedFields = new Map([
  ["introduction.name", 120],
  ["introduction.role", 120],
  ["introduction.statement", 260],
  ["introduction.body", 900],
  ["introduction.location", 160],
  ["introduction.availability", 180],
  ["contact.title", 180],
  ["contact.body", 600],
  ["contact.email", 254],
  ["contact.github", 400],
  ["project.type", 160],
  ["project.title", 180],
  ["project.description", 700],
  ["project.url", 400]
]);

const technologyCounts = [5, 7, 5];

for (let index = 0; index < 3; index += 1) {
  allowedFields.set(`experience.items.${index}.company`, 180);
  allowedFields.set(`experience.items.${index}.role`, 120);
  allowedFields.set(`experience.items.${index}.period`, 100);
  allowedFields.set(`experience.items.${index}.projectOverview`, 500);
  allowedFields.set(`experience.items.${index}.responsibilities`, 700);
  for (let technologyIndex = 0; technologyIndex < technologyCounts[index]; technologyIndex += 1) {
    allowedFields.set(`experience.items.${index}.technologies.${technologyIndex}`, 80);
  }
}

function normalizeUrl(value) {
  const candidate = /^https:\/\//i.test(value) ? value : `https://${value.replace(/^https?:\/\//i, "")}`;
  const url = new URL(candidate);
  if (url.protocol !== "https:" || !url.hostname) throw new Error("Only HTTPS URLs are allowed");
  return url.toString();
}

export function parseLocale(value) {
  return value === "en" || value === "vi" ? value : null;
}

export function validateContent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid content payload");
  const entries = Object.entries(input);
  if (entries.length === 0 || entries.length > allowedFields.size) throw new Error("Invalid number of content fields");

  const content = {};
  for (const [key, rawValue] of entries) {
    const maxLength = allowedFields.get(key);
    if (!maxLength) throw new Error(`Field is not editable: ${key}`);
    if (typeof rawValue !== "string") throw new Error(`Invalid value for ${key}`);

    const value = rawValue.replace(/\s+/g, " ").trim();
    if (!value || value.length > maxLength) throw new Error(`Invalid length for ${key}`);

    if (key === "contact.email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Invalid email address");
    content[key] = key === "contact.github" || key === "project.url" ? normalizeUrl(value) : value;
  }

  return content;
}
