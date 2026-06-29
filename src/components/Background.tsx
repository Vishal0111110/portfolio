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

const NUM_STARS = 4250
const FIELD_Z_FAR = -60
const FIELD_Z_NEAR = 20
const FIELD_WIDTH = 200
const FIELD_HEIGHT = 120
const IDLE_DRIFT = 0.3
const MAX_WARP_SPEED = 15

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

function randomFieldPosition(positions: Float32Array, i: number, zMin: number, zRange: number) {
  positions[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH
  positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HEIGHT
  positions[i * 3 + 2] = zMin + Math.random() * zRange
}

function buildStarfield(): StarfieldData {
  const positions = new Float32Array(NUM_STARS * 3)
  const colors = new Float32Array(NUM_STARS * 3)
  const baseSizes = new Float32Array(NUM_STARS)
  const zRange = FIELD_Z_NEAR - FIELD_Z_FAR

  for (let i = 0; i < NUM_STARS; i++) {
    randomFieldPosition(positions, i, FIELD_Z_FAR, zRange)

    const rand = Math.random()
    if (rand < 0.05) {
      colors[i * 3] = 1
      colors[i * 3 + 1] = Math.min(0.3 * 1.5 * 1.4, 1)
      colors[i * 3 + 2] = Math.min(0.3 * 1.5 * 1.4, 1)
      baseSizes[i] = 5.5 * 1.4
    } else if (rand < 0.12) {
      colors[i * 3] = 1
      colors[i * 3 + 1] = 1
      colors[i * 3 + 2] = 1
      baseSizes[i] = 4.5 * 1.4
    } else {
      const gray = Math.min((0.35 + Math.random() * 0.25) * 1.5 * 1.4, 1)
      colors[i * 3] = gray
      colors[i * 3 + 1] = gray
      colors[i * 3 + 2] = gray
      baseSizes[i] = (3.0 + Math.random() * 1.5) * 1.4
    }
  }

  return { positions, colors, baseSizes, sizes: baseSizes.slice() }
}

function respawnStar(positions: Float32Array, i: number, atFarEnd: boolean) {
  positions[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH
  positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HEIGHT
  positions[i * 3 + 2] = atFarEnd
    ? FIELD_Z_FAR + Math.random() * 12
    : FIELD_Z_NEAR - Math.random() * 8
}

function depthFactor(z: number): number {
  const t = (z - FIELD_Z_FAR) / (FIELD_Z_NEAR - FIELD_Z_FAR)
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
    const radialDrift = warpSpeed * 0.02

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

      // Mild radial drift keeps the field feeling like a hyperspace tunnel at speed.
      if (radialDrift > 0) {
        const distance = Math.sqrt(x * x + y * y)
        const driftFactor = Math.min(distance / 90, 1)
        const driftX = (x / (Math.abs(x) + 1e-4)) * radialDrift * driftFactor
        const driftY = (y / (Math.abs(y) + 1e-4)) * radialDrift * driftFactor
        x += driftX * dt * 8
        y += driftY * dt * 8
      }

      // Warp drive: stars always respawn at far end to maintain forward flow
      if (z > FIELD_Z_NEAR) {
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
      const depthFactor = (z - FIELD_Z_FAR) / (FIELD_Z_NEAR - FIELD_Z_FAR)
      const depthStretch = 0.3 + depthFactor * 2.5
      const warpStretch = 1 + warpSpeed * 3.0
      sizes[i] = baseSizes[i] * depthStretch * warpStretch
      
      // Depth-based intensity - particles get brighter as they approach viewer
      const intensityBoost = 1 + depthFactor * 0.8
      colors[i3] = Math.min(colors[i3] * intensityBoost, 1)
      colors[i3 + 1] = Math.min(colors[i3 + 1] * intensityBoost, 1)
      colors[i3 + 2] = Math.min(colors[i3 + 2] * intensityBoost, 1)
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
        opacity={1.0}
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
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
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
        <StarfieldTunnel
          isVisible={isVisible}
          motionAllowed={motionAllowed}
          scrollVelocity={scrollVelocity}
        />
      </Canvas>
    </div>
  )
}
