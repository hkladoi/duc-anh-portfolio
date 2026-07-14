import assert from "node:assert/strict";
import test from "node:test";

import { inferRowCount, normalizeLegacyContent, replaceRowIndex } from "../public/editor-rows.js";

test("legacy project fields migrate to the first project row", () => {
  const normalized = normalizeLegacyContent({
    "project.title": "Legacy project",
    "project.url": "https://example.com",
    "project.items.0.title": "Current project"
  });

  assert.equal(normalized["project.items.0.title"], "Current project");
  assert.equal(normalized["project.items.0.url"], "https://example.com");
  assert.equal("project.title" in normalized, false);
});

test("row counts are explicit or inferred from dynamic keys", () => {
  assert.equal(inferRowCount({ "experience.itemCount": "2" }, "experience", 3), 2);
  assert.equal(inferRowCount({ "project.items.3.title": "Fourth" }, "project", 1), 4);
  assert.equal(inferRowCount({ "project.itemCount": "99" }, "project", 1), 10);
});

test("row keys are reindexed after reordering", () => {
  assert.equal(replaceRowIndex("experience.items.2.company", "experience", 0), "experience.items.0.company");
  assert.equal(replaceRowIndex("project.items.0.url", "project", 3), "project.items.3.url");
});
