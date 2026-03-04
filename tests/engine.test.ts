import { describe, it, expect } from "vitest";
import {
  romanizeKorean,
  getStrokeCount,
  fiveElementsForStrokes,
  checkElementCompatibility,
  formatPopulation,
  surnameSlug,
  characterSlug,
} from "../src/index.js";

// ---------------------------------------------------------------------------
// romanizeKorean
// ---------------------------------------------------------------------------

describe("romanizeKorean", () => {
  it("romanizes 김민준", () => {
    expect(romanizeKorean("김민준")).toBe("gimminjun");
  });

  it("romanizes 이서연", () => {
    expect(romanizeKorean("이서연")).toBe("iseoyeon");
  });

  it("romanizes 박지훈", () => {
    expect(romanizeKorean("박지훈")).toBe("bakjihun");
  });

  it("romanizes 최유진", () => {
    expect(romanizeKorean("최유진")).toBe("choeyujin");
  });

  it("romanizes 한가을", () => {
    expect(romanizeKorean("한가을")).toBe("hangaeul");
  });

  it("passes through non-Hangul characters", () => {
    expect(romanizeKorean("ABC")).toBe("ABC");
  });

  it("handles mixed Hangul and ASCII", () => {
    expect(romanizeKorean("김 Kim")).toBe("gim Kim");
  });

  it("returns empty string for empty input", () => {
    expect(romanizeKorean("")).toBe("");
  });

  it("handles single syllable", () => {
    expect(romanizeKorean("가")).toBe("ga");
  });

  it("handles syllable with no initial (ㅇ)", () => {
    // ㅇ as initial is silent (empty string in INITIALS[11])
    expect(romanizeKorean("아")).toBe("a");
  });

  it("handles syllable with final consonant", () => {
    expect(romanizeKorean("강")).toBe("gang");
  });

  it("handles syllable without final consonant", () => {
    expect(romanizeKorean("나")).toBe("na");
  });
});

// ---------------------------------------------------------------------------
// getStrokeCount
// ---------------------------------------------------------------------------

