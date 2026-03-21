# namefyi

[![npm version](https://agentgif.com/badge/npm/namefyi/version.svg)](https://www.npmjs.com/package/namefyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/namefyi)

Pure TypeScript name engine for developers. [Romanize Korean text](https://namefyi.com/) (Revised Romanization), analyse CJK [stroke counts](https://namefyi.com/), determine [Five Elements compatibility](https://namefyi.com/), format population numbers, and generate URL slugs for surnames and characters -- all with zero dependencies.

> **Try the interactive tools at [namefyi.com](https://namefyi.com/)** -- name search, surname explorer, and Five Elements compatibility checker.

<p align="center">
  <img src="demo.gif" alt="namefyi demo — Korean romanization and Five Elements analysis" width="800">
</p>

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Korean Romanization](#korean-romanization)
  - [Korean Hangul Decomposition](#korean-hangul-decomposition)
  - [Five Elements (Ohaeng)](#five-elements-ohaeng)
  - [CJK Stroke Counting](#cjk-stroke-counting)
  - [URL Slug Generation](#url-slug-generation)
- [API Reference](#api-reference)
- [TypeScript Types](#typescript-types)
- [Features](#features)
- [Learn More About Names](#learn-more-about-names)
- [Also Available for Python](#also-available-for-python)
- [Utility FYI Family](#utility-fyi-family)
- [License](#license)

## Install

```bash
npm install namefyi
```

Works in Node.js, Deno, Bun, and browsers (ESM).

## Quick Start

```typescript
import {
  romanizeKorean,
  fiveElementsForStrokes,
  checkElementCompatibility,
  formatPopulation,
} from "namefyi";

// Romanize Korean text (Revised Romanization)
console.log(romanizeKorean("김민준"));   // "gimminjun"
console.log(romanizeKorean("이서연"));   // "iseoyeon"
console.log(romanizeKorean("박지훈"));   // "bakjihun"

// Five Elements from stroke count
console.log(fiveElementsForStrokes(8));   // "金" (Metal)
console.log(fiveElementsForStrokes(3));   // "火" (Fire)
console.log(fiveElementsForStrokes(5));   // "土" (Earth)

// Check element compatibility (상생/상극)
const compat = checkElementCompatibility("木", "火");
console.log(compat.compatible);      // true
console.log(compat.relationship);    // "generating"

// Format population numbers
console.log(formatPopulation(10_304_000));  // "10.3M"
console.log(formatPopulation(850_000));     // "850K"
```

## What You Can Do

### Korean Romanization

The [Revised Romanization of Korean](https://en.wikipedia.org/wiki/Revised_Romanization_of_Korean) (RR) is the official romanization system adopted by South Korea in 2000. It replaced the McCune-Reischauer system and is used for road signs, passports, and international communication.

Korean names follow a distinctive pattern: a one-syllable surname (e.g., Kim, Lee, Park) followed by a two-syllable given name. South Korea has approximately **5,600 unique surnames** used by over 50 million people, with the top 5 (Kim, Lee, Park, Choi, Jung) covering over 50% of the population.

| Surname (Hangul) | Romanization | Population | Percentage |
|-----------------|-------------|-----------|-----------|
| Kim | gim | ~10.6M | 21.5% |
| Lee | i | ~7.3M | 14.7% |
| Park | bak | ~4.2M | 8.4% |
| Choi | choe | ~2.3M | 4.7% |
| Jung/Chung | jeong | ~2.4M | 4.8% |

```typescript
import { romanizeKorean } from "namefyi";

// Revised Romanization -- syllable-by-syllable decomposition
console.log(romanizeKorean("김민준"));   // "gimminjun"
console.log(romanizeKorean("이서연"));   // "iseoyeon"
console.log(romanizeKorean("박지훈"));   // "bakjihun"
console.log(romanizeKorean("한국어"));   // "hangugeo"
```

Learn more: [Revised Romanization](https://en.wikipedia.org/wiki/Revised_Romanization_of_Korean)

### Korean Hangul Decomposition

Hangul syllables (가-힣) are algorithmically decomposable into initial consonant + medial vowel + optional final consonant using Unicode arithmetic: `(code - 0xAC00) / 588` gives the initial, `% 588 / 28` the medial, `% 28` the final.

The Unicode block U+AC00-U+D7A3 contains 11,172 pre-composed Hangul syllables. Each is a combination of:

- **19 initial consonants** (ChoSeong): g, kk, n, d, tt, r, m, b, pp, s, ss, (none), j, jj, ch, k, t, p, h
- **21 medial vowels** (JungSeong): a, ae, ya, yae, eo, e, yeo, ye, o, wa, wae, oe, yo, u, wo, we, wi, yu, eu, ui, i
- **28 final consonants** (JongSeong): (none), k, k, k, n, n, n, t, l, l, l, l, l, l, l, l, m, p, p, t, t, ng, t, t, k, t, p, t

The formula `19 * 21 * 28 = 11,172` perfectly accounts for every possible syllable. This implementation uses syllable-by-syllable decomposition following the Revised Romanization of Korean standard.

Learn more: [Hangul Jamo (Unicode)](https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)) · [Korean Writing System](https://en.wikipedia.org/wiki/Hangul)

### Five Elements (Ohaeng)

The [Five Elements](https://en.wikipedia.org/wiki/Wu_Xing) (Ohaeng) is a fundamental concept in East Asian philosophy used in traditional Korean naming. Each element has a generative (SangSaeng) and destructive (SangGeuk) relationship with others, forming two cycles that guide name compatibility analysis.

```typescript
import { fiveElementsForStrokes, checkElementCompatibility } from "namefyi";

// Stroke count to Five Elements mapping:
// 1,2 -> 木 (Wood)  |  3,4 -> 火 (Fire)  |  5,6 -> 土 (Earth)
// 7,8 -> 金 (Metal)  |  9,0 -> 水 (Water)

// SangSaeng (상생 / generating cycle): compatible
checkElementCompatibility("木", "火");   // generating (Wood feeds Fire)
checkElementCompatibility("火", "土");   // generating (Fire creates Earth)
checkElementCompatibility("土", "金");   // generating (Earth bears Metal)
checkElementCompatibility("金", "水");   // generating (Metal collects Water)
checkElementCompatibility("水", "木");   // generating (Water nourishes Wood)

// SangGeuk (상극 / overcoming cycle): incompatible
checkElementCompatibility("木", "土");   // overcoming (Wood parts Earth)
checkElementCompatibility("火", "金");   // overcoming (Fire melts Metal)
```

Learn more: [Five Elements Guide](https://namefyi.com/) · [Wu Xing (Wikipedia)](https://en.wikipedia.org/wiki/Wu_Xing)

### CJK Stroke Counting

CJK (Chinese-Japanese-Korean) characters are built from a fixed number of brush strokes. The stroke count determines which of the Five Elements a character belongs to, using the last digit: 1-2 = Wood, 3-4 = Fire, 5-6 = Earth, 7-8 = Metal, 9-0 = Water. The bundled stroke data covers the CJK Unified Ideographs block (U+4E00-U+9FFF).

```typescript
import { getStrokeCount, fiveElementsForStrokes } from "namefyi";

// Get stroke count for a CJK character (by Unicode codepoint)
const strokes = getStrokeCount(0x91D1);  // Gold character
console.log(strokes);                     // 8
console.log(fiveElementsForStrokes(strokes));  // "Metal"
```

Learn more: [CJK Stroke Count](https://en.wikipedia.org/wiki/Stroke_(CJK_character)) · [REST API Docs](https://namefyi.com/developers/)

### URL Slug Generation

```typescript
import { surnameSlug, characterSlug } from "namefyi";

// Surname slugs for URL routing
console.log(surnameSlug("Kim", "korean"));       // "kim-korean"
console.log(surnameSlug("Park", "korean"));      // "park-korean"

// Character slugs for name characters
console.log(characterSlug("geum", "gold"));      // "geum-gold"
console.log(characterSlug("min", "people"));     // "min-people"
```

Learn more: [OpenAPI Spec](https://namefyi.com/api/openapi.json)

## API Reference

### Romanization

| Function | Description |
|----------|-------------|
| `romanizeKorean(hangul) -> string` | Revised Romanization of Korean text |

### Stroke Count & Five Elements

| Function | Description |
|----------|-------------|
| `getStrokeCount(codepoint) -> number` | Stroke count for a CJK character (Unicode code point) |
| `fiveElementsForStrokes(strokes) -> string` | Five Elements symbol from stroke count (Wood/Fire/Earth/Metal/Water) |
| `checkElementCompatibility(el1, el2) -> ElementCompatibility` | Check compatibility (generating, overcoming, or neutral) |

### Formatting & Slugs

| Function | Description |
|----------|-------------|
| `formatPopulation(count) -> string` | Format population with M/K suffix (e.g., "10.3M") |
| `surnameSlug(romanized, cultureSlug) -> string` | URL slug for a surname (e.g., "kim-korean") |
| `characterSlug(romanized, meaningKeyword) -> string` | URL slug for a name character (e.g., "geum-gold") |

## TypeScript Types

```typescript
import type { ElementCompatibility } from "namefyi";
```

## Features

- **Korean romanization**: Syllable-by-syllable Revised Romanization (19 initials, 21 medials, 28 finals)
- **Five Elements analysis**: Stroke count to Wood/Fire/Earth/Metal/Water mapping
- **Compatibility check**: SangSaeng (generating) and SangGeuk (overcoming) cycle detection
- **Population formatting**: Human-readable numbers with M/K suffixes
- **URL slug generation**: SEO-friendly slugs for surnames and characters
- **CJK stroke counting**: Unicode code point range detection (U+4E00-U+9FFF)
- **Zero dependencies**: Pure TypeScript, no runtime deps
- **Type-safe**: Full TypeScript with strict mode
- **Tree-shakeable**: ESM with named exports
- **Fast**: All computations under 1ms

## Learn More About Names

- **Browse**: - **API**: [REST API Docs](https://namefyi.com/developers/) · [OpenAPI Spec](https://namefyi.com/api/openapi.json)
- **Python**: [PyPI Package](https://pypi.org/project/namefyi/)

## Also Available for Python

```bash
pip install namefyi
```

See the [Python package on PyPI](https://pypi.org/project/namefyi/).

## Utility FYI Family

Part of the [FYIPedia](https://fyipedia.com) open-source developer tools ecosystem — everyday developer reference and conversion tools.

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| unitfyi | [PyPI](https://pypi.org/project/unitfyi/) | [npm](https://www.npmjs.com/package/unitfyi) | Unit conversion, 220 units -- [unitfyi.com](https://unitfyi.com/) |
| timefyi | [PyPI](https://pypi.org/project/timefyi/) | [npm](https://www.npmjs.com/package/timefyi) | Timezone ops & business hours -- [timefyi.com](https://timefyi.com/) |
| holidayfyi | [PyPI](https://pypi.org/project/holidayfyi/) | [npm](https://www.npmjs.com/package/holidayfyi) | Holiday dates & Easter calculation -- [holidayfyi.com](https://holidayfyi.com/) |
| **namefyi** | [PyPI](https://pypi.org/project/namefyi/) | [npm](https://www.npmjs.com/package/namefyi) | Korean romanization & Five Elements -- [namefyi.com](https://namefyi.com/) |
| distancefyi | [PyPI](https://pypi.org/project/distancefyi/) | [npm](https://www.npmjs.com/package/distancefyi) | Haversine distance & travel times -- [distancefyi.com](https://distancefyi.com/) |

## License

MIT
