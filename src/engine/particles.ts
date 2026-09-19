/**
 * Structure-of-Arrays particle store backed by typed arrays.
 *
 * High-frequency particle state lives here, never in React state (AGENT.md §3.3,
 * §3.11, §24.13). Arrays are allocated once at capacity and reused.
 */
export class ParticleBuffer {
  readonly capacity: number
  count = 0

  // Kinematics (world space).
  readonly px: Float32Array
  readonly py: Float32Array
  readonly vx: Float32Array
  readonly vy: Float32Array

  // Animated structural target ("home" for the current shape/preset).
  readonly tx: Float32Array
  readonly ty: Float32Array

  // Base parameters interpreted per behavior (e.g. radius, phase, angular vel, sub-id).
  readonly a0: Float32Array
  readonly a1: Float32Array
  readonly a2: Float32Array
  readonly a3: Float32Array

  readonly size: Float32Array
  readonly hue: Float32Array // base hue in [0,1] for palette/group coloring
  readonly group: Uint16Array

  constructor(capacity: number) {
    this.capacity = capacity
    this.px = new Float32Array(capacity)
    this.py = new Float32Array(capacity)
    this.vx = new Float32Array(capacity)
    this.vy = new Float32Array(capacity)
    this.tx = new Float32Array(capacity)
    this.ty = new Float32Array(capacity)
    this.a0 = new Float32Array(capacity)
    this.a1 = new Float32Array(capacity)
    this.a2 = new Float32Array(capacity)
    this.a3 = new Float32Array(capacity)
    this.size = new Float32Array(capacity)
    this.hue = new Float32Array(capacity)
    this.group = new Uint16Array(capacity)
  }

  /** Reset the active count; capacity/backing arrays are retained. */
  reset(count: number): void {
    this.count = Math.min(count, this.capacity)
  }

  /** Current speed of a particle (used for energy/velocity coloring). */
  speed(i: number): number {
    return Math.hypot(this.vx[i], this.vy[i])
  }
}
