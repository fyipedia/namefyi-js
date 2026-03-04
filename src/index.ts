/**
 * namefyi -- Pure TypeScript name engine for Korean names.
 *
 * Romanize Korean text (Revised Romanization), analyse CJK stroke counts,
 * determine Five Elements compatibility, format population numbers, and
 * generate URL slugs for surnames and characters.
 *
 * Zero dependencies. Works in Node.js, Deno, Bun, and browsers.
 *
 * @example
 * ```ts
 * import { romanizeKorean, checkElementCompatibility, formatPopulation } from "namefyi";
 *
 * romanizeKorean("김민준");           // => "gimminjun"
 * checkElementCompatibility("木", "火"); // => { compatible: true, relationship: "generating", ... }
 * formatPopulation(10_304_000);       // => "10.3M"
 * ```
 *
 * @packageDocumentation
 */

// Types
export type { ElementCompatibility } from "./types.js";

// Engine -- name computations
export {
  romanizeKorean,
  getStrokeCount,
  fiveElementsForStrokes,
  checkElementCompatibility,
  formatPopulation,
  surnameSlug,
  characterSlug,
} from "./engine.js";
