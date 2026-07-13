import assert from "node:assert/strict";
import test from "node:test";

import { createSequenceMatcher, isTextEntryTarget } from "../public/editor-sequence.js";

test("editor sequence matches only the complete 031123 sequence", () => {
  let time = 1000;
  const matcher = createSequenceMatcher("031123", 4000, () => time);
  const results = [..."031123"].map((key) => {
    time += 200;
    return matcher.push(key);
  });

  assert.deepEqual(results, [false, false, false, false, false, true]);
  assert.equal(matcher.push("3"), false);
});

test("wrong keys and timeouts reset the editor sequence", () => {
  let time = 1000;
  const matcher = createSequenceMatcher("031123", 4000, () => time);

  assert.equal(matcher.push("0"), false);
  assert.equal(matcher.push("3"), false);
  assert.equal(matcher.push("9"), false);
  for (const key of "1123") assert.equal(matcher.push(key), false);

  matcher.reset();
  assert.equal(matcher.push("0"), false);
  assert.equal(matcher.push("3"), false);
  time += 4001;
  for (const key of "1123") assert.equal(matcher.push(key), false);
});

test("text-entry targets are excluded from hidden sequence detection", () => {
  assert.equal(isTextEntryTarget({ closest: () => ({ tagName: "INPUT" }) }), true);
  assert.equal(isTextEntryTarget({ closest: () => null }), false);
  assert.equal(isTextEntryTarget(null), false);
});

