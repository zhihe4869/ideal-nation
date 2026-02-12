'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Float, Text, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'

interface Fragment3D {
  id: string
  type: 'value' | 'rule' | 'vision' | 'story'
  position: [number, number, number]
  color: string
  size: number
  strength: number
  rotation: [number, number, number]
}

interface Avatar3D {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  action: 'idle' | 'walking' | 'building' | 'interacting'
}

interface Building3D {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

interface Fragment3DProps {
  fragment: Fragment3D
  onClick?: () => void
  onHover?: (hovered: boolean) => void
}

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'value': return '#3b82f6'
    case 'rule': return '#a855f7'
    case 'vision': return '#f59e0b'
    case 'story': return '#10b981'
    default: return '#6b7280'
  }
}

const getTypeGeometry = (type: string) => {
  switch (type) {
    case 'value': return new THREE.IcosahedronGeometry(1, 2)
    case 'rule': return new THREE.BoxGeometry(1.2, 1.2, 1.2)
    case 'vision': return new THREE.ConeGeometry(0.8, 2, 4)
    case 'story': return new THREE.TorusGeometry(0.6, 0.2, 16, 32)
    default: return new THREE.SphereGeometry(1, 32, 32)
  }
}

export default function Fragment3D({ fragment, onClick, onHover }: Fragment3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const geometry = getTypeGeometry(fragment.type)
  const material = new THREE.MeshStandardMaterial({
    color: getTypeColor(fragment.type),
    emissive: getTypeColor(fragment.type),
    emissiveIntensity: fragment.strength * 0.5,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
  })

  const handlePointerOver = () => {
    setHovered(true)
    onHover?.(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover?.(false)
  }

  const handleClick = () => {
    onClick?.()
  }

  return (
    <mesh
      ref={meshRef}
      position={fragment.position}
      rotation={fragment.rotation}
      scale={fragment.size}
      geometry={geometry}
      material={material}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {hovered && (
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          distance={5}
          color={getTypeColor(fragment.type)}
        />
      )}
      <Sparkles
        count={50}
        scale={fragment.size * 2}
        size={2}
        speed={0.4}
        opacity={0.5}
      />
    </mesh>
  )
}