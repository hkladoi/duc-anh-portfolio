const locale = document.documentElement.lang === "vi" ? "vi" : "en";
const editorSessionFlag = "portfolio-editor-active";
const editorShortcutWindowMs = 1500;
const editableElements = () => [...document.querySelectorAll("[data-editable][data-content-key]")];

const editorText = locale === "vi"
  ? {
      mode: "Chế độ chỉnh sửa",
      scope: "Chỉ sửa nội dung — cấu trúc các mục đã được khóa",
      saved: "Đã lưu",
      unsaved: "Có thay đổi chưa lưu",
      saving: "Đang lưu…",
      save: "Lưu thay đổi",
      undo: "Hoàn tác",
      lock: "Khóa",
      language: "English",
      discardAndSwitch: "Bỏ các thay đổi chưa lưu và chuyển sang tiếng Anh?",
      saveFailed: "Không thể lưu. Vui lòng thử lại."
    }
  : {
      mode: "Edit mode",
      scope: "Content only — section structure is locked",
      saved: "Saved",
      unsaved: "Unsaved changes",
      saving: "Saving…",
      save: "Save changes",
      undo: "Undo",
      lock: "Lock",
      language: "Tiếng Việt",
      discardAndSwitch: "Discard unsaved changes and switch to Vietnamese?",
      saveFailed: "Could not save. Please try again."
    };

let currentContent = {};
let dirty = false;
let toolbar;
let editorShortcutStartedAt = 0;

function textForDisplay(value, format) {
  if (format === "display-url") {
    try {
      const url = new URL(normalizeUrl(value));
      return `${url.host}${url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")}`;
    } catch {
      return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }
  }

  return value;
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  return /^https:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^https?:\/\//i, "")}`;
}

function valueFromElement(element) {
  const value = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
  if (element.dataset.contentFormat === "display-url") return normalizeUrl(value);
  return value;
}

function collectDefaults() {
  return Object.fromEntries(editableElements().map((element) => [element.dataset.contentKey, valueFromElement(element)]));
}

function updateLinkedAttributes(key, value) {
  document.querySelectorAll(`[data-content-href="${CSS.escape(key)}"]`).forEach((element) => {
    element.setAttribute("href", element.dataset.hrefFormat === "email" ? `mailto:${value}` : normalizeUrl(value));
  });
}

function applyContent(content) {
  editableElements().forEach((element) => {
    const key = element.dataset.contentKey;
    if (typeof content[key] !== "string") return;
    element.textContent = textForDisplay(content[key], element.dataset.contentFormat);
    updateLinkedAttributes(key, content[key]);
  });
}

