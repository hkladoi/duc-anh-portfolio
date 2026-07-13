const encoder = new TextEncoder();
const sessionCookieName = "portfolio_editor_session";
const sessionLifetimeSeconds = 365 * 24 * 60 * 60;

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function sha256(value) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function readCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export async function verifyEditorKey(key, env) {
  if (typeof key !== "string" || key.length < 32 || key.length > 256 || !env.EDITOR_KEY_HASH) return false;
  return constantTimeEqual(await sha256(key), env.EDITOR_KEY_HASH.toLowerCase());
}

export async function createSessionCookie(env) {
  if (!env.EDITOR_SESSION_SECRET) throw new Error("Editor session secret is not configured");
  const expires = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds;
  const signature = await hmac(String(expires), env.EDITOR_SESSION_SECRET);
  const value = encodeURIComponent(`${expires}.${signature}`);
  return `${sessionCookieName}=${value}; Path=/api/editor; HttpOnly; Secure; SameSite=Strict; Max-Age=${sessionLifetimeSeconds}`;
}

export function clearSessionCookie() {
  return `${sessionCookieName}=; Path=/api/editor; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function isEditorAuthorized(request, env) {
  if (!env.EDITOR_SESSION_SECRET) return false;
  const cookie = readCookie(request, sessionCookieName);
  if (!cookie) return false;

  const [expiresValue, signature] = cookie.split(".");
  const expires = Number(expiresValue);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(expires) || expires <= now || expires > now + sessionLifetimeSeconds || !signature) return false;

  const expected = await hmac(expiresValue, env.EDITOR_SESSION_SECRET);
  return constantTimeEqual(signature, expected);
}
