/**
 * Mathematical constants used across the simulation and presets.
 * Large / abstract objects are represented symbolically, never as impossible
 * finite literals (see AGENT.md §9.1).
 */

export const PI = Math.PI
export const TAU = Math.PI * 2
export const E = Math.E
export const SQRT2 = Math.SQRT2
export const PHI = (1 + Math.sqrt(5)) / 2 // golden ratio φ
export const GOLDEN_ANGLE = TAU * (1 - 1 / PHI) // ≈ 2.399963 rad

/** Symbolic labels for objects that cannot be materialised as finite values. */
export const SYMBOLIC = {
  grahams: "G₆₄",
  omega: "ω",
  alephNull: "ℵ₀",
  infinity: "∞",
} as const

export const DEG2RAD = PI / 180
export const RAD2DEG = 180 / PI

/** Floating-point comparison tolerance (AGENT.md §25.2). */
export const EPSILON = 1e-6

export function approxEqual(a: number, b: number, eps = EPSILON): boolean {
  return Math.abs(a - b) <= eps
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
