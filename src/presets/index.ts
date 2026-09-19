import type { ParticleBuffer } from "@/engine/particles"
import type { Rng } from "@/math/random"
import { TAU } from "@/math/constants"

/** How the simulation interprets a preset's particles (AGENT.md §16). */
export type PresetKind =
  | "shape" // static structural home (spring)
  | "orbit" // animated orbital target (spring)
  | "walk" // parametric walk cycle (spring)
  | "lattice" // warped grid (spring)
  | "hotel" // recursive receding geometry (spring)
  | "flow" // velocity field
  | "blackhole" // velocity field

export interface Preset {
  id: string
  name: string
  description: string
  /** Explicit model assumptions — surfaced so no analogy is mistaken for science. */
  assumptions: string[]
  kind: PresetKind
  particleCount: number
  cameraZoom: number
  params: Record<string, number>
  init: (buf: ParticleBuffer, rng: Rng) => void
}

/** Scatter particles as a tight cloud near origin for the coordinated reveal. */
function seedCloud(buf: ParticleBuffer, rng: Rng, count: number): void {
  buf.reset(count)
  for (let i = 0; i < count; i++) {
    const a = rng.next() * TAU
    const r = rng.gaussian(0, 60)
    buf.px[i] = Math.cos(a) * r
    buf.py[i] = Math.sin(a) * r
    buf.vx[i] = 0
    buf.vy[i] = 0
    buf.size[i] = 1
    buf.hue[i] = rng.next()
    buf.group[i] = 0
  }
}

const solarSystem: Preset = {
  id: "solar-system",
  name: "Solar System",
  description: "Particle sun and orbiting planetary rings with orbital-like motion.",
  assumptions: [
    "Simplified 2D orbital model — not an astrophysical N-body simulation.",
    "Orbital speeds follow a Keplerian-inspired 1/√r falloff, not measured data.",
  ],
  kind: "orbit",
  particleCount: 14000,
  cameraZoom: 0.42,
  params: { tilt: 0.55 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    const rings = 9
    for (let i = 0; i < buf.count; i++) {
      // ~18% of particles form the sun near the centre.
      const isSun = rng.next() < 0.18
      if (isSun) {
        const r = Math.sqrt(rng.next()) * 55
        buf.a0[i] = r
        buf.a1[i] = rng.next() * TAU
        buf.a2[i] = 0.0
        buf.a3[i] = 0
        buf.size[i] = 1.8
        buf.hue[i] = 0.11 // warm
        buf.group[i] = 0
      } else {
        const ring = rng.int(1, rings)
        const r = 120 + ring * 55 + rng.gaussian(0, 8)
        buf.a0[i] = r
        buf.a1[i] = rng.next() * TAU
        buf.a2[i] = 1.4 / Math.sqrt(r) // angular velocity
        buf.a3[i] = ring
        buf.size[i] = 0.8 + rng.next() * 0.6
        buf.hue[i] = 0.55 + ring * 0.03
        buf.group[i] = ring
      }
    }
  },
}

const walkingMan: Preset = {
  id: "walking-man",
  name: "Walking Man",
  description: "A particle humanoid with jointed limbs, a walk cycle, and self-healing.",
  assumptions: [
    "Stylised kinematic walk cycle, not a biomechanical gait model.",
    "Limbs are procedural segments rotated about fixed joints.",
  ],
  kind: "walk",
  particleCount: 6000,
  cameraZoom: 0.9,
  params: { speed: 2.4, stride: 0.7 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    // Body parts: 0 head, 1 torso, 2 leftArm, 3 rightArm, 4 leftLeg, 5 rightLeg
    for (let i = 0; i < buf.count; i++) {
      const roll = rng.next()
      let part: number
      if (roll < 0.14) part = 0
      else if (roll < 0.46) part = 1
      else if (roll < 0.61) part = 2
      else if (roll < 0.76) part = 3
      else if (roll < 0.88) part = 4
      else part = 5
      const t = rng.next() // param along the part
      buf.a2[i] = part
      buf.a3[i] = t
      buf.a0[i] = rng.gaussian(0, 6) // lateral jitter about the part centre-line
      buf.a1[i] = rng.gaussian(0, 6)
      buf.size[i] = 1
      buf.hue[i] = 0.6
      buf.group[i] = part
    }
  },
}

const river: Preset = {
  id: "river",
  name: "River",
  description: "Flowing particle streams with turbulence, banks, and branching lanes.",
  assumptions: [
    "Turbulence is a procedural sinusoidal + noise field, not fluid dynamics.",
  ],
  kind: "flow",
  particleCount: 16000,
  cameraZoom: 0.55,
  params: { flow: 90, turbulence: 34, bank: 260, width: 1100 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    for (let i = 0; i < buf.count; i++) {
      buf.px[i] = rng.range(-this.params.width / 2, this.params.width / 2)
      buf.py[i] = rng.gaussian(0, this.params.bank * 0.5)
      buf.vx[i] = this.params.flow
      buf.vy[i] = 0
      const lane = Math.floor(rng.next() * 5)
      buf.group[i] = lane
      buf.hue[i] = 0.52 + lane * 0.015
      buf.size[i] = 0.7 + rng.next() * 0.5
    }
  },
}

