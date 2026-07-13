import { clearSessionCookie, createSessionCookie, verifyEditorKey } from "../../_lib/auth.js";
import { json, unauthorized } from "../../_lib/http.js";

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return unauthorized();
  }

  if (!await verifyEditorKey(body?.key, env)) return unauthorized();

  return json(
    { authenticated: true },
    { headers: { "Set-Cookie": await createSessionCookie(env) } }
  );
}

export function onRequestDelete() {
  return json({ authenticated: false }, { headers: { "Set-Cookie": clearSessionCookie() } });
}
