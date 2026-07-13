import { isEditorAuthorized } from "../../_lib/auth.js";
import { json, unauthorized } from "../../_lib/http.js";

export async function onRequestGet({ request, env }) {
  if (!await isEditorAuthorized(request, env)) return unauthorized();
  return json({ authenticated: true });
}