const spacetime: Preset = {
  id: "spacetime",
  name: "Spacetime Fabric",
  description: "A grid mesh that curves around moving masses with wave-like disturbance.",
  assumptions: [
    "Curvature is an illustrative potential well, not a general-relativity solver.",
  ],
  kind: "lattice",
  particleCount: 12000,
  cameraZoom: 0.5,
  params: { mass: 130000, soft: 90, orbitR: 380, orbitSpeed: 0.25 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    const cols = Math.round(Math.sqrt(buf.count))
    const rows = Math.ceil(buf.count / cols)
    const w = 1600
    const h = 1600
    for (let i = 0; i < buf.count; i++) {
      const c = i % cols
      const r = Math.floor(i / cols)
      buf.a0[i] = (c / (cols - 1) - 0.5) * w
      buf.a1[i] = (r / (rows - 1) - 0.5) * h
      buf.size[i] = 0.7
      buf.hue[i] = 0.62
      buf.group[i] = 0
    }
  },
}

const blackHole: Preset = {
  id: "black-hole",
  name: "Black Hole",
  description: "Accretion-like rotational inflow with an event-horizon region.",
  assumptions: [
    "Attraction + tangential inflow model; no relativistic light-bending or physics.",
    "Particles crossing the horizon are recycled to the outer disk (documented discontinuity).",
  ],
  kind: "blackhole",
  particleCount: 15000,
  cameraZoom: 0.6,
  params: { pull: 26000, horizon: 40, outer: 620, spin: 0.9 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    for (let i = 0; i < buf.count; i++) {
      const r = rng.range(this.params.horizon + 30, this.params.outer)
      const a = rng.next() * TAU
      buf.px[i] = Math.cos(a) * r
      buf.py[i] = Math.sin(a) * r
      // tangential seed velocity
      buf.vx[i] = -Math.sin(a) * 60
      buf.vy[i] = Math.cos(a) * 60
      buf.size[i] = 0.7 + rng.next() * 0.5
      buf.hue[i] = 0.07 + rng.next() * 0.05
      buf.group[i] = 0
    }
  },
}

const endlessHotel: Preset = {
  id: "endless-hotel",
  name: "Endless Hotel",
  description: "Recursive receding corridors that feel infinite through procedural recycling.",
  assumptions: [
    "Virtual repetition with depth recycling — not physically infinite geometry.",
  ],
  kind: "hotel",
  particleCount: 9000,
  cameraZoom: 0.85,
  params: { depthSpeed: 0.06, base: 7.5, frames: 14 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    for (let i = 0; i < buf.count; i++) {
      // Position on a unit rectangle frame (corridor cross-section).
      const t = rng.next()
      const seg = Math.floor(t * 4)
      const f = t * 4 - seg
      let x = 0
      let y = 0
      const s = 90
      if (seg === 0) {
        x = -s + f * 2 * s
        y = -s
      } else if (seg === 1) {
        x = s
        y = -s + f * 2 * s
      } else if (seg === 2) {
        x = s - f * 2 * s
        y = s
      } else {
        x = -s
        y = s - f * 2 * s
      }
      buf.a0[i] = x
      buf.a1[i] = y
      buf.a2[i] = rng.next() // depth phase
      buf.a3[i] = 0
      buf.size[i] = 0.9
      buf.hue[i] = 0.58
      buf.group[i] = 0
    }
  },
}

const galaxy: Preset = {
  id: "galaxy",
  name: "Galaxy",
  description: "A barred spiral of orbiting particle arms (extensibility example).",
  assumptions: ["Density-wave-inspired spiral, illustrative only."],
  kind: "orbit",
  particleCount: 18000,
  cameraZoom: 0.4,
  params: { tilt: 0.5 },
  init(buf, rng) {
    seedCloud(buf, rng, this.particleCount)
    const arms = 4
    for (let i = 0; i < buf.count; i++) {
      const t = rng.next()
      const arm = i % arms
      const r = 40 + t * 640
      const swirl = (r / 640) * 2.4
      const phase = (arm / arms) * TAU + swirl + rng.gaussian(0, 0.16)
      buf.a0[i] = r
      buf.a1[i] = phase
      buf.a2[i] = 1.6 / Math.sqrt(r + 20)
      buf.a3[i] = arm
      buf.size[i] = 0.6 + rng.next() * 0.7
      buf.hue[i] = 0.6 + t * 0.08
      buf.group[i] = arm
    }
  },
}

export const presets: Preset[] = [
  solarSystem,
  walkingMan,
  river,
  spacetime,
  blackHole,
  endlessHotel,
  galaxy,
]

export function getPreset(id: string): Preset {
  return presets.find((p) => p.id === id) ?? presets[0]
}

export const DEFAULT_PRESET_ID = "galaxy"
