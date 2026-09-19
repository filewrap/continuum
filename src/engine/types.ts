/** Shared engine/simulation types (see AGENT.md §6, §20). */

/** How a preset governs particle motion. */
export type BehaviorMode =
  | "structured" // particles spring toward an animated target (shapes, orbits, walker, lattice)
  | "field" // particles follow a velocity field (river flow, black-hole accretion)

/** Colored-particle source; OFF (monochrome) is the default per AGENT.md §2.4. */
export type ColorMode =
  | "off"
  | "velocity"
  | "energy"
  | "group"
  | "dimension"
  | "palette"

export interface HealingConfig {
  enabled: boolean
  particles: boolean
  shapes: boolean
  /** Spring stiffness restoring particles toward their target (structure/healing). */
  strength: number
  /** Velocity damping applied each step. */
  damping: number
  /** Displacement (world units) above which a particle counts as "damaged". */
  threshold: number
}

export interface AppearanceConfig {
  colorMode: ColorMode
  particleSize: number
  glow: number
  paletteHue: number
}

export interface SimConfig {
  /** Requested logical particle count (bounded by resource policy). */
  particleCount: number
  timeScale: number
  gravity: number
  turbulence: number
  maxSpeed: number
  healing: HealingConfig
  appearance: AppearanceConfig
}

export interface EngineStats {
  logicalParticles: number
  visibleParticles: number
  fps: number
  simMs: number
  renderMs: number
  renderer: string
}

/** Result of renderer capability detection (AGENT.md §3.5, §21). */
export interface RendererCapability {
  webgpu: boolean
  webgl2: boolean
  chosen: "webgl2" | "canvas2d"
  note: string
}
