/** Minimal 2D vector helpers for simulation-space math (scalar, allocation-light). */

export interface Vec2 {
  x: number
  y: number
}

export function dist2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx
  const dy = ay - by
  return dx * dx + dy * dy
}

export function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt(dist2(ax, ay, bx, by))
}

export function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

/** Smooth falloff in [0,1] for a normalized distance t in [0,1] (quintic smootherstep). */
export function falloff(t: number): number {
  if (t <= 0) return 1
  if (t >= 1) return 0
  const u = 1 - t
  return u * u * u * (u * (u * 6 - 15) + 10)
}
