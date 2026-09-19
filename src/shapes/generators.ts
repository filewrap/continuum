import type { ParticleBuffer } from "@/engine/particles"
import type { Rng } from "@/math/random"
import { TAU, GOLDEN_ANGLE, PHI } from "@/math/constants"

/**
 * Parametric shape generators. Each writes a per-particle "home" position into
 * (a0, a1). Combined with parameter variation in the catalog, these produce far
 * more than 200 distinct shapes (AGENT.md §7.3), and support procedural growth.
 */
export type ShapeParams = Record<string, number>
export type ShapeGen = (buf: ParticleBuffer, count: number, p: ShapeParams, rng: Rng) => void

const R = 560 // nominal world radius shapes fit within

function set(buf: ParticleBuffer, i: number, x: number, y: number): void {
  buf.a0[i] = x
  buf.a1[i] = y
}

export const generators: Record<string, ShapeGen> = {
  disk(buf, count, p, rng) {
    const r = R * (p.scale ?? 1)
    for (let i = 0; i < count; i++) {
      const rad = Math.sqrt(rng.next()) * r
      const ang = rng.next() * TAU
      set(buf, i, Math.cos(ang) * rad, Math.sin(ang) * rad)
    }
  },

  ring(buf, count, p, rng) {
    const r = R * (p.scale ?? 0.8)
    const thickness = p.thickness ?? 40
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * TAU
      const rr = r + rng.gaussian(0, thickness)
      set(buf, i, Math.cos(ang) * rr, Math.sin(ang) * rr)
    }
  },

  polygon(buf, count, p, rng) {
    const sides = Math.max(3, Math.round(p.sides ?? 5))
    const r = R * (p.scale ?? 0.85)
    for (let i = 0; i < count; i++) {
      const t = i / count
      const edge = t * sides
      const seg = Math.floor(edge)
      const f = edge - seg
      const a0 = (seg / sides) * TAU
      const a1 = ((seg + 1) / sides) * TAU
      const x0 = Math.cos(a0) * r
      const y0 = Math.sin(a0) * r
      const x1 = Math.cos(a1) * r
      const y1 = Math.sin(a1) * r
      const jitter = rng.gaussian(0, 6)
      set(buf, i, x0 + (x1 - x0) * f + jitter, y0 + (y1 - y0) * f + jitter)
    }
  },

  star(buf, count, p, rng) {
    void rng
    const points = Math.max(3, Math.round(p.points ?? 5))
    const r = R * (p.scale ?? 0.9)
    const inner = r * (p.inner ?? 0.42)
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * TAU
      const k = Math.cos(ang * points)
      const rr = inner + (r - inner) * (0.5 + 0.5 * k)
      set(buf, i, Math.cos(ang) * rr, Math.sin(ang) * rr)
    }
  },

  fibonacci(buf, count, p, rng) {
    const r = R * (p.scale ?? 1)
    for (let i = 0; i < count; i++) {
      const rad = Math.sqrt(i / count) * r
      const ang = i * GOLDEN_ANGLE
      const j = rng.gaussian(0, 3)
      set(buf, i, Math.cos(ang) * rad + j, Math.sin(ang) * rad + j)
    }
  },

  spiral(buf, count, p, rng) {
    const arms = Math.max(1, Math.round(p.arms ?? 2))
    const turns = p.turns ?? 3
    const r = R * (p.scale ?? 1)
    for (let i = 0; i < count; i++) {
      const t = i / count
      const arm = i % arms
      const ang = t * TAU * turns + (arm / arms) * TAU
      const rad = t * r
      const spread = rng.gaussian(0, 10 + rad * 0.03)
      set(buf, i, Math.cos(ang) * rad + spread, Math.sin(ang) * rad + spread)
    }
  },

  rose(buf, count, p, rng) {
    const k = p.k ?? 4
    const r = R * (p.scale ?? 0.95)
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * TAU * (p.petals ?? 2)
      const rr = r * Math.abs(Math.cos(k * ang))
      const j = rng.gaussian(0, 4)
      set(buf, i, Math.cos(ang) * rr + j, Math.sin(ang) * rr + j)
    }
  },

  lissajous(buf, count, p, rng) {
    const a = p.a ?? 3
    const b = p.b ?? 2
    const delta = (p.delta ?? 0.5) * Math.PI
    const r = R * (p.scale ?? 0.9)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * TAU
      const j = rng.gaussian(0, 5)
      set(buf, i, Math.sin(a * t + delta) * r + j, Math.sin(b * t) * r + j)
    }
  },

  superformula(buf, count, p, rng) {
    const m = p.m ?? 6
    const n1 = p.n1 ?? 0.3
    const n2 = p.n2 ?? 0.3
    const n3 = p.n3 ?? 0.3
    const r = R * (p.scale ?? 0.9)
    for (let i = 0; i < count; i++) {
      const phi = (i / count) * TAU
      const t1 = Math.pow(Math.abs(Math.cos((m * phi) / 4)), n2)
      const t2 = Math.pow(Math.abs(Math.sin((m * phi) / 4)), n3)
      const rr = Math.pow(t1 + t2, -1 / n1)
      const scale = isFinite(rr) ? Math.min(rr, 3) : 1
      const j = rng.gaussian(0, 4)
      set(buf, i, Math.cos(phi) * scale * r * 0.5 + j, Math.sin(phi) * scale * r * 0.5 + j)
    }
  },

  grid(buf, count, p, rng) {
    const cols = Math.max(2, Math.round(Math.sqrt(count) * (p.aspect ?? 1)))
    const rows = Math.max(2, Math.ceil(count / cols))
    const w = R * 1.8
    const h = R * 1.8
    for (let i = 0; i < count; i++) {
      const c = i % cols
      const rIdx = Math.floor(i / cols)
      const x = (c / (cols - 1) - 0.5) * w
      const y = (rIdx / (rows - 1) - 0.5) * h
      set(buf, i, x, rng ? y : y)
    }
  },

  heart(buf, count, p, rng) {
    const s = (R / 18) * (p.scale ?? 1)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * TAU
      const x = 16 * Math.sin(t) ** 3
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      const j = rng.gaussian(0, 0.4)
      set(buf, i, (x + j) * s, -(y + j) * s)
    }
  },

  wave(buf, count, p, rng) {
    const freq = p.freq ?? 3
    const amp = R * (p.amp ?? 0.4)
    const w = R * 1.8
    for (let i = 0; i < count; i++) {
      const t = i / count
      const x = (t - 0.5) * w
      const y = Math.sin(t * TAU * freq) * amp * Math.sin(t * Math.PI)
      set(buf, i, x, y + rng.gaussian(0, 6))
    }
  },

  torus(buf, count, p, rng) {
    const outer = R * (p.scale ?? 0.9)
    const inner = outer * (p.inner ?? 0.4)
    for (let i = 0; i < count; i++) {
      const u = rng.next() * TAU
      const v = rng.next() * TAU
      const rr = outer + inner * Math.cos(v)
      set(buf, i, Math.cos(u) * rr, Math.sin(u) * rr * 0.6 + inner * Math.sin(v) * 0.4)
    }
  },

  sierpinski(buf, count, p, rng) {
    const r = R * (p.scale ?? 1)
    const ax = 0
    const ay = -r
    const bx = -r * 0.87
    const by = r * 0.5
    const cx = r * 0.87
    const cy = r * 0.5
    let x = 0
    let y = 0
    for (let i = 0; i < count; i++) {
      const pick = rng.int(0, 2)
      const tx = pick === 0 ? ax : pick === 1 ? bx : cx
      const ty = pick === 0 ? ay : pick === 1 ? by : cy
      x = (x + tx) / 2
      y = (y + ty) / 2
      set(buf, i, x, y)
    }
  },

  phyllotaxis(buf, count, p, rng) {
    void rng
    const c = (R / Math.sqrt(count)) * (p.scale ?? 1.1)
    for (let i = 0; i < count; i++) {
      const ang = i * GOLDEN_ANGLE * (p.divergence ?? 1)
      const rad = c * Math.sqrt(i) * PHI * 0.4
      set(buf, i, Math.cos(ang) * rad, Math.sin(ang) * rad)
    }
  },
}
