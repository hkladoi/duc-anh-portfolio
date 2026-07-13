export function createSequenceMatcher(sequence, timeoutMs = 4000, now = () => Date.now()) {
  if (!/^\d+$/.test(sequence)) throw new Error("Editor sequence must contain digits only");

  let buffer = "";
  let lastInputAt = 0;

  return {
    push(key) {
      const inputAt = now();
      if (lastInputAt && inputAt - lastInputAt > timeoutMs) buffer = "";
      lastInputAt = inputAt;

      if (!/^\d$/.test(key)) {
        buffer = "";
        return false;
      }

      const candidate = buffer + key;
      buffer = sequence.startsWith(candidate) ? candidate : (key === sequence[0] ? key : "");

      if (buffer !== sequence) return false;
      buffer = "";
      lastInputAt = 0;
      return true;
    },
    reset() {
      buffer = "";
      lastInputAt = 0;
    }
  };
}

export function isTextEntryTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

