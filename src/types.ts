/**
 * TypeScript interfaces for the namefyi name engine.
 *
 * All functions are stateless and deterministic (<1ms).
 */

/**
 * Result of a Five Elements compatibility check between two characters.
 */
export interface ElementCompatibility {
  element1: string;
  element2: string;
  compatible: boolean;
  relationship: "generating" | "overcoming" | "neutral";
}
