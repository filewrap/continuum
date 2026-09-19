import { generators, type ShapeParams } from "./generators"
import type { ParticleBuffer } from "@/engine/particles"
import { Rng } from "@/math/random"

/**
 * Shape catalog: composes parametric generators with parameter variants to yield
 * a large, browsable library. This is NOT capped at 200 (AGENT.md §7.3, §22.4);
 * `proceduralShape` can synthesise unbounded additional variants from a seed.
 */
export interface ShapeEntry {
  id: string
  name: string
  category: string
  generator: string
  params: ShapeParams
  /** Model assumptions / notes surfaced in the UI where relevant. */
  note?: string
}

function entry(
  id: string,
  name: string,
  category: string,
  generator: string,
  params: ShapeParams = {},
): ShapeEntry {
  return { id, name, category, generator, params }
}

function buildCatalog(): ShapeEntry[] {
  const out: ShapeEntry[] = []

  // Basic geometry
  out.push(entry("disk", "Disk", "Geometry", "disk"))
  out.push(entry("ring", "Ring", "Geometry", "ring"))
  for (let s = 3; s <= 12; s++) {
    out.push(entry(`polygon-${s}`, `${s}-gon`, "Geometry", "polygon", { sides: s }))
  }
  for (let pts = 3; pts <= 12; pts++) {
    out.push(entry(`star-${pts}`, `${pts}-point Star`, "Geometry", "star", { points: pts }))
  }

  // Spirals & patterns
  out.push(entry("fibonacci", "Fibonacci Disk", "Patterns", "fibonacci"))
  for (let d = 1; d <= 6; d++) {
    out.push(
      entry(`phyllotaxis-${d}`, `Phyllotaxis ×${d}`, "Patterns", "phyllotaxis", { divergence: d }),
    )
  }
  for (let arms = 1; arms <= 6; arms++) {
    for (let turns = 2; turns <= 5; turns++) {
      out.push(
        entry(`spiral-${arms}-${turns}`, `Spiral ${arms}·${turns}`, "Patterns", "spiral", {
          arms,
          turns,
        }),
      )
    }
  }

  // Curves
  for (let k = 2; k <= 9; k++) {
    for (let petals = 1; petals <= 3; petals++) {
      out.push(
        entry(`rose-${k}-${petals}`, `Rose k${k}·${petals}`, "Curves", "rose", { k, petals }),
      )
    }
  }
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      if (a === b) continue
      out.push(
        entry(`lissajous-${a}-${b}`, `Lissajous ${a}:${b}`, "Curves", "lissajous", { a, b }),
      )
    }
  }
  for (let f = 2; f <= 8; f++) {
    out.push(entry(`wave-${f}`, `Wave ×${f}`, "Curves", "wave", { freq: f }))
  }

  // Superformula families
  for (let m = 3; m <= 16; m++) {
    out.push(
      entry(`superformula-${m}`, `Superformula m${m}`, "Superformula", "superformula", {
        m,
        n1: 0.3,
        n2: 0.3,
        n3: 0.3,
      }),
    )
  }
  const nSets = [
    [0.2, 1.7, 1.7],
    [1, 1, 1],
    [0.5, 0.5, 4],
    [40, 10, 10],
  ]
  for (let m = 4; m <= 10; m += 2) {
    nSets.forEach(([n1, n2, n3], idx) => {
      out.push(
        entry(`superformula-${m}-v${idx}`, `Superformula m${m}·${idx}`, "Superformula", "superformula", {
          m,
          n1,
          n2,
          n3,
        }),
      )
    })
  }

  // Surfaces / volumes
  out.push(entry("torus", "Torus", "Surfaces", "torus"))
  out.push(entry("grid", "Lattice Grid", "Surfaces", "grid"))
  out.push(entry("heart", "Heart", "Biological", "heart"))

  // Fractals
  out.push(entry("sierpinski", "Sierpinski", "Fractals", "sierpinski"))

  return out
}

let cache: ShapeEntry[] | null = null

export function shapeCatalog(): ShapeEntry[] {
  if (!cache) cache = buildCatalog()
  return cache
}

export function shapeCategories(): string[] {
  const cats = new Set<string>()
  for (const e of shapeCatalog()) cats.add(e.category)
  return ["All", ...Array.from(cats)]
}

export function searchShapes(query: string, category = "All"): ShapeEntry[] {
  const q = query.trim().toLowerCase()
  return shapeCatalog().filter((e) => {
    const inCat = category === "All" || e.category === category
    const inQ = !q || e.name.toLowerCase().includes(q) || e.id.includes(q)
    return inCat && inQ
  })
}

export function findShape(id: string): ShapeEntry | undefined {
  return shapeCatalog().find((e) => e.id === id)
}

/** Procedurally synthesise a shape variant from a seed (unbounded expansion). */
export function proceduralShape(seed: string): ShapeEntry {
  const rng = new Rng(seed)
  const genNames = Object.keys(generators)
  const generator = rng.pick(genNames)
  return {
    id: `procedural-${seed}`,
    name: `Procedural ${seed}`,
    category: "Procedural",
    generator,
    params: {
      sides: rng.int(3, 12),
      points: rng.int(3, 12),
      k: rng.int(2, 9),
      m: rng.int(3, 16),
      arms: rng.int(1, 6),
      turns: rng.int(2, 5),
      a: rng.int(1, 6),
      b: rng.int(1, 6),
      freq: rng.int(2, 8),
      scale: rng.range(0.7, 1.1),
    },
    note: "Procedurally generated from seed",
  }
}

/** Apply a shape entry: fills each particle's home position into (a0, a1). */
export function applyShapeEntry(entry: ShapeEntry, buf: ParticleBuffer, rng: Rng): void {
  const gen = generators[entry.generator]
  if (!gen) throw new Error(`Continuum: unknown generator "${entry.generator}"`)
  gen(buf, buf.count, entry.params, rng)
}
