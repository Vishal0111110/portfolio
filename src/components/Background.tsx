'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { Points, PointMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'

// Component for animated mathematical formulas
function AnimatedFormula({ text, angle, radius, index }: { text: string; angle: number; radius: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.style.transform = `translate(-50%, -50%)`
    }
  })

  const colors = ['#ffffff', '#d1d5db', '#a78bfa', '#10b981', '#93c5fd', '#67e8f9']

  return (
    <Html
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
      ref={ref}
      style={{
        color: colors[index % colors.length],
        fontSize: '0.7rem',
        fontFamily: 'monospace',
        fontWeight: '600',
        textAlign: 'center',
        minWidth: '100px',
        userSelect: 'none',
        opacity: 0.7
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

  // Generate network points
  const positions = useMemo(() => {
    const numPoints = 125
    const positions = new Float32Array(numPoints * 3)

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const r = 6

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }

    return positions
  }, [])

  // Mathematical formulas
  const formulas = useMemo(() => [
    'DP', 'O(nlog(n))', 'Graph Theory', 'φ=1.618',
    'Binary Search', 'O(log n)', 'Segment Trees', 'a≡b(mod m)','KMP',
     'Game Theory', 'Binary Lifting', 'Frenwick Trees',
    'Convex Hull','π = 3.141', 'DSU', 'Sieve ', 'Probability', 'Combinatorics', 'Minkowski Sum', 'Line Sweep',
    'Greedy'
  ], [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

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
      {/* Network points - brighter and larger */}
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#a855f7"
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={false}
        />
      </Points>

      {/* Mathematical formulas with larger text */}
      {formulas.map((text, index) => (
        <AnimatedFormula
          key={index}
          text={text}
          angle={(index / formulas.length) * Math.PI * 2}
          radius={7}
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
