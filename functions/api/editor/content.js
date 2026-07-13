import { isEditorAuthorized } from "../../_lib/auth.js";
import { json, unauthorized } from "../../_lib/http.js";
import { parseLocale, validateContent } from "../../_lib/schema.js";

async function authorize(request, env) {
  return isEditorAuthorized(request, env);
}

export async function onRequestGet({ request, env }) {
  if (!await authorize(request, env)) return unauthorized();
  const locale = parseLocale(new URL(request.url).searchParams.get("locale"));
  if (!locale) return json({ error: "Invalid locale" }, { status: 400 });
  if (!env.PORTFOLIO_CONTENT) return json({ error: "Content storage is unavailable" }, { status: 503 });

  const content = await env.PORTFOLIO_CONTENT.get(`content:${locale}`, { type: "json" });
  return json({ content: content || {} });
}

export async function onRequestPut({ request, env }) {
  if (!await authorize(request, env)) return unauthorized();
  const locale = parseLocale(new URL(request.url).searchParams.get("locale"));
  if (!locale) return json({ error: "Invalid locale" }, { status: 400 });
  if (!env.PORTFOLIO_CONTENT) return json({ error: "Content storage is unavailable" }, { status: 503 });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  let content;
  try {
    content = validateContent(body?.content);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Invalid content" }, { status: 400 });
  }

  await env.PORTFOLIO_CONTENT.put(`content:${locale}`, JSON.stringify(content));
  return json({ content });
}
