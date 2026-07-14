export const ROW_LIMITS = Object.freeze({ experience: 10, project: 10 });

export function normalizeLegacyContent(content = {}) {
  const normalized = content && typeof content === "object" && !Array.isArray(content) ? { ...content } : {};
  for (const field of ["title", "type", "description", "url"]) {
    const legacyKey = `project.${field}`;
    const currentKey = `project.items.0.${field}`;
    if (typeof normalized[currentKey] !== "string" && typeof normalized[legacyKey] === "string") {
      normalized[currentKey] = normalized[legacyKey];
    }
    delete normalized[legacyKey];
  }
  return normalized;
}

export function inferRowCount(content, kind, fallback = 1) {
  const limit = ROW_LIMITS[kind];
  if (!limit) throw new Error("Unsupported row type");
  const countValue = content?.[`${kind}.itemCount`];
  if (typeof countValue === "string" && /^\d+$/.test(countValue)) {
    return Math.min(limit, Math.max(1, Number(countValue)));
  }

  const expression = kind === "experience" ? /^experience\.items\.(\d+)\./ : /^project\.items\.(\d+)\./;
  let highest = -1;
  for (const key of Object.keys(content || {})) {
    const match = key.match(expression);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return Math.min(limit, Math.max(1, fallback, highest + 1));
}

export function replaceRowIndex(key, kind, index) {
  const expression = kind === "experience" ? /^experience\.items\.\d+/ : /^project\.items\.\d+/;
  return key.replace(expression, `${kind}.items.${index}`);
}
