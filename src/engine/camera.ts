import { clamp } from "@/math/constants"

/**
 * Viewport transform owning pan + zoom in a virtual coordinate space.
 * Operates independently of particle effects and supports Hand mode
 * (AGENT.md §5.2, §11.5). Camera state is preserved across menu open/close.
 */
export class Camera {
  centerX = 0
  centerY = 0
  zoom = 0.5 // pixels per world unit

  readonly minZoom = 0.02
  readonly maxZoom = 12

  viewW = 1
  viewH = 1

  setViewport(w: number, h: number): void {
    this.viewW = Math.max(1, w)
    this.viewH = Math.max(1, h)
  }

  worldToScreenX(wx: number): number {
    return (wx - this.centerX) * this.zoom + this.viewW / 2
  }

  worldToScreenY(wy: number): number {
    return (wy - this.centerY) * this.zoom + this.viewH / 2
  }

  screenToWorldX(sx: number): number {
    return (sx - this.viewW / 2) / this.zoom + this.centerX
  }

  screenToWorldY(sy: number): number {
    return (sy - this.viewH / 2) / this.zoom + this.centerY
  }

  /** Pan by a screen-space delta (e.g. drag / swipe in Hand mode). */
  panScreen(dxPixels: number, dyPixels: number): void {
    this.centerX -= dxPixels / this.zoom
    this.centerY -= dyPixels / this.zoom
  }

  /** Zoom by a multiplicative factor, keeping the given screen point fixed. */
  zoomAt(factor: number, screenX: number, screenY: number): void {
    const worldX = this.screenToWorldX(screenX)
    const worldY = this.screenToWorldY(screenY)
    this.zoom = clamp(this.zoom * factor, this.minZoom, this.maxZoom)
    // Re-anchor so the pointed-at world point stays under the cursor.
    this.centerX = worldX - (screenX - this.viewW / 2) / this.zoom
    this.centerY = worldY - (screenY - this.viewH / 2) / this.zoom
  }

  getProjection(width: number, height: number): Float32Array {
    this.setViewport(width, height)
    const sx = (2 * this.zoom) / width
    const sy = (-2 * this.zoom) / height
    return new Float32Array([
      sx, 0, 0,
      0, sy, 0,
      -this.centerX * sx, this.centerY * -sy, 1,
    ])
  }

  reset(): void {
    this.centerX = 0
    this.centerY = 0
    this.zoom = 0.5
  }
}
