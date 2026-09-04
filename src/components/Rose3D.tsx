import { useEffect, useRef } from "react"
import * as THREE from "three"
import { rosePoint, T_MAX, T_MIN } from "@/lib/rose"
import { DEFAULT_ACCENT } from "@/lib/tracks"

const U_SEG = 44 // resolución radial del pétalo
const V_SEG = 1200 // resolución angular — el festón viene de un mod discontinuo, necesita densidad
const FOV = 40
const WHITE = new THREE.Color(0xffffff)
const TMP = new THREE.Color()

function buildRoseGeometry() {
  const pos: number[] = []
  const col: number[] = []
  const idx: number[] = []
  // Rampa de luminancia neutra: oscura en el eje del pétalo, clara en el filo.
  // El tono lo aporta `material.color`, que multiplica estos valores — así el
  // cambio de canción es un lerp de un único color en vez de rehacer la malla.

  for (let i = 0; i <= V_SEG; i++) {
    const v = T_MIN + (T_MAX - T_MIN) * (i / V_SEG)
    const depth = 1 - i / V_SEG // 0 = pétalos externos, 1 = centro cerrado
    for (let j = 0; j <= U_SEG; j++) {
      const u = j / U_SEG
      const [x, y, z] = rosePoint(u, v)
      pos.push(x, y, z)
      // Nylander colorea por u (hue((1-u)/6)): oscuro en el eje, luz en el filo.
      // El barrido θ solo aporta un extra de sombra hacia el corazón de la flor.
      const shade = 0.06 + 0.94 * u ** 1.5 * (0.55 + 0.45 * depth)
      col.push(shade, shade, shade)
    }
  }

  const row = U_SEG + 1
  for (let i = 0; i < V_SEG; i++) {
    for (let j = 0; j < U_SEG; j++) {
      const a = i * row + j
      const b = a + 1
      const c = a + row
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  g.center()
  g.computeBoundingSphere()
  return g
}

export function Rose3D({
  beating = false,
  accent = DEFAULT_ACCENT,
}: {
  beating?: boolean
  accent?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const beatRef = useRef(beating)
  beatRef.current = beating
  const accentRef = useRef(accent)
  accentRef.current = accent

  useEffect(() => {
    const host = hostRef.current!
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.98
    renderer.domElement.className = "block h-full w-full"
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100)

    const geometry = buildRoseGeometry()
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      color: new THREE.Color(accentRef.current),
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0,
      clearcoat: 0.22,
      clearcoatRoughness: 0.5,
      sheen: 0.4,
      sheenColor: new THREE.Color(accentRef.current),
      emissive: new THREE.Color(accentRef.current).multiplyScalar(0.12),
      emissiveIntensity: 0.7,
    })
    const rose = new THREE.Mesh(geometry, material)
    rose.rotation.z = 0.1
    const pivot = new THREE.Group()
    pivot.add(rose)
    scene.add(pivot)

    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    const key = new THREE.DirectionalLight(0xffffff, 1.7)
    key.position.set(2.5, 4.5, 3)
    const rim = new THREE.DirectionalLight(0xffffff, 1.4)
    rim.position.set(-4, -1.5, -3)
    const fill = new THREE.PointLight(0xffffff, 2.5, 12)
    fill.position.set(0, -1.5, 2)
    scene.add(ambient, key, rim, fill)

    // Tinte animado: todo lo que lleva color persigue al acento de la canción.
    const target = new THREE.Color(accentRef.current)
    ambient.color.copy(target)
    rim.color.copy(target)
    fill.color.copy(WHITE).lerp(target, 0.55)

    // encuadre automático a partir del radio real de la malla
    const radius = geometry.boundingSphere?.radius ?? 1.5
    const fitDist = (radius / Math.sin((FOV * Math.PI) / 360)) * 1.32

    // órbita mínima: arrastrar para girar, rueda para zoom
    let rotY = 0.6
    let rotX = 0.45
    let dist = fitDist
    let drag: { x: number; y: number } | null = null
    let auto = true
    const el = renderer.domElement
    el.style.touchAction = "none"

    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY }
      auto = false
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      rotY -= (e.clientX - drag.x) * 0.006
      rotX = Math.max(-1.2, Math.min(1.3, rotX + (e.clientY - drag.y) * 0.005))
      drag = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      drag = null
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      dist = Math.max(fitDist * 0.45, Math.min(fitDist * 2.2, dist + e.deltaY * 0.003))
    }
    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("pointerup", onUp)

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    let raf = 0
    let pulse = 0
    let t = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      t += 0.016
      if (auto) rotY += 0.0018
      rotY += 0.0009
      pulse = pulse * 0.93 + (beatRef.current ? 0.07 : 0) // respira al reproducir

      // transición suave de color al cambiar de canción
      // (un 12% hacia blanco: el acento puro se lee eléctrico sobre negro)
      target.set(accentRef.current).lerp(WHITE, 0.12)
      material.color.lerp(target, 0.05)
      material.sheenColor.lerp(target, 0.05)
      material.emissive.lerp(TMP.copy(target).multiplyScalar(0.12), 0.05)
      ambient.color.lerp(target, 0.05)
      rim.color.lerp(target, 0.05)
      fill.color.lerp(TMP.copy(WHITE).lerp(target, 0.55), 0.05)
      pivot.position.y = Math.sin(t * 0.6) * 0.06 // flotación suave
      pivot.rotation.z = Math.sin(t * 0.35) * 0.03
      const d = dist * (1 - pulse * 0.045 - Math.sin(t * 1.8) * pulse * 0.012)
      camera.position.set(
        Math.sin(rotY) * Math.cos(rotX) * d,
        Math.sin(rotX) * d,
        Math.cos(rotY) * Math.cos(rotX) * d,
      )
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("wheel", onWheel)
      window.removeEventListener("pointerup", onUp)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      el.remove()
    }
  }, [])

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden" />
}
