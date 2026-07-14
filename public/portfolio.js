import { createSequenceMatcher, isTextEntryTarget } from "/editor-sequence.js";
import { ROW_LIMITS, inferRowCount, normalizeLegacyContent, replaceRowIndex } from "/editor-rows.js";

const locale = document.documentElement.lang === "vi" ? "vi" : "en";
const editorSessionFlag = "portfolio-editor-active";
const editableElements = () => [...document.querySelectorAll("[data-editable][data-content-key]")];
const rowContainer = (kind) => document.querySelector(`[data-row-container="${kind}"]`);
const rows = (kind) => [...document.querySelectorAll(`[data-editor-row="${kind}"]`)];

const editorText = locale === "vi"
  ? {
      mode: "Chế độ chỉnh sửa",
      scope: "Sửa nội dung, thêm, xóa hoặc sắp xếp các dòng",
      saved: "Đã lưu",
      unsaved: "Có thay đổi chưa lưu",
      saving: "Đang lưu…",
      save: "Lưu thay đổi",
      undo: "Hoàn tác",
      lock: "Khóa",
      language: "English",
      discardAndSwitch: "Bỏ các thay đổi chưa lưu và chuyển sang tiếng Anh?",
      saveBeforeCv: "Vui lòng lưu các thay đổi trước khi mở CV.",
      saveFailed: "Không thể lưu. Vui lòng thử lại.",
      removeRow: "Xóa dòng này?",
      minimumRow: "Mỗi mục cần có ít nhất một dòng."
    }
  : {
      mode: "Edit mode",
      scope: "Edit content, add, delete, or reorder rows",
      saved: "Saved",
      unsaved: "Unsaved changes",
      saving: "Saving…",
      save: "Save changes",
      undo: "Undo",
      lock: "Lock",
      language: "Tiếng Việt",
      discardAndSwitch: "Discard unsaved changes and switch to Vietnamese?",
      saveBeforeCv: "Please save your changes before opening the CV.",
      saveFailed: "Could not save. Please try again.",
      removeRow: "Delete this row?",
      minimumRow: "Each section needs at least one row."
    };

const newRowText = locale === "vi"
  ? {
      company: "Công ty mới",
      role: ".NET Developer",
      period: "MM/YYYY — MM/YYYY",
      projectOverview: "Mô tả tổng quan dự án",
      responsibilities: "Mô tả công việc đã thực hiện",
      technology: "Công nghệ",
      type: "Loại dự án",
      title: "Dự án mới",
      description: "Mô tả dự án",
      url: "https://example.com"
    }
  : {
      company: "New company",
      role: ".NET Developer",
      period: "MM/YYYY — MM/YYYY",
      projectOverview: "Project overview",
      responsibilities: "Work and responsibilities",
      technology: "Technology",
      type: "Project type",
      title: "New project",
      description: "Project description",
      url: "https://example.com"
    };

let currentContent = {};
let dirty = false;
let toolbar;
let draggedRow = null;
let dragChanged = false;
const boundEditable = new WeakSet();
const boundRow = new WeakSet();
const editorSequence = createSequenceMatcher("031123");

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

