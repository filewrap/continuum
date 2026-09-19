/**
 * Uniform-grid spatial hash for local neighbour queries (blast/canon propagation,
 * density). Avoids O(n²) all-pairs comparisons (AGENT.md §18.2).
 */
export class SpatialHash {
  private cellSize: number
  private cells = new Map<number, number[]>()

  constructor(cellSize: number) {
    this.cellSize = Math.max(1, cellSize)
  }

  private key(cx: number, cy: number): number {
    // Cantor-style pairing on shifted integer cell coords; bounded for our world.
    return ((cx + 32768) & 0xffff) * 65536 + ((cy + 32768) & 0xffff)
  }

  clear(cellSize?: number): void {
    if (cellSize !== undefined) this.cellSize = Math.max(1, cellSize)
    this.cells.clear()
  }

  /** Rebuild from Structure-of-Arrays position buffers. */
  build(px: Float32Array, py: Float32Array, count: number, cellSize?: number): void {
    this.clear(cellSize)
    const cs = this.cellSize
    for (let i = 0; i < count; i++) {
      const cx = Math.floor(px[i] / cs)
      const cy = Math.floor(py[i] / cs)
      const k = this.key(cx, cy)
      const bucket = this.cells.get(k)
      if (bucket) bucket.push(i)
      else this.cells.set(k, [i])
    }
  }

  /** Invoke `visit` for every particle index within `radius` of (x, y). */
  query(x: number, y: number, radius: number, visit: (index: number) => void): void {
    const cs = this.cellSize
    const minX = Math.floor((x - radius) / cs)
    const maxX = Math.floor((x + radius) / cs)
    const minY = Math.floor((y - radius) / cs)
    const maxY = Math.floor((y + radius) / cs)
    for (let cx = minX; cx <= maxX; cx++) {
      for (let cy = minY; cy <= maxY; cy++) {
        const bucket = this.cells.get(this.key(cx, cy))
        if (!bucket) continue
        for (let b = 0; b < bucket.length; b++) visit(bucket[b])
      }
    }
  }
}
