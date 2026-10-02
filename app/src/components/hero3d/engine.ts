/**
 * Dependency-free WebGL2 renderer for the spinning CONDUIT hero sneaker.
 * Usage: const stop = mountConduitHero(canvas, { onAzimuth }); …; stop()
 */
import { buildShoe, type MeshData, type PartId } from './geometry'
import { FLOOR_FS, FLOOR_VS, SHOE_FS, SHOE_VS } from './shaders'

type M4 = Float32Array

const m4 = {
  ident(): M4 {
    const m = new Float32Array(16)
    m[0] = m[5] = m[10] = m[15] = 1
    return m
  },
  mul(a: M4, b: M4): M4 {
    const o = new Float32Array(16)
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 4; r++) {
        let s = 0
        for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]
        o[c * 4 + r] = s
      }
    return o
  },
  persp(fovy: number, aspect: number, n: number, f: number): M4 {
    const t = 1 / Math.tan(fovy / 2)
    const m = new Float32Array(16)
    m[0] = t / aspect
    m[5] = t
    m[10] = (f + n) / (n - f)
    m[11] = -1
    m[14] = (2 * f * n) / (n - f)
    return m
  },
  lookAt(e: number[], c: number[], up: number[]): M4 {
    const z = norm3([e[0] - c[0], e[1] - c[1], e[2] - c[2]])
    const x = norm3(cross3(up, z))
    const y = cross3(z, x)
    const m = m4.ident()
    m[0] = x[0]; m[4] = x[1]; m[8] = x[2]
    m[1] = y[0]; m[5] = y[1]; m[9] = y[2]
    m[2] = z[0]; m[6] = z[1]; m[10] = z[2]
    m[12] = -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2])
    m[13] = -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2])
    m[14] = -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2])
    return m
  },
  rotY(a: number): M4 {
    const m = m4.ident()
    const c = Math.cos(a), s = Math.sin(a)
    m[0] = c; m[8] = s; m[2] = -s; m[10] = c
    return m
  },
  rotZ(a: number): M4 {
    const m = m4.ident()
    const c = Math.cos(a), s = Math.sin(a)
    m[0] = c; m[4] = -s; m[1] = s; m[5] = c
    return m
  },
  rotX(a: number): M4 {
    const m = m4.ident()
    const c = Math.cos(a), s = Math.sin(a)
    m[5] = c; m[9] = -s; m[6] = s; m[10] = c
    return m
  },
  trans(x: number, y: number, z: number): M4 {
    const m = m4.ident()
    m[12] = x; m[13] = y; m[14] = z
    return m
  },
  scale(x: number, y: number, z: number): M4 {
    const m = m4.ident()
    m[0] = x; m[5] = y; m[10] = z
    return m
  },
  normal3(m: M4): Float32Array {
    // model matrices here are rotation (+ uniform scale / mirror): upper 3×3, renormalised
    const o = new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]])
    return o
  },
}
function cross3(a: number[], b: number[]) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}
function norm3(a: number[]) {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s)
      gl.deleteShader(s)
      throw new Error('Shader compile failed: ' + log)
    }
    return s
  }
  const p = gl.createProgram()!
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs))
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Link failed: ' + gl.getProgramInfoLog(p))
  const uniforms = new Map<string, WebGLUniformLocation | null>()
  const u = (name: string) => {
    if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(p, name))
    return uniforms.get(name)!
  }
  return { p, u }
}

interface GpuMesh {
  vao: WebGLVertexArrayObject
  count: number
  part: PartId
}

function upload(gl: WebGL2RenderingContext, mesh: MeshData, part: PartId): GpuMesh {
  const vao = gl.createVertexArray()!
  gl.bindVertexArray(vao)
  const buf = (data: Float32Array, loc: number, size: number) => {
    const b = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
  }
  buf(mesh.positions, 0, 3)
  buf(mesh.normals, 1, 3)
  buf(mesh.uvs, 2, 2)
  const ib = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
  gl.bindVertexArray(null)
  return { vao, count: mesh.indices.length, part }
}

