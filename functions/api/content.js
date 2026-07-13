import { json } from "../_lib/http.js";
import { parseLocale } from "../_lib/schema.js";

export async function onRequestGet({ request, env }) {
  const locale = parseLocale(new URL(request.url).searchParams.get("locale"));
  if (!locale) return json({ error: "Invalid locale" }, { status: 400 });
  if (!env.PORTFOLIO_CONTENT) return json({});

  const content = await env.PORTFOLIO_CONTENT.get(`content:${locale}`, { type: "json" });
  return json(content || {});
}
