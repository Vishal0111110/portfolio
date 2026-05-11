'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Points, PointMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'

// Nothing OS-inspired color palette with signature red accent
const MONOCHROME_COLORS = {
  white: '#ffffff',
  offWhite: '#f5f5f5',
  lightGray: '#4a4a4a',
  mediumGray: '#2a2a2a',
  accentGray: '#888888',
  nothingRed: '#ff0000',
}

// Minimal animation
const ANIMATION_SPEED = 0.02

function AnimatedFormula({ text, position: initialPosition, index, isVisible }: { 
  text: string; 
  position: [number, number, number]; 
  index: number;
  isVisible: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Very subtle floating with minimal movement
  const [position, setPosition] = useState(initialPosition)

  useFrame((state) => {
    if (!isVisible) return
    
    const time = state.clock.elapsedTime * ANIMATION_SPEED
    // Very minimal floating motion
    const xOffset = Math.sin(time * 0.1) * 0.15
    const yOffset = Math.cos(time * 0.08) * 0.1
    setPosition([initialPosition[0] + xOffset, initialPosition[1] + yOffset, initialPosition[2]])

    if (ref.current) {
      ref.current.style.transform = `translate(-50%, -50%)`
    }
  })

  return (
    <Html
      position={position}
      ref={ref}
      style={{
        color: index === 0 ? MONOCHROME_COLORS.nothingRed : MONOCHROME_COLORS.accentGray,
        fontSize: '0.7rem',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontWeight: index === 0 ? '600' : '400',
        textAlign: 'center',
        width: 'auto',
        minWidth: '100px',
        userSelect: 'none',
        opacity: index === 0 ? 0.6 : 0.4,
        letterSpacing: '0.1em',
      }}
    >
      {text}
    </Html>
  )
}

function NetworkMesh({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Group>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const icosahedronRef = useRef<THREE.Mesh>(null)

  // Generate sophisticated particle distribution with subtle details
  const positionsData = useMemo(() => {
    const numPoints = 600 // Optimized for subtle detail
    const positions = new Float32Array(numPoints * 3)
    const colors = new Float32Array(numPoints * 3)
    const sizes = new Float32Array(numPoints)

    for (let i = 0; i < numPoints; i++) {
      // Create more interesting distribution patterns
      const angle = (i / numPoints) * Math.PI * 2
      const radius = 3 + Math.random() * 12
      const height = (Math.random() - 0.5) * 8
      
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2
      
      // Sophisticated color distribution
      const rand = Math.random()
      if (rand < 0.03) {
        // Rare red accent particles
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.2
        colors[i * 3 + 2] = 0.2
        sizes[i] = 0.12
      } else if (rand < 0.08) {
        // Bright white accents
        colors[i * 3] = 0.9
        colors[i * 3 + 1] = 0.9
        colors[i * 3 + 2] = 0.9
        sizes[i] = 0.10
      } else {
        // Subtle gray variations
        const gray = 0.25 + Math.random() * 0.15
        colors[i * 3] = gray
        colors[i * 3 + 1] = gray
        colors[i * 3 + 2] = gray
        sizes[i] = 0.06 + Math.random() * 0.04
      }
    }

    return { positions, colors, sizes }
  }, [])

  // No formulas - clean background

  useFrame((state) => {
    if (!isVisible) return
    
    const time = state.clock.elapsedTime * ANIMATION_SPEED

    // Very slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.02
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Sophisticated particle system with size variations */}
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

      
      {/* Single simple wireframe - much cleaner */}
      <mesh ref={torusRef} position={[0, 0, -3]}>
        <torusGeometry args={[2.5, 0.1, 8, 16]} />
        <meshBasicMaterial color={MONOCHROME_COLORS.mediumGray} wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function Background() {
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intersection Observer to pause animations when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

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
        pointerEvents: 'none'
      }}
    >
      {/* Simple dot matrix pattern - very subtle */}
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
          antialias: false, // Disabled for performance
          alpha: true,
          powerPreference: 'low-power' // Battery-friendly
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
        frameloop={isVisible ? 'always' : 'never'} // Pause when off-screen
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <NetworkMesh isVisible={isVisible} />
      </Canvas>
    </div>
  )
}

export default Background
