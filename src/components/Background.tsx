'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState } from 'react'
import { Points, PointMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedFormula({ text, position: initialPosition, index }: { text: string; position: [number, number, number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition)

  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.75
    const t = time + index * 0.8
    // Lemniscate (infinity) path for unique motion
    const xOffset = Math.sin(t * 0.6) * Math.cos(t * 0.3) * 2
    const yOffset = Math.sin(t * 0.7) * Math.sin(t * 0.4) * 1.5
    const zOffset = Math.cos(t * 0.5) * 1.2
    const newZ = initialPosition[2] + zOffset
    setPosition([initialPosition[0] + xOffset, initialPosition[1] + yOffset, newZ])

    // Fade based on depth
    const newOpacity = Math.max(0.3, 0.8 - Math.abs(newZ) * 0.15)

    if (ref.current) {
      ref.current.style.opacity = `${newOpacity}`
      ref.current.style.transform = `translate(-50%, -50%)`
    }
  })

  const colors = ['#ffffff', '#d1d5db', '#a78bfa', '#10b981', '#93c5fd', '#67e8f9']

  return (
    <Html
      position={position}
      ref={ref}
      style={{
        color: colors[index % colors.length],
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        fontWeight: '600',
        textAlign: 'center',
        width: 'auto',
        minWidth: '140px',
        userSelect: 'none',
        opacity: 0.8
      }}
    >
      {text}
    </Html>
  )
}

function NetworkMesh() {
  const meshRef = useRef<THREE.Group>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const octahedronRef = useRef<THREE.Mesh>(null)
  const tetrahedronRef = useRef<THREE.Mesh>(null)

  const speed = 0.75

  // Generate network points spread across full space
  const positions = useMemo(() => {
    const numPoints = 1500
    const positions = new Float32Array(numPoints * 3)

    for (let i = 0; i < numPoints; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40     // x: -20 to 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40    // y: -20 to 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20    // z: -10 to 10
    }

    return positions
  }, [])

  // Mathematical formulas
  const formulas = useMemo(() => [
    'DP', 'O(nlog(n))', 'Graph Theory', 'φ=1.618',
    'Binary Search', 'O(log n)', 'Segment Trees', 'a≡b(mod m)','KMP',
     'Game Theory', 'Binary Lifting', 
     'Frenwick Trees', 
    'Convex Hull','π = 3.141', 'DSU', 'Sieve ', 'Probability', 'Combinatorics', 'Minkowski Sum', 'Line Sweep',
    'Greedy',
  ], [])

  // Place formulas symmetrically around the edges, avoiding center collisions
  const formulaPositions = useMemo(() => [
    // Top and bottom pairs
    [-17, 14, 0], [17, 14, 0], [-17, -14, 0], [17, -14, 0],
    [-10, 14, 0], [10, 14, 0], [-10, -14, 0], [10, -14, 0],
    [0, 14, 0], [0, -14, 0],
    // Left and right pairs
    [-20, 10, 0], [20, 10, 0], [-20, -10, 0], [20, -10, 0],
    [-20, 0, 0], [20, 0, 0],
    // Upper corners
    [-15, 12, 0], [15, 12, 0],
    // Lower corners
    [-15, -8, 0], [15, -8, 0],
    // Additional symmetric spots
    [-12, 8, 0], [12, 8, 0], [-12, -8, 0], [12, -8, 0]
  ], [])

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed

    // Very visible rotations
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.25
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 4
      torusRef.current.rotation.y = time * 3
    }
    if (octahedronRef.current) {
      octahedronRef.current.rotation.x = time * 6
      octahedronRef.current.rotation.y = time * 5
    }
    if (tetrahedronRef.current) {
      tetrahedronRef.current.rotation.z = time * 7
      tetrahedronRef.current.rotation.x = time * 8
    }

  })

  return (
    <group ref={meshRef}>
      {/* Network points spread across full screen */}
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#a855f7"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={false}
        />
      </Points>

      {/* Mathematical formulas spread across full screen */}
      {formulas.map((text, index) => (
        <AnimatedFormula
          key={index}
          text={text}
          position={formulaPositions[index] as [number, number, number]}
          index={index}
        />
      ))}

      {/* Large visible geometric shapes */}
      <mesh ref={torusRef} position={[0, 0, -3]}>
        <torusGeometry args={[2.5, 0.2, 8, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
      </mesh>

      <mesh ref={octahedronRef} position={[4, 3, -2]}>
        <octahedronGeometry args={[1]} />
        <meshBasicMaterial color="#a78bfa" wireframe />
      </mesh>

      <mesh ref={tetrahedronRef} position={[-4, -3, -1]}>
        <tetrahedronGeometry args={[1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe />
      </mesh>


    </group>
  )
}

function Background() {
  return (
    <div
      className="fixed inset-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,  // Proper background positioning
        pointerEvents: 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -10
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <NetworkMesh />
      </Canvas>
    </div>
  )
}

export default Background
