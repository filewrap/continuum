import { useEffect, useRef, useState } from "react"
import { Hand, Pencil, Shuffle, BookOpen, Pause, Play, RotateCcw, X } from "lucide-react"
import { Camera } from "@/engine/camera"
import { ParticleBuffer } from "@/engine/particles"
import { Simulation } from "@/engine/simulation"
import { Canvas2DRenderer } from "@/renderer/canvas"
import { WebGL2Renderer, detectRendererCapability } from "@/renderer/webgl"
import { getPreset, presets } from "@/presets"
import { Rng } from "@/math/random"
import { useAppStore, type Tool, getDefaultConfig } from "@/state/store"
import "@/styles/app.css"

const icons = { hand: Hand, pencil: Pencil, random: Shuffle, canon: BookOpen }

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<{ sim: Simulation; camera: Camera; render: WebGL2Renderer | Canvas2DRenderer; frame: number } | null>(null)
  const presetId = useAppStore((s) => s.presetId)
  const tool = useAppStore((s) => s.tool)
  const config = useAppStore((s) => s.config)
  const paused = useAppStore((s) => s.paused)
  const showCanon = useAppStore((s) => s.showCanon)
  const showPencil = useAppStore((s) => s.showPencil)
  const setPreset = useAppStore((s) => s.setPreset)
  const setTool = useAppStore((s) => s.setTool)
  const setConfig = useAppStore((s) => s.setConfig)
  const togglePaused = useAppStore((s) => s.togglePaused)
  const setCanon = useAppStore((s) => s.setCanon)
  const setPencilOpen = useAppStore((s) => s.setPencilOpen)
  const [hint] = useState("Drag to disturb the continuum")
  const [status, setStatus] = useState("initializing")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const preset = getPreset(presetId)
    const buffer = new ParticleBuffer(Math.max(preset.particleCount, 24000))
    const rngSeed = 424242
    preset.init(buffer, new Rng(rngSeed))
    const camera = new Camera()
    camera.zoom = preset.cameraZoom
    const sim = new Simulation(buffer, config, rngSeed)
    const capability = detectRendererCapability()
    const render = capability.chosen === "webgl2" ? new WebGL2Renderer(canvas) : new Canvas2DRenderer(canvas)
    setStatus(capability.chosen)
    runtimeRef.current = { sim, camera, render, frame: 0 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      render.resize(Math.max(1, Math.floor(rect.width * devicePixelRatio)), Math.max(1, Math.floor(rect.height * devicePixelRatio)))
      camera.setViewport(rect.width * devicePixelRatio, rect.height * devicePixelRatio)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    let last = performance.now()
    const loop = (now: number) => {
      const runtime = runtimeRef.current
      if (!runtime) return
      const delta = Math.min(64, now - last)
      last = now
      if (!paused) runtime.sim.update(delta)
      runtime.render.render(buffer, camera, [5, 6, 10])
      runtime.frame = requestAnimationFrame(loop)
    }
    runtimeRef.current.frame = requestAnimationFrame(loop)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(runtimeRef.current?.frame ?? 0)
      runtimeRef.current?.render.dispose()
      runtimeRef.current = null
    }
  }, [presetId])

  useEffect(() => {
    runtimeRef.current?.sim.updateConfig(config)
  }, [config])

  const pointerToWorld = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const runtime = runtimeRef.current
    const rect = event.currentTarget.getBoundingClientRect()
    if (!runtime) return null
    return { x: runtime.camera.screenToWorldX(event.clientX - rect.left), y: runtime.camera.screenToWorldY(event.clientY - rect.top) }
  }
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "hand" || event.buttons === 0) return
    const point = pointerToWorld(event)
    if (!point) return
    if (tool === "canon") runtimeRef.current?.sim.applyBlast(point.x, point.y, 180, 900)
    if (tool === "pencil") runtimeRef.current?.sim.applyHealing(point.x, point.y, 110)
  }
  const onWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const runtime = runtimeRef.current
    if (!runtime) return
    const rect = event.currentTarget.getBoundingClientRect()
    runtime.camera.zoomAt(event.deltaY > 0 ? 0.9 : 1.1, event.clientX - rect.left, event.clientY - rect.top)
  }

  return (
    <main className="app-shell">
      <canvas ref={canvasRef} className="universe-canvas" onPointerMove={onPointerMove} onWheel={onWheel} />
      <header className="topbar">
        <div className="brand"><span className="brand-mark">∷</span><div><strong>CONTINUUM</strong><span>particle universe</span></div></div>
        <div className="top-status"><span className="status-dot" /> {status} <span className="separator">·</span> {getPreset(presetId).name}</div>
      </header>

      <section className="tool-dock" aria-label="Simulation controls">
        <ToolButton active={tool === "hand"} label="Hand" shortcut="H" onClick={() => setTool("hand")} />
        <ToolButton active={tool === "pencil"} label="Pencil" shortcut="P" onClick={() => setTool("pencil")} />
        <ToolButton active={tool === "random"} label="Random" shortcut="R" onClick={() => { setTool("random"); setPreset(presets[Math.floor(Math.random() * presets.length)].id) }} />
        <ToolButton active={tool === "canon"} label="Canon" shortcut="C" onClick={() => { setTool("canon"); setCanon(true) }} />
      </section>

      <div className="bottom-actions">
        <button className="icon-button" aria-label={paused ? "Play simulation" : "Pause simulation"} onClick={togglePaused}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
        <button className="icon-button" aria-label="Reset camera" onClick={() => runtimeRef.current?.camera.reset()}><RotateCcw size={15} /></button>
        <span className="microcopy">{paused ? "PAUSED" : "LIVE"} · {config.particleCount.toLocaleString()} particles</span>
      </div>

      {showPencil && <PencilPanel onClose={() => setPencilOpen(false)} config={config} setConfig={setConfig} />}
      {showCanon && <CanonPanel onClose={() => { setCanon(false); setTool("hand") }} selected={presetId} select={setPreset} />}
      <div className="hint-card"><span className="hint-kicker">{tool.toUpperCase()}</span><span>{hint}</span></div>
      <div className="assumptions">Illustrative model · {getPreset(presetId).assumptions[0]}</div>
    </main>
  )
}

