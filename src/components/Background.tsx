'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect, useLayoutEffect, type MutableRefObject } from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

import { useBackgroundMotionAllowed } from '@/hooks/useBackgroundMotionAllowed'
import { useScrollVelocity, type ScrollVelocityState } from '@/hooks/useScrollVelocity'

const FOG_COLOR = '#0a0a0a'
const CAMERA_Z = 12
const BASE_FOV = 70
const MAX_FOV = 78

const NUM_STARS = 350
const TUNNEL_Z_FAR = -80
const TUNNEL_Z_NEAR = 24
const TUNNEL_RADIUS = 18
const IDLE_DRIFT = 0.04
const MAX_WARP_SPEED = 8
const RADIAL_STREAK = 0
const WARP_CHATTER = 0.003

const MONOCHROME_COLORS = {
  mediumGray: '#2a2a2a',
  dimGray: '#1a1a1a',
}

interface StarfieldData {
  positions: Float32Array
  colors: Float32Array
  baseSizes: Float32Array
  sizes: Float32Array
}

function randomTunnelPosition(positions: Float32Array, i: number, zMin: number, zRange: number) {
  const theta = Math.random() * Math.PI * 2
  const r = Math.pow(Math.random(), 2.5) * TUNNEL_RADIUS
  positions[i * 3] = Math.cos(theta) * r
  positions[i * 3 + 1] = Math.sin(theta) * r * 0.55
  positions[i * 3 + 2] = zMin + Math.random() * zRange
}

function buildStarfield(): StarfieldData {
  const positions = new Float32Array(NUM_STARS * 3)
  const colors = new Float32Array(NUM_STARS * 3)
  const baseSizes = new Float32Array(NUM_STARS)
  const zRange = TUNNEL_Z_NEAR - TUNNEL_Z_FAR

  for (let i = 0; i < NUM_STARS; i++) {
    randomTunnelPosition(positions, i, TUNNEL_Z_FAR, zRange)

    const rand = Math.random()
    if (rand < 0.03) {
      colors[i * 3] = 1
      colors[i * 3 + 1] = 0.2
      colors[i * 3 + 2] = 0.2
      baseSizes[i] = 3.0
    } else if (rand < 0.08) {
      colors[i * 3] = 0.95
      colors[i * 3 + 1] = 0.95
      colors[i * 3 + 2] = 0.95
      baseSizes[i] = 2.4
    } else {
      const gray = 0.22 + Math.random() * 0.18
      colors[i * 3] = gray
      colors[i * 3 + 1] = gray
      colors[i * 3 + 2] = gray
      baseSizes[i] = 1.5 + Math.random() * 0.9
    }
  }

  return { positions, colors, baseSizes, sizes: baseSizes.slice() }
}

function respawnStar(positions: Float32Array, i: number, atFarEnd: boolean) {
  const theta = Math.random() * Math.PI * 2
  const r = Math.sqrt(Math.random()) * TUNNEL_RADIUS * (0.15 + Math.random() * 0.85)
  positions[i * 3] = Math.cos(theta) * r
  positions[i * 3 + 1] = Math.sin(theta) * r * 0.55
  positions[i * 3 + 2] = atFarEnd
    ? TUNNEL_Z_FAR + Math.random() * 18
    : TUNNEL_Z_NEAR - Math.random() * 12
}