describe("getStrokeCount", () => {
  it("returns non-zero for CJK Unified Ideograph", () => {
    // 木 = U+6728 (CJK range)
    expect(getStrokeCount(0x6728)).toBeGreaterThan(0);
  });

  it("returns 0 for non-CJK code point", () => {
    // 'A' = U+0041
    expect(getStrokeCount(0x0041)).toBe(0);
  });

  it("returns 0 for Hangul code point", () => {
    // 가 = U+AC00 (Hangul, not CJK)
    expect(getStrokeCount(0xac00)).toBe(0);
  });

  it("handles boundary: first CJK character U+4E00", () => {
    expect(getStrokeCount(0x4e00)).toBeGreaterThan(0);
  });

  it("handles boundary: last CJK character U+9FFF", () => {
    expect(getStrokeCount(0x9fff)).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// fiveElementsForStrokes
// ---------------------------------------------------------------------------

describe("fiveElementsForStrokes", () => {
  it("1 stroke -> Wood (木)", () => {
    expect(fiveElementsForStrokes(1)).toBe("木");
  });

  it("2 strokes -> Wood (木)", () => {
    expect(fiveElementsForStrokes(2)).toBe("木");
  });

  it("3 strokes -> Fire (火)", () => {
    expect(fiveElementsForStrokes(3)).toBe("火");
  });

  it("4 strokes -> Fire (火)", () => {
    expect(fiveElementsForStrokes(4)).toBe("火");
  });

  it("5 strokes -> Earth (土)", () => {
    expect(fiveElementsForStrokes(5)).toBe("土");
  });

  it("6 strokes -> Earth (土)", () => {
    expect(fiveElementsForStrokes(6)).toBe("土");
  });

  it("7 strokes -> Metal (金)", () => {
    expect(fiveElementsForStrokes(7)).toBe("金");
  });

  it("8 strokes -> Metal (金)", () => {
    expect(fiveElementsForStrokes(8)).toBe("金");
  });

  it("9 strokes -> Water (水)", () => {
    expect(fiveElementsForStrokes(9)).toBe("水");
  });

  it("10 strokes (remainder 0) -> Water (水)", () => {
    expect(fiveElementsForStrokes(10)).toBe("水");
  });

  it("11 strokes -> Wood (木)", () => {
    expect(fiveElementsForStrokes(11)).toBe("木");
  });

  it("20 strokes -> Water (水)", () => {
    expect(fiveElementsForStrokes(20)).toBe("水");
  });
});

// ---------------------------------------------------------------------------
// checkElementCompatibility
// ---------------------------------------------------------------------------

describe("checkElementCompatibility", () => {
  it("same element is neutral and compatible", () => {
    const result = checkElementCompatibility("木", "木");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("neutral");
  });

  it("Wood -> Fire is generating (compatible)", () => {
    const result = checkElementCompatibility("木", "火");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("generating");
  });

  it("Fire -> Earth is generating (compatible)", () => {
    const result = checkElementCompatibility("火", "土");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("generating");
  });

  it("Earth -> Metal is generating (compatible)", () => {
    const result = checkElementCompatibility("土", "金");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("generating");
  });

  it("Metal -> Water is generating (compatible)", () => {
    const result = checkElementCompatibility("金", "水");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("generating");
  });

  it("Water -> Wood is generating (compatible)", () => {
    const result = checkElementCompatibility("水", "木");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("generating");
  });

  it("reverse generating: Fire -> Wood is also generating", () => {
    const result = checkElementCompatibility("火", "木");
    expect(result.compatible).toBe(true);
    expect(result.relationship).toBe("generating");
  });

  it("Wood -> Earth is overcoming (incompatible)", () => {
    const result = checkElementCompatibility("木", "土");
    expect(result.compatible).toBe(false);
    expect(result.relationship).toBe("overcoming");
  });

  it("Earth -> Water is overcoming (incompatible)", () => {
    const result = checkElementCompatibility("土", "水");
    expect(result.compatible).toBe(false);
    expect(result.relationship).toBe("overcoming");
  });

  it("Water -> Fire is overcoming (incompatible)", () => {
    const result = checkElementCompatibility("水", "火");
    expect(result.compatible).toBe(false);
    expect(result.relationship).toBe("overcoming");
  });

  it("Fire -> Metal is overcoming (incompatible)", () => {
    const result = checkElementCompatibility("火", "金");
    expect(result.compatible).toBe(false);
    expect(result.relationship).toBe("overcoming");
  });

  it("Metal -> Wood is overcoming (incompatible)", () => {
    const result = checkElementCompatibility("金", "木");
    expect(result.compatible).toBe(false);
    expect(result.relationship).toBe("overcoming");
  });

  it("returns element1 and element2 in result", () => {
    const result = checkElementCompatibility("木", "火");
    expect(result.element1).toBe("木");
    expect(result.element2).toBe("火");
  });
});

// ---------------------------------------------------------------------------
// formatPopulation
// ---------------------------------------------------------------------------

describe("formatPopulation", () => {
  it("formats millions", () => {
    expect(formatPopulation(10_304_000)).toBe("10.3M");
  });

  it("formats exactly 1 million", () => {
    expect(formatPopulation(1_000_000)).toBe("1.0M");
  });

  it("formats thousands", () => {
    expect(formatPopulation(850_000)).toBe("850K");
  });

  it("formats exactly 1 thousand", () => {
    expect(formatPopulation(1_000)).toBe("1K");
  });

  it("formats small numbers without suffix", () => {
    expect(formatPopulation(500)).toBe("500");
  });

  it("formats zero", () => {
    expect(formatPopulation(0)).toBe("0");
  });

  it("formats large millions", () => {
    expect(formatPopulation(50_000_000)).toBe("50.0M");
  });
});

// ---------------------------------------------------------------------------
// surnameSlug
// ---------------------------------------------------------------------------

describe("surnameSlug", () => {
  it("generates slug for simple surname", () => {
    expect(surnameSlug("Kim", "korean")).toBe("kim-korean");
  });

  it("lowercases the romanized name", () => {
    expect(surnameSlug("PARK", "korean")).toBe("park-korean");
  });

  it("replaces spaces with hyphens", () => {
    expect(surnameSlug("Nam Goong", "korean")).toBe("nam-goong-korean");
  });
});

// ---------------------------------------------------------------------------
// characterSlug
// ---------------------------------------------------------------------------

describe("characterSlug", () => {
  it("generates slug for character", () => {
    expect(characterSlug("geum", "gold")).toBe("geum-gold");
  });

  it("lowercases both parts", () => {
    expect(characterSlug("GEUM", "GOLD")).toBe("geum-gold");
  });

  it("replaces spaces with hyphens", () => {
    expect(characterSlug("min jun", "bright talented")).toBe("min-jun-bright-talented");
  });
});
