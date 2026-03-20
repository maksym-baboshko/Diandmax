const RESPONSE_WORD_PATTERN = /\p{L}[\p{L}\p{N}'’-]*/gu;
const RESPONSE_LETTER_PATTERN = /\p{L}/gu;
const MIN_RESPONSE_LETTER_COUNT = 2;

export function normalizeGameResponseText(value?: string | null) {
  const normalized = value?.trim().replace(/\s+/g, " ") ?? "";
  return normalized.length > 0 ? normalized : null;
}

export function hasMeaningfulGameResponseText(value?: string | null) {
  const normalized = normalizeGameResponseText(value);

  if (!normalized) {
    return false;
  }

  const words = normalized.match(RESPONSE_WORD_PATTERN) ?? [];
  const letters = normalized.match(RESPONSE_LETTER_PATTERN) ?? [];

  return words.length >= 1 && letters.length >= MIN_RESPONSE_LETTER_COUNT;
}