function depthFactor(z: number): number {
  const t = (z - TUNNEL_Z_FAR) / (TUNNEL_Z_NEAR - TUNNEL_Z_FAR)
  return THREE.MathUtils.clamp(t, 0, 1)
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** One repaint when Canvas is demand-only so the static scene stays visible */
function InvalidateOnceStatic() {
  const { invalidate } = useThree()
  useLayoutEffect(() => {
    invalidate()
  }, [invalidate])
  return null
}

function WarpCamera({
  motionAllowed,
  scrollVelocity,
}: {
  motionAllowed: boolean
  scrollVelocity: MutableRefObject<ScrollVelocityState>
}) {
  const fovRef = useRef(BASE_FOV)
  const shakeSeed = useRef(Math.random() * 100)

  useFrame(({ camera }, delta) => {
    camera.position.set(0, 0, CAMERA_Z)
    camera.rotation.set(0, 0, 0)

    if (!motionAllowed || !(camera instanceof THREE.PerspectiveCamera)) return

    const { warpSpeed } = scrollVelocity.current
    const targetFov = BASE_FOV + warpSpeed * (MAX_FOV - BASE_FOV)
    fovRef.current += (targetFov - fovRef.current) * 0.06

    if (Math.abs(camera.fov - fovRef.current) > 0.05) {
      camera.fov = fovRef.current
      camera.updateProjectionMatrix()
    }

    // Subtle camera chatter at high warp speeds for hyperspace feel
    if (warpSpeed > 0.4) {
      const chatterIntensity = (warpSpeed - 0.4) * 0.015
      const time = performance.now() * 0.001
      camera.position.x = (Math.sin(time * 23 + shakeSeed.current) * chatterIntensity +
                           Math.cos(time * 17 + shakeSeed.current) * chatterIntensity * 0.5)
      camera.position.y = (Math.cos(time * 19 + shakeSeed.current) * chatterIntensity +
                           Math.sin(time * 13 + shakeSeed.current) * chatterIntensity * 0.5)
    }
  })

  return null
}

function TimeTunnelRings({
  isVisible,
  motionAllowed,
  scrollVelocity,
}: {
  isVisible: boolean
  motionAllowed: boolean
  scrollVelocity: MutableRefObject<ScrollVelocityState>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state, delta) => {
    if (!isVisible || !motionAllowed || !groupRef.current) return

    const { warpSpeed } = scrollVelocity.current
    const time = state.clock.elapsedTime
    const calm = 1 - Math.min(warpSpeed * 1.4, 0.92)

    groupRef.current.rotation.z = time * 0.04 * calm
    groupRef.current.rotation.x = Math.sin(time * 0.07) * 0.08 * calm

    ringRefs.current.forEach((ring, idx) => {
      if (!ring?.material || !(ring.material instanceof THREE.MeshBasicMaterial)) return
      ring.rotation.z = time * (0.06 + idx * 0.02) * (idx % 2 === 0 ? 1 : -1)
      ring.material.opacity = 0.08 + calm * 0.28
      ring.scale.setScalar(1 + warpSpeed * 0.06 * (idx + 1))
    })
  })

  const rings = useMemo(
    () => [
      { z: -22, radius: 3.2, tube: 0.07 },
      { z: -38, radius: 5.4, tube: 0.05 },
      { z: -58, radius: 8.2, tube: 0.04 },
    ],
    []
  )

  return (
    <group ref={groupRef}>
      {rings.map((ring, idx) => (
        <mesh
          key={ring.z}
          ref={(el) => {
            ringRefs.current[idx] = el
          }}
          position={[0, 0, ring.z]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <torusGeometry args={[ring.radius, ring.tube, 10, 48]} />
          <meshBasicMaterial
            color={idx === 0 ? MONOCHROME_COLORS.mediumGray : MONOCHROME_COLORS.dimGray}
            wireframe
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function StarfieldTunnel({
  isVisible,
  motionAllowed,
  scrollVelocity,
}: {
  isVisible: boolean
  motionAllowed: boolean
  scrollVelocity: MutableRefObject<ScrollVelocityState>
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const starfield = useMemo(() => buildStarfield(), [])
  const positionsRef = useRef(starfield.positions)
  const sizesRef = useRef(starfield.sizes)
  const colorsRef = useRef(starfield.colors)

  useFrame((_, delta) => {
    if (!isVisible || !motionAllowed) return

    const points = pointsRef.current
    if (!points?.geometry) return

    const dt = Math.min(delta, 0.04)
    const { warpSpeed } = scrollVelocity.current
    // Warp drive: stars always flow toward viewer, scroll speed controls intensity
    const travelSpeed = IDLE_DRIFT + warpSpeed * MAX_WARP_SPEED
    const streak = warpSpeed * RADIAL_STREAK * dt

    const positions = positionsRef.current
    const sizes = sizesRef.current
    const colors = colorsRef.current
    const { baseSizes } = starfield

    for (let i = 0; i < NUM_STARS; i++) {
      const i3 = i * 3
      let x = positions[i3]
      let y = positions[i3 + 1]
      let z = positions[i3 + 2]

      z += travelSpeed * dt

      // No radial streak - keep stars as visible dots at all speeds
      // This prevents stars from appearing as thin lines when moving fast

      // Warp drive: stars always respawn at far end to maintain forward flow
      if (z > TUNNEL_Z_NEAR) {
        respawnStar(positions, i, true)
        x = positions[i3]
        y = positions[i3 + 1]
        z = positions[i3 + 2]
      } else {
        positions[i3] = x
        positions[i3 + 1] = y
        positions[i3 + 2] = z
      }

      // Depth-based sizing - particles grow larger as they approach viewer
      const depthFactor = (z - TUNNEL_Z_FAR) / (TUNNEL_Z_NEAR - TUNNEL_Z_FAR)
      const depthStretch = 0.5 + depthFactor * 1.5
      const warpStretch = 1 + warpSpeed * 3.0
      sizes[i] = baseSizes[i] * depthStretch * warpStretch
    }

    const posAttr = points.geometry.attributes.position
    const sizeAttr = points.geometry.attributes.size
    const colorAttr = points.geometry.attributes.color
    if (posAttr) posAttr.needsUpdate = true
    if (sizeAttr) sizeAttr.needsUpdate = true
    if (colorAttr) colorAttr.needsUpdate = true
  })

  return (
    <Points
      ref={pointsRef}
      positions={positionsRef.current}
      colors={colorsRef.current}
      sizes={sizesRef.current}
      stride={3}
    >
      <PointMaterial
        transparent
        size={2.7}
        sizeAttenuation={false}
        depthWrite={false}
        vertexColors
        opacity={0.94}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function Background() {
  const motionAllowed = useBackgroundMotionAllowed()
  const scrollVelocity = useScrollVelocity(motionAllowed)
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 })

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const frameLoop = !isVisible ? 'never' : motionAllowed ? 'always' : 'demand'

  return (
    <div
      ref={containerRef}
      className="fixed inset-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          zIndex: 0,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: BASE_FOV, near: 0.1, far: 120 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        frameloop={frameLoop}
      >
        <fog attach="fog" args={[FOG_COLOR, 18, 68]} />

        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 8]} intensity={0.35} />

        {isVisible && !motionAllowed ? <InvalidateOnceStatic /> : null}
        <WarpCamera motionAllowed={motionAllowed} scrollVelocity={scrollVelocity} />
        <TimeTunnelRings
          isVisible={isVisible}
          motionAllowed={motionAllowed}
          scrollVelocity={scrollVelocity}
        />
        <StarfieldTunnel
          isVisible={isVisible}
          motionAllowed={motionAllowed}
          scrollVelocity={scrollVelocity}
        />
      </Canvas>
    </div>
  )
}
