'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

import { useBackgroundMotionAllowed } from '@/hooks/useBackgroundMotionAllowed'

const MONOCHROME_COLORS = {
  mediumGray: '#2a2a2a',
}

const ANIMATION_SPEED = 0.02

/** One repaint when Canvas is demand-only so the static scene stays visible */
function InvalidateOnceStatic() {
  const { invalidate } = useThree()
  useLayoutEffect(() => {
    invalidate()
  }, [invalidate])
  return null
}

function NetworkMesh({ isVisible, motionAllowed }: { isVisible: boolean; motionAllowed: boolean }) {
  const meshRef = useRef<THREE.Group>(null)
  const torusRef = useRef<THREE.Mesh>(null)

  const positionsData = useMemo(() => {
    const numPoints = 600
    const positions = new Float32Array(numPoints * 3)
    const colors = new Float32Array(numPoints * 3)
    const sizes = new Float32Array(numPoints)

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      const radius = 3 + Math.random() * 12
      const height = (Math.random() - 0.5) * 8

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2

      const rand = Math.random()
      if (rand < 0.03) {
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.2
        colors[i * 3 + 2] = 0.2
        sizes[i] = 0.12
      } else if (rand < 0.08) {
        colors[i * 3] = 0.9
        colors[i * 3 + 1] = 0.9
        colors[i * 3 + 2] = 0.9
        sizes[i] = 0.1
      } else {
        const gray = 0.25 + Math.random() * 0.15
        colors[i * 3] = gray
        colors[i * 3 + 1] = gray
        colors[i * 3 + 2] = gray
        sizes[i] = 0.06 + Math.random() * 0.04
      }
    }

    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (!isVisible || !motionAllowed) return

    const time = state.clock.elapsedTime * ANIMATION_SPEED

    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.02
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      <Points positions={positionsData.positions} colors={positionsData.colors} sizes={positionsData.sizes} stride={3}>
        <PointMaterial
          transparent
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <mesh ref={torusRef} position={[0, 0, -3]}>
        <torusGeometry args={[2.5, 0.1, 8, 16]} />
        <meshBasicMaterial color={MONOCHROME_COLORS.mediumGray} wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export default function Background() {
  const motionAllowed = useBackgroundMotionAllowed()
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
        camera={{ position: [0, 0, 12], fov: 70 }}
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
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {isVisible && !motionAllowed ? <InvalidateOnceStatic /> : null}
        <NetworkMesh isVisible={isVisible} motionAllowed={motionAllowed} />
      </Canvas>
    </div>
  )
}
