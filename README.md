# namefyi

[![npm](https://img.shields.io/npm/v/namefyi)](https://www.npmjs.com/package/namefyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/namefyi)

Pure TypeScript name engine for developers. [Romanize Korean text](https://namefyi.com/) (Revised Romanization), analyse CJK [stroke counts](https://namefyi.com/), determine [Five Elements compatibility](https://namefyi.com/), format population numbers, and generate URL slugs for surnames and characters -- all with zero dependencies.

> **Try the interactive tools at [namefyi.com](https://namefyi.com/)** -- name search, surname explorer, and Five Elements compatibility checker.

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

## Korean Hangul Decomposition

Hangul syllables (가-힣) are algorithmically decomposable into initial consonant + medial vowel + optional final consonant using Unicode arithmetic: `(code - 0xAC00) / 588` gives the initial, `% 588 / 28` the medial, `% 28` the final.

The Unicode block U+AC00-U+D7A3 contains 11,172 pre-composed Hangul syllables. Each is a combination of:

- **19 initial consonants** (ChoSeong): g, kk, n, d, tt, r, m, b, pp, s, ss, (none), j, jj, ch, k, t, p, h
- **21 medial vowels** (JungSeong): a, ae, ya, yae, eo, e, yeo, ye, o, wa, wae, oe, yo, u, wo, we, wi, yu, eu, ui, i
- **28 final consonants** (JongSeong): (none), k, k, k, n, n, n, t, l, l, l, l, l, l, l, l, m, p, p, t, t, ng, t, t, k, t, p, t

The formula `19 * 21 * 28 = 11,172` perfectly accounts for every possible syllable. This implementation uses syllable-by-syllable decomposition following the Revised Romanization of Korean standard.

## Five Elements (Ohaeng)

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

## URL Slug Generation

```typescript
import { surnameSlug, characterSlug } from "namefyi";

// Surname slugs for URL routing
console.log(surnameSlug("Kim", "korean"));       // "kim-korean"
console.log(surnameSlug("Park", "korean"));      // "park-korean"

// Character slugs for name characters
console.log(characterSlug("geum", "gold"));      // "geum-gold"
console.log(characterSlug("min", "people"));     // "min-people"
```

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

## Also Available for Python

```bash
pip install namefyi
```

See the [Python package on PyPI](https://pypi.org/project/namefyi/).

## FYIPedia Developer Tools

Part of the [FYIPedia](https://github.com/fyipedia) open-source developer tools ecosystem:

| Package | Description |
|---------|-------------|
| [colorfyi](https://www.npmjs.com/package/colorfyi) | Color conversion, WCAG contrast, harmonies -- [colorfyi.com](https://colorfyi.com/) |
| [emojifyi](https://www.npmjs.com/package/emojifyi) | Emoji lookup, search, encoding -- [emojifyi.com](https://emojifyi.com/) |
| [symbolfyi](https://www.npmjs.com/package/symbolfyi) | Symbol encoding, Unicode properties -- [symbolfyi.com](https://symbolfyi.com/) |
| [unicodefyi](https://www.npmjs.com/package/unicodefyi) | Unicode character info, encodings -- [unicodefyi.com](https://unicodefyi.com/) |
| [fontfyi](https://www.npmjs.com/package/fontfyi) | Google Fonts metadata, CSS -- [fontfyi.com](https://fontfyi.com/) |
| [distancefyi](https://www.npmjs.com/package/distancefyi) | Distance, bearing, travel times -- [distancefyi.com](https://distancefyi.com/) |
| [timefyi](https://www.npmjs.com/package/timefyi) | Timezone ops, time differences -- [timefyi.com](https://timefyi.com/) |
| **[namefyi](https://www.npmjs.com/package/namefyi)** | **Korean romanization, Five Elements -- [namefyi.com](https://namefyi.com/)** |
| [unitfyi](https://www.npmjs.com/package/unitfyi) | Unit conversion, 200 units -- [unitfyi.com](https://unitfyi.com/) |
| [holidayfyi](https://www.npmjs.com/package/holidayfyi) | Holiday dates, Easter calculation -- [holidayfyi.com](https://holidayfyi.com/) |

## Links

- [Interactive Name Explorer](https://namefyi.com/) -- Search Korean names, surnames, and characters
- [Python Package](https://pypi.org/project/namefyi/) -- Same engine, Python version
- [Source Code](https://github.com/fyipedia/namefyi-js) -- MIT licensed

## License

MIT
