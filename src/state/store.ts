import { create } from "zustand"
import { DEFAULT_PRESET_ID } from "@/presets"
import type { SimConfig } from "@/engine/types"

export type Tool = "hand" | "pencil" | "random" | "canon"

const defaultConfig: SimConfig = {
  particleCount: 18000,
  timeScale: 1,
  gravity: 0,
  turbulence: 18,
  maxSpeed: 420,
  healing: { enabled: true, particles: true, shapes: true, strength: 38, damping: 2.5, threshold: 24 },
  appearance: { colorMode: "off", particleSize: 1, glow: 0.45, paletteHue: 0.6 },
}

interface AppState {
  presetId: string
  tool: Tool
  config: SimConfig
  showCanon: boolean
  showPencil: boolean
  paused: boolean
  setPreset: (presetId: string) => void
  setTool: (tool: Tool) => void
  setConfig: (config: Partial<SimConfig>) => void
  setPencil: (patch: Partial<SimConfig>) => void
  togglePaused: () => void
  setCanon: (open: boolean) => void
  setPencilOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  presetId: DEFAULT_PRESET_ID,
  tool: "hand",
  config: defaultConfig,
  showCanon: false,
  showPencil: false,
  paused: false,
  setPreset: (presetId) => set({ presetId, showCanon: false }),
  setTool: (tool) => set({ tool, showPencil: tool === "pencil", showCanon: tool === "canon" }),
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  setPencil: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
  togglePaused: () => set((state) => ({ paused: !state.paused })),
  setCanon: (showCanon) => set({ showCanon }),
  setPencilOpen: (showPencil) => set({ showPencil }),
}))

export function persistState(): void {
  if (typeof indexedDB === "undefined") return
  const request = indexedDB.open("continuum", 1)
  request.onupgradeneeded = () => request.result.createObjectStore("settings")
  request.onsuccess = () => {
    const tx = request.result.transaction("settings", "readwrite")
    tx.objectStore("settings").put({ savedAt: Date.now() }, "last")
  }
}

export const getDefaultConfig = (): SimConfig => ({
  ...defaultConfig,
  healing: { ...defaultConfig.healing },
  appearance: { ...defaultConfig.appearance },
})
