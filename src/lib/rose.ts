/**
 * Superficie paramétrica "rosa" de Paul Nylander (bugman123.com, 2006) — el origen
 * de la fórmula fotografiada. Constantes en precisión completa de `Rose.pov`;
 * el listado de Mathematica de la misma página las redondea a 1.95653 / 1.27689.
 *
 *   φ(θ) = (π/2)·e^(−θ/8π)
 *   y    = A·u²·(B·u − 1)²·sin φ                    ← perfil local del pétalo
 *   X(θ) = 1 − ½·((5/4)(1 − (3.6θ mod 2π)/π)² − ¼)²  ← festón del borde
 *   r    = X·(u·sin φ + y·cos φ)
 *   (x, y, z) = (r·sinθ, r·cosθ, X·(u·cos φ − y·sin φ))
 *
 * La foto omite tres cosas: el 3.6 dentro del mod, la definición de `y` local y la de `r`.
 * Fuente: bugman123.com/Math/index.html#Rose · nylander.wordpress.com/2006/06/21/
 */
export const A = 1.9565284531299512
export const B = 1.2768869870150188
export const U_MIN = 0
export const U_MAX = 1
/** Rango θ de Rose.pov / Rose.lsp: el que corresponde al render publicado. */
export const T_MIN = -(20 / 9) * Math.PI
export const T_MAX = 15 * Math.PI

const PI = Math.PI
const TAU = 2 * PI

/** Módulo siempre positivo: Mathematica/MATLAB lo son, `%` de JS no, y θ empieza negativo. */
const mod2 = (a: number, b: number) => {
  const c = a % b
  return c > 0 ? c : c + b
}

/** Devuelve el punto en coordenadas de three.js (Y arriba); Nylander usa Z arriba. */
export function rosePoint(u: number, t: number): [number, number, number] {
  const phi = (PI / 2) * Math.exp(-t / (8 * PI))
  const y = A * u * u * (B * u - 1) ** 2 * Math.sin(phi)
  const s = 1.25 * (1 - mod2(3.6 * t, TAU) / PI) ** 2 - 0.25
  const X = 1 - 0.5 * s * s
  const r = X * (u * Math.sin(phi) + y * Math.cos(phi))
  return [r * Math.sin(t), X * (u * Math.cos(phi) - y * Math.sin(phi)), r * Math.cos(t)]
}
