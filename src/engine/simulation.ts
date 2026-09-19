import type { ParticleBuffer } from "@/engine/particles"
import type { SimConfig } from "@/engine/types"
import { SpatialHash } from "@/engine/spatialHash"
import { Rng } from "@/math/random"

const DT = 1 / 60 // fixed timestep

/**
 * Fixed-timestep physics simulation (AGENT.md §7, §24.1–24.6).
 *
 * Manages particles across preset kinds (structured = spring-based, field = velocity-driven).
 * Forces: gravity + turbulence. Interactions: blast radius, healing spring.
 */
export class Simulation {
  private buf: ParticleBuffer
  private config: SimConfig
  private hash: SpatialHash
  private rng: Rng
  private time = 0
  private accumulator = 0

  constructor(
    buffer: ParticleBuffer,
    config: SimConfig,
    seed: number = 12345,
  ) {
    this.buf = buffer
    this.config = config
    this.rng = new Rng(seed)
    this.hash = new SpatialHash(150)
  }

  update(deltaMs: number): void {
    this.accumulator += deltaMs / 1000
    while (this.accumulator >= DT) {
      this.step()
      this.accumulator -= DT
    }
  }

  private step(): void {
    this.time += DT

    // Apply forces: gravity, turbulence, damping, healing spring.
    for (let i = 0; i < this.buf.count; i++) {
      const g = this.config.gravity * DT
      this.buf.vy[i] -= g // gravity (downward)

      // Turbulence: smooth sinusoidal + noise field.
      const tx = Math.sin(this.buf.px[i] * 0.001 + this.time * 0.3) * 0.5
      const ty = Math.cos(this.buf.py[i] * 0.001 + this.time * 0.4) * 0.5
      const nx = this.rng.gaussian(0, this.config.turbulence * 0.001)
      const ny = this.rng.gaussian(0, this.config.turbulence * 0.001)
      this.buf.vx[i] += (tx + nx) * DT
      this.buf.vy[i] += (ty + ny) * DT

      // Clamp speed.
      const speed = Math.hypot(this.buf.vx[i], this.buf.vy[i])
      if (speed > this.config.maxSpeed) {
        this.buf.vx[i] = (this.buf.vx[i] / speed) * this.config.maxSpeed
        this.buf.vy[i] = (this.buf.vy[i] / speed) * this.config.maxSpeed
      }

      // Healing (spring toward target + damping).
      const { healing } = this.config
      if (healing.enabled && healing.particles) {
        const dx = this.buf.tx[i] - this.buf.px[i]
        const dy = this.buf.ty[i] - this.buf.py[i]
        const dist = Math.hypot(dx, dy)
        if (dist > healing.threshold) {
          const stiffness = healing.strength * DT * 0.01
          this.buf.vx[i] += (dx / (dist + 0.001)) * stiffness
          this.buf.vy[i] += (dy / (dist + 0.001)) * stiffness
        }
        this.buf.vx[i] *= 1 - healing.damping * DT
        this.buf.vy[i] *= 1 - healing.damping * DT
      }
    }

    // Integrate: x += v * dt.
    for (let i = 0; i < this.buf.count; i++) {
      this.buf.px[i] += this.buf.vx[i] * DT * this.config.timeScale
      this.buf.py[i] += this.buf.vy[i] * DT * this.config.timeScale
    }

    // Rebuild spatial hash.
    this.hash.build(this.buf.px, this.buf.py, this.buf.count)

    // Collision/interaction: blast radius healing.
    // (Applied by external caller via applyBlast; see app integration.)
  }

  /**
   * Blast: apply inward radial velocity to particles within radius.
   * Used by Hand and Canon controls.
   */
  applyBlast(cx: number, cy: number, radius: number, strength: number): void {
    const nearby: number[] = []
    this.hash.query(cx, cy, radius, (index) => nearby.push(index))
    for (const i of nearby) {
      const dx = this.buf.px[i] - cx
      const dy = this.buf.py[i] - cy
      const dist = Math.hypot(dx, dy)
      if (dist < radius && dist > 0) {
        const f = (1 - dist / radius) * strength
        const nx = dx / dist
        const ny = dy / dist
        this.buf.vx[i] += nx * f * DT
        this.buf.vy[i] += ny * f * DT
      }
    }
  }

  /**
   * Healing spell: restore particles near a point toward their structural targets.
   */
  applyHealing(cx: number, cy: number, radius: number): void {
    const nearby: number[] = []
    this.hash.query(cx, cy, radius, (index) => nearby.push(index))
    for (const i of nearby) {
      const dx = this.buf.tx[i] - this.buf.px[i]
      const dy = this.buf.ty[i] - this.buf.py[i]
      const dist = Math.hypot(dx, dy)
      if (dist < radius && dist > 0) {
        const f = (1 - dist / radius) * 2.0
        const nx = dx / (dist + 0.001)
        const ny = dy / (dist + 0.001)
        this.buf.vx[i] += nx * f * DT
        this.buf.vy[i] += ny * f * DT
      }
    }
  }

  updateConfig(config: Partial<SimConfig>): void {
    Object.assign(this.config, config)
  }

  getConfig(): SimConfig {
    return this.config
  }

  getBuffer(): ParticleBuffer {
    return this.buf
  }

  getTime(): number {
    return this.time
  }
}
