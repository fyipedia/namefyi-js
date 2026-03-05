import { romanizeKorean, fiveElementsForStrokes, checkElementCompatibility } from './dist/index.js'

const C = { r: '\x1b[0m', b: '\x1b[1m', d: '\x1b[2m', y: '\x1b[33m', g: '\x1b[32m', c: '\x1b[36m' }

// 1. Korean romanization
console.log(`${C.b}${C.y}Korean Romanization${C.r}`)
for (const name of ['\uAE40\uBBFC\uC218', '\uD64D\uAE38\uB3D9', '\uC774\uC815\uC740']) {
  console.log(`  ${C.c}${name}${C.r} → ${C.g}${romanizeKorean(name)}${C.r}`)
}

console.log()

// 2. Five Elements (Ohaeng)
console.log(`${C.b}${C.y}Five Elements by Stroke Count${C.r}`)
for (const s of [3, 5, 8, 10, 12]) {
  console.log(`  ${C.c}${String(s).padStart(2)} strokes${C.r} → ${C.g}${fiveElementsForStrokes(s)}${C.r}`)
}

console.log()

// 3. Compatibility
console.log(`${C.b}${C.y}Element Compatibility${C.r}`)
for (const [a, b] of [['wood', 'water'], ['fire', 'metal'], ['earth', 'wood']]) {
  const r = checkElementCompatibility(a, b)
  const icon = r.compatible ? `${C.g}✓` : `\x1b[31m✗`
  console.log(`  ${C.c}${a}${C.r} + ${C.c}${b}${C.r} ${icon} ${r.relationship}${C.r}`)
}
