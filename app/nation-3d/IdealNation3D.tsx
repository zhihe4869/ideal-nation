'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Line } from '@react-three/drei'
import * as THREE from 'three'

function FloatingFragment({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </Float>
  )
}

function AvatarNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  )
}

function ConnectionLines() {
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const radius = 5
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }
    pts.push(pts[0])
    return pts
  }, [])

  return (
    <Line points={points} color="#8b5cf6" lineWidth={1} opacity={0.3} transparent />
  )
}

export function IdealNation3D() {
  const fragmentColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
  const avatarColors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

  return (
    <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <CentralCore />

      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 4
        return (
          <FloatingFragment
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(i * 0.5) * 2, Math.sin(angle) * radius]}
            color={fragmentColors[i]}
            label={`Fragment ${i + 1}`}
          />
        )
      })}

      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 6 + Math.random() * 2
        const height = (Math.random() - 0.5) * 4
        return (
          <AvatarNode
            key={i}
            position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
            color={avatarColors[i % avatarColors.length]}
          />
        )
      })}

      <ConnectionLines />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />
    </Canvas>
  )
}
