import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import test from "node:test";

globalThis.crypto ??= webcrypto;

const { createSessionCookie, isEditorAuthorized, verifyEditorKey } = await import("../functions/_lib/auth.js");
const { validateContent } = await import("../functions/_lib/schema.js");
const { onRequestGet: getPublicContent } = await import("../functions/api/content.js");
const { onRequestPut: putEditorContent } = await import("../functions/api/editor/content.js");
const { onRequestGet: getEditorStatus } = await import("../functions/api/editor/status.js");

const encoder = new TextEncoder();

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createKv() {
  const storage = new Map();
  return {
    async get(key, options) {
      const value = storage.get(key);
      return options?.type === "json" && value ? JSON.parse(value) : value ?? null;
    },
    async put(key, value) {
      storage.set(key, value);
    }
  };
}

test("editor key creates a valid, signed session", async () => {
  const key = "test-key-with-more-than-thirty-two-characters";
  const env = {
    EDITOR_KEY_HASH: await sha256(key),
    EDITOR_SESSION_SECRET: "session-secret-with-enough-randomness-for-tests"
  };

  assert.equal(await verifyEditorKey(key, env), true);
  assert.equal(await verifyEditorKey(`${key}-wrong`, env), false);

  const setCookie = await createSessionCookie(env);
  assert.match(setCookie, /HttpOnly; Secure; SameSite=Strict; Max-Age=31536000$/);
  const cookie = setCookie.split(";")[0];
  const request = new Request("https://portfolio.example/api/editor/status", { headers: { Cookie: cookie } });
  assert.equal(await isEditorAuthorized(request, env), true);
});

test("valid legacy session is upgraded to a rolling one-year session", async () => {
  const env = { EDITOR_SESSION_SECRET: "rolling-session-secret" };
  const expires = String(Math.floor(Date.now() / 1000) + 8 * 60 * 60);
  const signature = await hmac(expires, env.EDITOR_SESSION_SECRET);
  const cookie = `portfolio_editor_session=${encodeURIComponent(`${expires}.${signature}`)}`;
  const request = new Request("https://portfolio.example/api/editor/status", { headers: { Cookie: cookie } });

  const response = await getEditorStatus({ request, env });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Set-Cookie"), /Max-Age=31536000$/);
});

test("content validator permits only editable content fields", () => {
  const content = validateContent({
    "introduction.statement": "A clear introduction",
    "contact.email": "owner@example.com",
    "contact.github": "github.com/owner",
    "experience.itemCount": "4",
    "experience.items.0.projectOverview": "A real-estate management platform",
    "experience.items.0.responsibilities": "Develop booking and payment workflows",
    "experience.items.3.company": "Added company",
    "project.itemCount": "2",
    "project.items.1.url": "store.example.com"
  });

  assert.equal(content["contact.github"], "https://github.com/owner");
  assert.equal(content["project.items.1.url"], "https://store.example.com/");
  assert.equal(content["experience.items.3.company"], "Added company");
  assert.throws(() => validateContent({ "navigation.0.label": "Changed section" }), /not editable/);
  assert.throws(() => validateContent({ "experience.itemCount": "3", "experience.items.3.company": "Added company" }), /outside experience item count/);
  assert.throws(() => validateContent({ "project.itemCount": "11" }), /Invalid value/);
  assert.throws(() => validateContent({ "experience.items.0.summary": "Old combined description" }), /not editable/);
  assert.throws(() => validateContent({ "contact.email": "not-an-email" }), /Invalid email/);
});

test("authorized API saves content and public API returns it", async () => {
  const key = "another-test-key-with-more-than-thirty-two-characters";
  const env = {
    EDITOR_KEY_HASH: await sha256(key),
    EDITOR_SESSION_SECRET: "another-session-secret-with-sufficient-randomness",
    PORTFOLIO_CONTENT: createKv()
  };
  const cookie = (await createSessionCookie(env)).split(";")[0];
  const content = {
    "introduction.statement": "Updated directly on the page",
    "contact.email": "owner@example.com",
    "project.itemCount": "1",
    "project.items.0.url": "https://store.example.com"
  };

  const saveRequest = new Request("https://portfolio.example/api/editor/content?locale=en", {
    method: "PUT",
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  const saveResponse = await putEditorContent({ request: saveRequest, env });
  assert.equal(saveResponse.status, 200);

  const publicRequest = new Request("https://portfolio.example/api/content?locale=en");
  const publicResponse = await getPublicContent({ request: publicRequest, env });
  assert.equal(publicResponse.status, 200);
  assert.deepEqual(await publicResponse.json(), {
    ...content,
    "project.items.0.url": "https://store.example.com/"
  });
});

test("editor API hides itself from unauthenticated visitors", async () => {
  const env = {
    EDITOR_SESSION_SECRET: "session-secret",
    PORTFOLIO_CONTENT: createKv()
  };
  const request = new Request("https://portfolio.example/api/editor/content?locale=vi", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: { "contact.email": "attacker@example.com" } })
  });

  const response = await putEditorContent({ request, env });
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Not found" });
});
