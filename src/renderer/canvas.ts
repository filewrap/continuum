import type { ParticleBuffer } from "@/engine/particles"
import type { Camera } from "@/engine/camera"

/**
 * Fallback Canvas2D renderer when WebGL2 is unavailable.
 * Simple circles with alpha blending (AGENT.md §21, §24.18).
 */
export class Canvas2DRenderer {
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D not supported")
    this.ctx = ctx
  }

  render(
    buf: ParticleBuffer,
    camera: Camera,
    bgColor: [number, number, number],
  ): void {
    const ctx = this.ctx
    const w = ctx.canvas.width
    const h = ctx.canvas.height

    ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`
    ctx.fillRect(0, 0, w, h)

    // Simple grid reference overlay (optional; per AGENT.md §24.19).
    ctx.strokeStyle = "rgba(100, 120, 180, 0.08)"
    ctx.lineWidth = 1
    const cellSize = 100 * camera.zoom
    const minX = Math.floor((camera.centerX - w / (2 * camera.zoom)) / cellSize) * cellSize
    const minY = Math.floor((camera.centerY - h / (2 * camera.zoom)) / cellSize) * cellSize
    for (let x = minX; x < minX + w / camera.zoom + cellSize; x += cellSize) {
      const sx = camera.worldToScreenX(x)
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, h)
      ctx.stroke()
    }
    for (let y = minY; y < minY + h / camera.zoom + cellSize; y += cellSize) {
      const sy = camera.worldToScreenY(y)
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(w, sy)
      ctx.stroke()
    }

    // Draw particles.
    ctx.fillStyle = "rgba(214, 226, 255, 0.6)"
    for (let i = 0; i < buf.count; i++) {
      const sx = camera.worldToScreenX(buf.px[i])
      const sy = camera.worldToScreenY(buf.py[i])
      const r = Math.max(buf.size[i] * camera.zoom, 1)
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  resize(w: number, h: number): void {
    this.ctx.canvas.width = w
    this.ctx.canvas.height = h
  }

  dispose(): void {
    // Canvas 2D doesn't need explicit cleanup.
  }
}