async function loadContent() {
  const defaults = collectDefaults();

  try {
    const response = await fetch(`/api/content?locale=${locale}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin"
    });
    if (!response.ok) throw new Error("content unavailable");
    const stored = await response.json();
    currentContent = { ...defaults, ...stored };
  } catch {
    currentContent = defaults;
  }

  applyContent(currentContent);
}

function setDirty(nextDirty) {
  dirty = nextDirty;
  document.body.classList.toggle("editor-dirty", dirty);
  if (!toolbar) return;
  const status = toolbar.querySelector("[data-editor-status]");
  status.textContent = dirty ? editorText.unsaved : editorText.saved;
}

function buildToolbar() {
  const element = document.createElement("aside");
  element.className = "editor-toolbar";
  element.setAttribute("aria-label", editorText.mode);
  element.innerHTML = `
    <div class="editor-toolbar-copy">
      <strong>${editorText.mode}<span>${locale.toUpperCase()}</span></strong>
      <small>${editorText.scope}</small>
    </div>
    <p data-editor-status>${editorText.saved}</p>
    <div class="editor-toolbar-actions">
      <button type="button" data-editor-language>${editorText.language}</button>
      <button type="button" data-editor-undo>${editorText.undo}</button>
      <button type="button" data-editor-lock>${editorText.lock}</button>
      <button class="editor-save" type="button" data-editor-save>${editorText.save}</button>
    </div>
  `;
  document.body.append(element);
  return element;
}

async function saveContent() {
  if (!dirty) return;

  const saveButton = toolbar.querySelector("[data-editor-save]");
  const status = toolbar.querySelector("[data-editor-status]");
  saveButton.disabled = true;
  status.textContent = editorText.saving;

  const content = Object.fromEntries(editableElements().map((element) => [element.dataset.contentKey, valueFromElement(element)]));

  try {
    const response = await fetch(`/api/editor/content?locale=${locale}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error("save rejected");
    const result = await response.json();
    currentContent = result.content;
    applyContent(currentContent);
    setDirty(false);
  } catch {
    status.textContent = editorText.saveFailed;
  } finally {
    saveButton.disabled = false;
  }
}

async function lockEditor() {
  if (dirty && !window.confirm(locale === "vi" ? "Bỏ các thay đổi chưa lưu và khóa trình chỉnh sửa?" : "Discard unsaved changes and lock the editor?")) return;

  sessionStorage.removeItem(editorSessionFlag);
  location.reload();
}

function switchLanguage() {
  if (dirty && !window.confirm(editorText.discardAndSwitch)) return;

  const languageLink = document.querySelector(".language-link");
  const target = languageLink?.href || (locale === "vi" ? "/" : "/vi/");
  location.assign(target);
}

function enableEditor() {
  if (document.body.classList.contains("editor-active")) return;

  document.body.classList.add("editor-active");
  toolbar = buildToolbar();

  editableElements().forEach((element) => {
    element.contentEditable = "true";
    element.spellcheck = true;
    element.addEventListener("input", () => setDirty(true));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") event.preventDefault();
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-editor-link]")) event.preventDefault();
  }, true);

  toolbar.querySelector("[data-editor-save]").addEventListener("click", saveContent);
  toolbar.querySelector("[data-editor-undo]").addEventListener("click", () => {
    applyContent(currentContent);
    setDirty(false);
  });
  toolbar.querySelector("[data-editor-lock]").addEventListener("click", lockEditor);
  toolbar.querySelector("[data-editor-language]").addEventListener("click", switchLanguage);

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveContent();
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (!dirty) return;
    event.preventDefault();
  });
}

async function activateEditorFromShortcut() {
  if (document.body.classList.contains("editor-active")) return;

  try {
    const response = await fetch("/api/editor/status", { credentials: "same-origin" });
    if (!response.ok) throw new Error("not authorized");
    sessionStorage.setItem(editorSessionFlag, "1");
    enableEditor();
  } catch {
    sessionStorage.removeItem(editorSessionFlag);
  }
}

document.addEventListener("keydown", (event) => {
  if (document.body.classList.contains("editor-active")) return;

  const key = event.key.toLowerCase();
  const modifierPressed = event.ctrlKey || event.metaKey;

  if (modifierPressed && key === "e") {
    event.preventDefault();
    editorShortcutStartedAt = Date.now();
    return;
  }

  if (modifierPressed && key === "d" && Date.now() - editorShortcutStartedAt <= editorShortcutWindowMs) {
    event.preventDefault();
    editorShortcutStartedAt = 0;
    activateEditorFromShortcut();
    return;
  }

  if (key !== "control" && key !== "meta") editorShortcutStartedAt = 0;
}, true);

async function authenticateEditor() {
  const marker = "#edit=";
  const hasActivationKey = location.hash.startsWith(marker);

  if (hasActivationKey) {
    const key = decodeURIComponent(location.hash.slice(marker.length));
    history.replaceState(null, "", `${location.pathname}${location.search}`);

    try {
      const response = await fetch("/api/editor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ key })
      });
      if (!response.ok) return;
      sessionStorage.setItem(editorSessionFlag, "1");
      enableEditor();
    } catch {
      return;
    }
    return;
  }

  if (sessionStorage.getItem(editorSessionFlag) !== "1") return;

  try {
    const response = await fetch("/api/editor/status", { credentials: "same-origin" });
    if (!response.ok) throw new Error("session expired");
    enableEditor();
  } catch {
    sessionStorage.removeItem(editorSessionFlag);
  }
}

await loadContent();
await authenticateEditor();
