import type { ParticleBuffer } from "@/engine/particles"
import type { Camera } from "@/engine/camera"
import type { RendererCapability } from "@/engine/types"

const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 position;
in float size;
in float hue;

uniform mat3 projection;
uniform float time;
uniform int colorMode;

out vec3 vColor;

vec3 hslToRgb(float h, float s, float l) {
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float x = c * (1.0 - mod(h * 6.0, 2.0) - 1.0);
  vec3 rgb = vec3(0.0);
  if (h < 1.0 / 6.0) rgb = vec3(c, x, 0.0);
  else if (h < 2.0 / 6.0) rgb = vec3(x, c, 0.0);
  else if (h < 3.0 / 6.0) rgb = vec3(0.0, c, x);
  else if (h < 4.0 / 6.0) rgb = vec3(0.0, x, c);
  else if (h < 5.0 / 6.0) rgb = vec3(x, 0.0, c);
  else rgb = vec3(c, 0.0, x);
  float m = l - c / 2.0;
  return rgb + m;
}

void main() {
  vec3 pos = projection * vec3(position, 1.0);
  gl_Position = vec4(pos.xy, 0.0, 1.0);
  gl_PointSize = max(size, 1.0);

  // Simple hue-based coloring (palette mode).
  vColor = hslToRgb(hue, 0.7, 0.5);
}
`

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec3 vColor;
out vec4 outColor;

void main() {
  // Soft circle via distance field.
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  if (dist > 0.5) discard;
  float alpha = (1.0 - dist * 2.0) * 0.8;
  outColor = vec4(vColor, alpha);
}
`

export class WebGL2Renderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private vao: WebGLVertexArrayObject
  private positionBuffer: WebGLBuffer
  private sizeBuffer: WebGLBuffer
  private hueBuffer: WebGLBuffer

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    })
    if (!gl) throw new Error("WebGL2 not supported")

    this.gl = gl
    this.program = this.createProgram(VERTEX_SHADER, FRAGMENT_SHADER)
    this.vao = gl.createVertexArray()!
    this.positionBuffer = gl.createBuffer()!
    this.sizeBuffer = gl.createBuffer()!
    this.hueBuffer = gl.createBuffer()!

    gl.bindVertexArray(this.vao)

    // Position: vec2
    const posLoc = gl.getAttribLocation(this.program, "position")
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Size: float
    const sizeLoc = gl.getAttribLocation(this.program, "size")
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer)
    gl.enableVertexAttribArray(sizeLoc)
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0)

    // Hue: float
    const hueLoc = gl.getAttribLocation(this.program, "hue")
    gl.bindBuffer(gl.ARRAY_BUFFER, this.hueBuffer)
    gl.enableVertexAttribArray(hueLoc)
    gl.vertexAttribPointer(hueLoc, 1, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
  }

  render(
    buf: ParticleBuffer,
    camera: Camera,
    bgColor: [number, number, number],
  ): void {
    const gl = this.gl
    const w = gl.canvas.width
    const h = gl.canvas.height

    gl.viewport(0, 0, w, h)
    gl.clearColor(bgColor[0] / 255, bgColor[1] / 255, bgColor[2] / 255, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.useProgram(this.program)

    // Update projection matrix.
    const proj = camera.getProjection(w, h)
    const projLoc = gl.getUniformLocation(this.program, "projection")
    gl.uniformMatrix3fv(projLoc, false, proj)

    // Upload particle data.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(buf.px.slice(0, buf.count * 2)),
      gl.DYNAMIC_DRAW,
    )
    // Interleave px, py for position stream.
    const pos = new Float32Array(buf.count * 2)
    for (let i = 0; i < buf.count; i++) {
      pos[i * 2] = buf.px[i]
      pos[i * 2 + 1] = buf.py[i]
    }
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, buf.size.slice(0, buf.count), gl.DYNAMIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.hueBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, buf.hue.slice(0, buf.count), gl.DYNAMIC_DRAW)

    gl.bindVertexArray(this.vao)
    gl.drawArrays(gl.POINTS, 0, buf.count)
  }

  resize(w: number, h: number): void {
    const gl = this.gl
    gl.canvas.width = w
    gl.canvas.height = h
  }

  dispose(): void {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.deleteBuffer(this.positionBuffer)
    gl.deleteBuffer(this.sizeBuffer)
    gl.deleteBuffer(this.hueBuffer)
    gl.deleteVertexArray(this.vao)
  }

  private createProgram(vs: string, fs: string): WebGLProgram {
    const gl = this.gl
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vs)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("[v0] Vertex shader error:", gl.getShaderInfoLog(vertexShader))
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fs)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("[v0] Fragment shader error:", gl.getShaderInfoLog(fragmentShader))
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[v0] Program link error:", gl.getProgramInfoLog(program))
    }

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    return program
  }
}

export function detectRendererCapability(): RendererCapability {
  const canvas = document.createElement("canvas")
  const webgl2 = !!canvas.getContext("webgl2")
  return {
    webgpu: false,
    webgl2,
    chosen: webgl2 ? "webgl2" : "canvas2d",
    note: webgl2 ? "WebGL2 detected" : "Fallback to Canvas2D",
  }
}