function collectContent() {
  const content = Object.fromEntries(editableElements().map((element) => [element.dataset.contentKey, valueFromElement(element)]));
  content["experience.itemCount"] = String(rows("experience").length);
  content["project.itemCount"] = String(rows("project").length);
  return content;
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

function reindexRows(kind) {
  rows(kind).forEach((row, index) => {
    row.querySelectorAll("[data-content-key]").forEach((element) => {
      element.dataset.contentKey = replaceRowIndex(element.dataset.contentKey, kind, index);
    });
    row.querySelectorAll("[data-content-href]").forEach((element) => {
      element.dataset.contentHref = replaceRowIndex(element.dataset.contentHref, kind, index);
    });
    if (kind === "experience") {
      const number = row.querySelector(".experience-index");
      if (number) number.textContent = String(index + 1).padStart(2, "0");
    }
  });
}

function blankRow(row, kind) {
  if (kind === "experience") {
    const technologyItems = [...row.querySelectorAll(".experience-detail li")];
    technologyItems.slice(1).forEach((element) => element.remove());
  }

  row.querySelectorAll("[data-content-key]").forEach((element) => {
    const key = element.dataset.contentKey;
    let value = "";
    if (key.includes(".technologies.")) value = newRowText.technology;
    else value = newRowText[key.split(".").at(-1)] || "";
    element.textContent = textForDisplay(value, element.dataset.contentFormat);
  });
}

function appendRow(kind, blank = true) {
  const container = rowContainer(kind);
  const source = rows(kind).at(-1);
  if (!container || !source || rows(kind).length >= ROW_LIMITS[kind]) return null;
  const row = source.cloneNode(true);
  row.classList.remove("editor-row-dragging");
  if (blank) blankRow(row, kind);
  container.append(row);
  reindexRows(kind);
  bindRowEditor(row);
  return row;
}

function resizeRows(kind, desiredCount) {
  const safeCount = Math.min(ROW_LIMITS[kind], Math.max(1, desiredCount));
  while (rows(kind).length > safeCount) rows(kind).at(-1).remove();
  while (rows(kind).length < safeCount) appendRow(kind, true);
  reindexRows(kind);
}

function restoreContent(content) {
  resizeRows("experience", inferRowCount(content, "experience", rows("experience").length));
  resizeRows("project", inferRowCount(content, "project", rows("project").length));
  if (document.body.classList.contains("editor-active")) bindEditorElements();
  applyContent(content);
  updateRowControls();
}

async function loadContent() {
  let stored = {};
  try {
    const response = await fetch(`/api/content?locale=${locale}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin"
    });
    if (!response.ok) throw new Error("content unavailable");
    stored = normalizeLegacyContent(await response.json());
  } catch {
    stored = {};
  }

  resizeRows("experience", inferRowCount(stored, "experience", rows("experience").length));
  resizeRows("project", inferRowCount(stored, "project", rows("project").length));
  const defaults = collectContent();
  currentContent = { ...defaults, ...stored };
  currentContent["experience.itemCount"] = String(rows("experience").length);
  currentContent["project.itemCount"] = String(rows("project").length);
  applyContent(currentContent);
}

function setDirty(nextDirty) {
  dirty = nextDirty;
  document.body.classList.toggle("editor-dirty", dirty);
  if (!toolbar) return;
  toolbar.querySelector("[data-editor-status]").textContent = dirty ? editorText.unsaved : editorText.saved;
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

function bindEditable(element) {
  if (boundEditable.has(element)) return;
  boundEditable.add(element);
  element.contentEditable = "true";
  element.spellcheck = true;
  element.addEventListener("input", () => setDirty(true));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });
}

function updateRowControls() {
  for (const kind of ["experience", "project"]) {
    const currentRows = rows(kind);
    currentRows.forEach((row, index) => {
      const up = row.querySelector('[data-move-row="up"]');
      const down = row.querySelector('[data-move-row="down"]');
      const remove = row.querySelector("[data-remove-row]");
      if (up) up.disabled = index === 0;
      if (down) down.disabled = index === currentRows.length - 1;
      if (remove) remove.disabled = currentRows.length === 1;
    });
    const add = document.querySelector(`[data-add-row="${kind}"]`);
    if (add) add.disabled = currentRows.length >= ROW_LIMITS[kind];
  }
}

function structureChanged(kind) {
  reindexRows(kind);
  bindEditorElements();
  updateRowControls();
  setDirty(true);
}

function bindRowEditor(row) {
  if (!document.body.classList.contains("editor-active") || boundRow.has(row)) return;
  boundRow.add(row);
  const kind = row.dataset.editorRow;
  const handle = row.querySelector(".editor-drag-handle");

  row.querySelector('[data-move-row="up"]')?.addEventListener("click", () => {
    const previous = row.previousElementSibling;
    if (!previous) return;
    row.parentElement.insertBefore(row, previous);
    structureChanged(kind);
  });
  row.querySelector('[data-move-row="down"]')?.addEventListener("click", () => {
    const next = row.nextElementSibling;
    if (!next) return;
    row.parentElement.insertBefore(next, row);
    structureChanged(kind);
  });
  row.querySelector("[data-remove-row]")?.addEventListener("click", () => {
    if (rows(kind).length === 1) {
      window.alert(editorText.minimumRow);
      return;
    }
    if (!window.confirm(editorText.removeRow)) return;
    row.remove();
    structureChanged(kind);
  });

  handle?.addEventListener("dragstart", (event) => {
    draggedRow = row;
    dragChanged = false;
    row.classList.add("editor-row-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", kind);
  });
  handle?.addEventListener("dragend", () => {
    row.classList.remove("editor-row-dragging");
    if (dragChanged) structureChanged(kind);
    draggedRow = null;
    dragChanged = false;
  });
}

function bindEditorElements() {
  editableElements().forEach(bindEditable);
  document.querySelectorAll("[data-editor-row]").forEach(bindRowEditor);
}

function bindStructureControls() {
  document.querySelectorAll("[data-add-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.addRow;
      const row = appendRow(kind, true);
      if (!row) return;
      structureChanged(kind);
      row.querySelector("[data-editable]")?.focus();
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  for (const kind of ["experience", "project"]) {
    rowContainer(kind)?.addEventListener("dragover", (event) => {
      if (!draggedRow || draggedRow.dataset.editorRow !== kind) return;
      event.preventDefault();
      const target = event.target.closest(`[data-editor-row="${kind}"]`);
      if (!target || target === draggedRow) return;
      const box = target.getBoundingClientRect();
      const after = event.clientY > box.top + box.height / 2;
      const reference = after ? target.nextElementSibling : target;
      if (reference !== draggedRow && draggedRow.nextElementSibling !== reference) {
        rowContainer(kind).insertBefore(draggedRow, reference);
        dragChanged = true;
      }
    });
    rowContainer(kind)?.addEventListener("drop", (event) => event.preventDefault());
  }
}

async function saveContent() {
  if (!dirty) return;
  const saveButton = toolbar.querySelector("[data-editor-save]");
  const status = toolbar.querySelector("[data-editor-status]");
  saveButton.disabled = true;
  status.textContent = editorText.saving;
  const content = collectContent();

  try {
    const response = await fetch(`/api/editor/content?locale=${locale}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error("save rejected");
    const result = await response.json();
    currentContent = normalizeLegacyContent(result.content);
    restoreContent(currentContent);
    setDirty(false);
  } catch {
    status.textContent = editorText.saveFailed;
  } finally {
    saveButton.disabled = false;
  }
}

async function lockEditor() {
  const message = locale === "vi" ? "Bỏ các thay đổi chưa lưu và khóa trình chỉnh sửa?" : "Discard unsaved changes and lock the editor?";
  if (dirty && !window.confirm(message)) return;
  sessionStorage.removeItem(editorSessionFlag);
  location.reload();
}

function switchLanguage() {
  if (dirty && !window.confirm(editorText.discardAndSwitch)) return;
  const languageLink = document.querySelector(".language-link");
  location.assign(languageLink?.href || (locale === "vi" ? "/" : "/vi/"));
}

function enableEditor() {
  if (document.body.classList.contains("editor-active")) return;
  document.body.classList.add("editor-active");
  toolbar = buildToolbar();
  bindEditorElements();
  bindStructureControls();
  updateRowControls();

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-editor-link]")) event.preventDefault();
    if (dirty && event.target.closest("[data-cv-link]")) {
      event.preventDefault();
      window.alert(editorText.saveBeforeCv);
    }
  }, true);

  toolbar.querySelector("[data-editor-save]").addEventListener("click", saveContent);
  toolbar.querySelector("[data-editor-undo]").addEventListener("click", () => {
    restoreContent(currentContent);
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
    if (dirty) event.preventDefault();
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
  if (event.ctrlKey || event.metaKey || event.altKey || isTextEntryTarget(event.target)) {
    editorSequence.reset();
    return;
  }
  if (editorSequence.push(event.key)) activateEditorFromShortcut();
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
