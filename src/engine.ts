/**
 * NameEngine -- stateless pure functions for name computations.
 *
 * Ported from the Python namefyi package (engine.py).
 * No side effects; all inputs are plain TypeScript types.
 * All functions are deterministic and fast (<1ms).
 */

import type { ElementCompatibility } from "./types.js";

// ---------------------------------------------------------------------------
// Hangul Unicode decomposition constants
// ---------------------------------------------------------------------------

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;

/** Revised Romanization initials (ChoSeong), indexed 0-18. */
const INITIALS = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp",
  "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];

/** Revised Romanization medials (JungSeong), indexed 0-20. */
const MEDIALS = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye",
  "o", "wa", "wae", "oe", "yo", "u", "wo", "we",
  "wi", "yu", "eu", "ui", "i",
];

/** Revised Romanization finals (JongSeong), indexed 0-27. Empty string = no final. */
const FINALS = [
  "", "k", "k", "k", "n", "n", "n", "t",
  "l", "l", "l", "l", "l", "l", "l", "l",
  "m", "p", "p", "t", "t", "ng", "t", "t",
  "k", "t", "p", "t",
];

// ---------------------------------------------------------------------------
// Five Elements data
// ---------------------------------------------------------------------------

/** Maps stroke count last digit to Five Elements symbol. */
const STROKE_TO_ELEMENT: Record<number, string> = {
  1: "\u6728", // 木 Wood
  2: "\u6728",
  3: "\u706B", // 火 Fire
  4: "\u706B",
  5: "\u571F", // 土 Earth
  6: "\u571F",
  7: "\u91D1", // 金 Metal
  8: "\u91D1",
  9: "\u6C34", // 水 Water
  0: "\u6C34",
};

/**
 * Compatible pairs (SangSaeng / 상생).
 * 木->火, 火->土, 土->金, 金->水, 水->木 (and reverse).
 */
const COMPATIBLE = new Set([
  "\u6728\u706B", "\u706B\u571F", "\u571F\u91D1", "\u91D1\u6C34", "\u6C34\u6728",
  "\u706B\u6728", "\u571F\u706B", "\u91D1\u571F", "\u6C34\u91D1", "\u6728\u6C34",
]);

/**
 * Incompatible pairs (SangGeuk / 상극).
 * 木->土, 土->水, 水->火, 火->金, 金->木 (and reverse).
 */
const INCOMPATIBLE = new Set([
  "\u6728\u571F", "\u571F\u6C34", "\u6C34\u706B", "\u706B\u91D1", "\u91D1\u6728",
  "\u571F\u6728", "\u6C34\u571F", "\u706B\u6C34", "\u91D1\u706B", "\u6728\u91D1",
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Basic Korean romanization (Revised Romanization).
 *
 * Handles simple syllable-by-syllable decomposition.
 * For complex cases (assimilation, liaison), use a dedicated library.
 *
 * @param hangul - Korean text string to romanize.
 * @returns Romanized string in lowercase ASCII.
 *
 * @example
 * ```ts
 * romanizeKorean("김민준") // => "gimminjun"
 * romanizeKorean("이서연") // => "iseoyeon"
 * ```
 */
export function romanizeKorean(hangul: string): string {
  const parts: string[] = [];

  for (const char of hangul) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= HANGUL_START && code <= HANGUL_END) {
      const offset = code - HANGUL_START;
      const initial = Math.floor(offset / (MEDIAL_COUNT * FINAL_COUNT));
      const medial = Math.floor((offset % (MEDIAL_COUNT * FINAL_COUNT)) / FINAL_COUNT);
      const final = offset % FINAL_COUNT;
      parts.push(INITIALS[initial] + MEDIALS[medial] + FINALS[final]);
    } else {
      parts.push(char);
    }
  }

  return parts.join("");
}

/**
 * Get the stroke count for a CJK character.
 *
 * Uses Unicode code point range to identify CJK Unified Ideographs (U+4E00-U+9FFF).
 * Returns a placeholder value (1) for recognized CJK characters.
 * Real stroke data comes from the Unihan database.
 *
 * @param codepoint - Unicode code point of the character.
 * @returns Stroke count (0 if not a recognized CJK character).
 */
export function getStrokeCount(codepoint: number): number {
  // CJK Unified Ideographs: U+4E00 - U+9FFF
  if (codepoint >= 0x4e00 && codepoint <= 0x9fff) {
    return 1; // Placeholder -- real stroke data comes from Unihan
  }
  return 0;
}

/**
 * Determine the Five Elements category from stroke count.
 *
 * Traditional Korean naming uses this mapping:
 * - 1, 2 strokes -> Wood (木)
 * - 3, 4 strokes -> Fire (火)
 * - 5, 6 strokes -> Earth (土)
 * - 7, 8 strokes -> Metal (金)
 * - 9, 0 strokes -> Water (水)
 *
 * @param strokes - Number of strokes in the character.
 * @returns Five Elements symbol (木/火/土/金/水) or empty string.
 */
export function fiveElementsForStrokes(strokes: number): string {
  const remainder = strokes % 10;
  return STROKE_TO_ELEMENT[remainder] ?? "";
}

/**
 * Check Five Elements compatibility between two elements.
 *
 * Compatible pairs (상생 / generating):
 * 木->火, 火->土, 土->金, 金->水, 水->木
 *
 * Incompatible pairs (상극 / overcoming):
 * 木->土, 土->水, 水->火, 火->金, 金->木
 *
 * @param element1 - First Five Elements symbol (木/火/土/金/水).
 * @param element2 - Second Five Elements symbol (木/火/土/金/水).
 * @returns Compatibility result with relationship type.
 */
export function checkElementCompatibility(
  element1: string,
  element2: string,
): ElementCompatibility {
  if (element1 === element2) {
    return { element1, element2, compatible: true, relationship: "neutral" };
  }

  const key = element1 + element2;

  if (COMPATIBLE.has(key)) {
    return { element1, element2, compatible: true, relationship: "generating" };
  }

  if (INCOMPATIBLE.has(key)) {
    return { element1, element2, compatible: false, relationship: "overcoming" };
  }

  return { element1, element2, compatible: true, relationship: "neutral" };
}

/**
 * Format population number with appropriate suffix.
 *
 * @param count - Raw population number.
 * @returns Formatted string with M/K suffix.
 *
 * @example
 * ```ts
 * formatPopulation(10_304_000) // => "10.3M"
 * formatPopulation(850_000)    // => "850K"
 * formatPopulation(500)        // => "500"
 * ```
 */
export function formatPopulation(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${Math.round(count / 1_000)}K`;
  }
  return String(count);
}

/**
 * Generate a URL-safe slug for a surname.
 *
 * @param romanized - Romanized surname (e.g., "Kim").
 * @param cultureSlug - Culture identifier (e.g., "korean").
 * @returns URL slug (e.g., "kim-korean").
 */
export function surnameSlug(romanized: string, cultureSlug: string): string {
  return `${romanized.toLowerCase().replace(/ /g, "-")}-${cultureSlug}`;
}

/**
 * Generate a URL-safe slug for a name character.
 *
 * @param romanized - Romanized reading (e.g., "geum").
 * @param meaningKeyword - English meaning (e.g., "gold").
 * @returns URL slug (e.g., "geum-gold").
 */
export function characterSlug(romanized: string, meaningKeyword: string): string {
  return `${romanized.toLowerCase().replace(/ /g, "-")}-${meaningKeyword.toLowerCase().replace(/ /g, "-")}`;
}
