/**
 * Check mínimo de la superficie: node src/lib/rose.test.mjs
 * Falla si la malla degenera (NaN, extensión fuera de escala unidad) o si los
 * pétalos dejan de estar desfasados (el bug que convertía la rosa en un cilindro).
 */
import assert from "node:assert/strict"

const PI = Math.PI, TAU = 2 * PI
const A = 1.9565284531299512, B = 1.2768869870150188
const mod2 = (a, b) => { const c = a % b; return c > 0 ? c : c + b }
const rosePoint = (u, t) => {
  const phi = (PI / 2) * Math.exp(-t / (8 * PI))
  const y = A * u * u * (B * u - 1) ** 2 * Math.sin(phi)
  const s = 1.25 * (1 - mod2(3.6 * t, TAU) / PI) ** 2 - 0.25
  const X = 1 - 0.5 * s * s
  const r = X * (u * Math.sin(phi) + y * Math.cos(phi))
  return [r * Math.sin(t), X * (u * Math.cos(phi) - y * Math.sin(phi)), r * Math.cos(t)]
}

const T_MIN = -(20 / 9) * PI, T_MAX = 15 * PI
let min = [1e9, 1e9, 1e9], max = [-1e9, -1e9, -1e9]
for (let i = 0; i <= 24; i++)
  for (let j = 0; j <= 575; j++) {
    const p = rosePoint(i / 24, T_MIN + ((T_MAX - T_MIN) * j) / 575)
    p.forEach((c, k) => {
      assert.ok(Number.isFinite(c), `coordenada no finita en u=${i / 24}`)
      min[k] = Math.min(min[k], c)
      max[k] = Math.max(max[k], c)
    })
  }
// Nylander publica una flor de escala unidad; ~[-1, 0.98] xy, ~[-0.57, 0.96] alto.
assert.ok(max[0] - min[0] > 1.5 && max[0] - min[0] < 2.5, `ancho fuera de escala: ${max[0] - min[0]}`)
assert.ok(max[1] - min[1] > 1.0 && max[1] - min[1] < 2.0, `alto fuera de escala: ${max[1] - min[1]}`)

// El festón del borde debe repetirse 3.6 veces por vuelta, no 1: sin el 3.6 los
// pétalos se apilan y la flor degenera en un cilindro.
const edge = (t) => rosePoint(1, t)[1]
let signChanges = 0
for (let j = 1; j < 720; j++) {
  const t0 = 4 * PI + ((2 * PI * (j - 1)) / 720), t1 = 4 * PI + ((2 * PI * j) / 720)
  const t2 = 4 * PI + ((2 * PI * (j + 1)) / 720)
  const d0 = edge(t1) - edge(t0), d1 = edge(t2) - edge(t1)
  if (d0 * d1 < 0) signChanges++
}
assert.ok(signChanges >= 4, `pétalos apilados: solo ${signChanges} extremos por vuelta`)

console.log(`ok  xy ∈ [${min[0].toFixed(2)}, ${max[0].toFixed(2)}]  alto ∈ [${min[1].toFixed(2)}, ${max[1].toFixed(2)}]  extremos/vuelta: ${signChanges}`)
