/**
 * Deterministic, seedable pseudo-random generation.
 *
 * Simulation logic MUST use this instead of Math.random() so that a fixed seed
 * reproduces the same intended universe (see AGENT.md §25.5). Session-only
 * randomness (e.g. picking a fresh seed) may use Math.random() at the boundary.
 */

/** Hash an arbitrary string seed into a 32-bit unsigned integer. */
export function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, deterministic 32-bit PRNG. */
export class Rng {
  private state: number

  constructor(seed: number | string) {
    this.state = (typeof seed === "string" ? hashSeed(seed) : seed >>> 0) || 1
  }

  /** Next float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /** Float in [min, max). */
  range(min: number, max: number): number {
    return min + (max - min) * this.next()
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1))
  }

  /** Standard-normal-ish value via Box-Muller. */
  gaussian(mean = 0, stdDev = 1): number {
    const u = 1 - this.next()
    const v = this.next()
    const mag = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    return mean + mag * stdDev
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)]
  }
}

/** Produce a fresh non-deterministic seed string for a new session universe. */
export function freshSeed(): string {
  return Math.floor(Math.random() * 0xffffffff).toString(36)
}