export interface ConduitHeroOptions {
  /** called ~10×/s with the current heading in degrees (0–360) */
  onAzimuth?: (deg: number) => void
  /** called once the first frame has been drawn */
  onReady?: () => void
  /** called if WebGL2 is unavailable or the context is lost */
  onError?: (err: unknown) => void
  reducedMotion?: boolean
}

export function mountConduitHero(canvas: HTMLCanvasElement, opts: ConduitHeroOptions = {}): () => void {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true })
  if (!gl) {
    opts.onError?.(new Error('WebGL2 unavailable'))
    return () => {}
  }

  let shoeProg: ReturnType<typeof compile>
  let floorProg: ReturnType<typeof compile>
  let meshes: GpuMesh[]
  try {
    shoeProg = compile(gl, SHOE_VS, SHOE_FS)
    floorProg = compile(gl, FLOOR_VS, FLOOR_FS)
    meshes = buildShoe().map((s) => upload(gl, s.mesh, s.part))
  } catch (err) {
    opts.onError?.(err)
    return () => {}
  }

  // floor quad
  const floorVao = gl.createVertexArray()!
  gl.bindVertexArray(floorVao)
  const fb = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, fb)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-3, -3, 3, -3, 3, 3, -3, -3, 3, 3, -3, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.bindVertexArray(null)

  const reduced = !!opts.reducedMotion
  const BASE_SPEED = reduced ? 0 : 0.42 // rad/s
  let yaw = reduced ? -0.55 : -2.2
  let vel = reduced ? 0 : 5.5 // intro whip-spin
  let dragging = false
  let lastX = 0
  let lastMoveT = 0
  let dragVel = 0
  let raf = 0
  let running = false
  let visible = true
  let disposed = false
  let lastT = performance.now()
  const t0 = lastT
  let lastAz = 0
  let ready = false

  /* ---------- sizing ---------- */
  let W = 1, H = 1
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = canvas.getBoundingClientRect()
    W = Math.max(1, Math.round(r.width * dpr))
    H = Math.max(1, Math.round(r.height * dpr))
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W
      canvas.height = H
    }
    if (!running) draw(performance.now())
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  /* ---------- interaction ---------- */
  const onDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    lastMoveT = performance.now()
    dragVel = 0
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = 'grabbing'
  }
  const onMove = (e: PointerEvent) => {
    if (!dragging) return
    const now = performance.now()
    const dx = e.clientX - lastX
    const dt = Math.max(1, now - lastMoveT) / 1000
    const w = canvas.getBoundingClientRect().width || 1
    const dYaw = (dx / w) * Math.PI * 2.2
    yaw += dYaw
    dragVel = dragVel * 0.6 + (dYaw / dt) * 0.4
    lastX = e.clientX
    lastMoveT = now
    if (!running) draw(now)
  }
  const onUp = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    vel = Math.max(-9, Math.min(9, dragVel))
    try { canvas.releasePointerCapture(e.pointerId) } catch { /* noop */ }
    canvas.style.cursor = 'grab'
    start()
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.style.cursor = 'grab'
  canvas.style.touchAction = 'pan-y'

  /* ---------- visibility ---------- */
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
  })
  io.observe(canvas)
  const onVis = () => { if (!document.hidden) start() }
  document.addEventListener('visibilitychange', onVis)

  const onLost = (e: Event) => {
    e.preventDefault()
    stop()
    opts.onError?.(new Error('WebGL context lost'))
  }
  canvas.addEventListener('webglcontextlost', onLost)

  /* ---------- render ---------- */
  function draw(now: number) {
    if (!gl || disposed) return
    const dt = Math.min(0.05, (now - lastT) / 1000)
    lastT = now
    const time = (now - t0) / 1000

    if (!dragging) {
      vel += (BASE_SPEED - vel) * (1 - Math.exp(-dt * 1.6))
      yaw += vel * dt
    }

    const aspect = W / H
    const fov = (30 * Math.PI) / 180
    const halfV = 1.2
    const dist = Math.max(halfV / Math.tan(fov / 2), 1.75 / (Math.tan(fov / 2) * aspect))
    const pitch = 0.2
    const target = [0, 0.52, 0]
    const eye = [0, target[1] + Math.sin(pitch) * dist, Math.cos(pitch) * dist]
    const view = m4.lookAt(eye, target, [0, 1, 0])
    const proj = m4.persp(fov, aspect, 0.1, 50)
    const vp = m4.mul(proj, view)

    const bob = reduced ? 0 : Math.sin(time * 1.15) * 0.045
    const lift = 0.24 + bob
    const intro = reduced ? 1 : 1 - Math.exp(-time * 2.2)
    const s = 0.9 + 0.1 * intro
    const model = m4.mul(
      m4.trans(0, lift, 0),
      m4.mul(
        m4.rotY(yaw),
        m4.mul(
          m4.rotZ(-0.05 + (reduced ? 0 : Math.sin(time * 0.7) * 0.03)),
          m4.mul(m4.rotX(reduced ? 0 : Math.sin(time * 0.9) * 0.02), m4.scale(s, s, s)),
        ),
      ),
    )
    const mirror = m4.mul(m4.scale(1, -1, 1), model)

    // scan sweep every 7s
    const phase = time % 7
    const scan = reduced ? -10 : phase < 2.4 ? -0.05 + (phase / 2.4) * 1.3 : -10

    gl.viewport(0, 0, W, H)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.disable(gl.CULL_FACE)

    const drawShoe = (m: M4, isMirror: boolean) => {
      gl.useProgram(shoeProg.p)
      gl.uniformMatrix4fv(shoeProg.u('uModel'), false, m)
      gl.uniformMatrix4fv(shoeProg.u('uViewProj'), false, vp)
      gl.uniformMatrix3fv(shoeProg.u('uNrmMat'), false, m4.normal3(m))
      gl.uniform3f(shoeProg.u('uCam'), eye[0], eye[1], eye[2])
      gl.uniform1f(shoeProg.u('uTime'), time)
      gl.uniform1f(shoeProg.u('uScan'), isMirror ? -10 : scan)
      gl.uniform1f(shoeProg.u('uMirror'), isMirror ? 1 : 0)
      for (const mesh of meshes) {
        gl.uniform1i(shoeProg.u('uPart'), mesh.part)
        gl.bindVertexArray(mesh.vao)
        gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_INT, 0)
      }
    }

    // 1. reflection
    gl.enable(gl.DEPTH_TEST)
    drawShoe(mirror, true)
    // 2. floor HUD + contact shadow
    gl.disable(gl.DEPTH_TEST)
    gl.useProgram(floorProg.p)
    gl.uniformMatrix4fv(floorProg.u('uViewProj'), false, vp)
    gl.uniform1f(floorProg.u('uYaw'), yaw)
    gl.uniform1f(floorProg.u('uTime'), time)
    gl.uniform1f(floorProg.u('uLift'), lift - 0.2)
    gl.bindVertexArray(floorVao)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    // 3. the shoe
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.DEPTH_BUFFER_BIT)
    drawShoe(model, false)
    gl.bindVertexArray(null)

    if (now - lastAz > 100) {
      lastAz = now
      const deg = (((yaw * 180) / Math.PI) % 360 + 360) % 360
      opts.onAzimuth?.(deg)
    }
    if (!ready) {
      ready = true
      opts.onReady?.()
    }
  }

  function frame(now: number) {
    if (!running) return
    draw(now)
    const settled = reduced && Math.abs(vel) < 0.002 && !dragging
    if (!visible || document.hidden || settled) {
      running = false
      return
    }
    raf = requestAnimationFrame(frame)
  }
  function start() {
    if (running || disposed) return
    running = true
    lastT = performance.now()
    raf = requestAnimationFrame(frame)
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  resize()
  start()

  return () => {
    disposed = true
    stop()
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onUp)
    canvas.removeEventListener('webglcontextlost', onLost)
    // Free GPU buffers but keep the context alive: React StrictMode re-mounts
    // on the same <canvas>, and a lost context can't be re-acquired.
    for (const m of meshes) gl.deleteVertexArray(m.vao)
    gl.deleteVertexArray(floorVao)
    gl.deleteProgram(shoeProg.p)
    gl.deleteProgram(floorProg.p)
  }
}