function ToolButton({ active, label, shortcut, onClick }: { active: boolean; label: string; shortcut: string; onClick: () => void }) {
  const Icon = icons[label.toLowerCase() as Tool]
  return <button className={`tool-button ${active ? "active" : ""}`} onClick={onClick}><Icon size={17} strokeWidth={1.7} /><span>{label}</span><kbd>{shortcut}</kbd></button>
}

function PencilPanel({ onClose, config, setConfig }: { onClose: () => void; config: ReturnType<typeof getDefaultConfig>; setConfig: (patch: Partial<typeof config>) => void }) {
  return <aside className="side-panel"><div className="panel-heading"><div><span className="eyebrow">PENCIL</span><h2>Shape repair</h2></div><button className="close-button" onClick={onClose} aria-label="Close pencil settings"><X size={16} /></button></div><p>Guide displaced particles back toward their structural targets.</p><label>Strength <output>{config.healing.strength}</output><input type="range" min="0" max="100" value={config.healing.strength} onChange={(e) => setConfig({ healing: { ...config.healing, strength: Number(e.target.value) } })} /></label><label>Damping <output>{config.healing.damping.toFixed(1)}</output><input type="range" min="0" max="8" step="0.1" value={config.healing.damping} onChange={(e) => setConfig({ healing: { ...config.healing, damping: Number(e.target.value) } })} /></label><div className="panel-note">Press and drag across the field to heal.</div></aside>
}

function CanonPanel({ onClose, selected, select }: { onClose: () => void; selected: string; select: (id: string) => void }) {
  return <aside className="canon-panel"><div className="panel-heading"><div><span className="eyebrow">CANON</span><h2>Worlds</h2></div><button className="close-button" onClick={onClose} aria-label="Close canon menu"><X size={16} /></button></div><div className="preset-list">{presets.map((preset) => <button key={preset.id} className={`preset-card ${selected === preset.id ? "selected" : ""}`} onClick={() => select(preset.id)}><span className="preset-index">{String(presets.indexOf(preset) + 1).padStart(2, "0")}</span><span><strong>{preset.name}</strong><small>{preset.description}</small></span></button>)}</div></aside>
}

