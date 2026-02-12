'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Grid } from '@react-three/drei'
import * as THREE from 'three'

interface Building3D {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  type: 'house' | 'tower' | 'monument' | 'factory' | 'temple'
}

interface Building3DProps {
  building: Building3D
  isSelected?: boolean
  onSelect?: () => void
  onBuild?: () => void
}

const getBuildingGeometry = (type: string) => {
  switch (type) {
    case 'house':
      return new THREE.BoxGeometry(2, 2, 2)
    case 'tower':
      return new THREE.CylinderGeometry(0.8, 0.8, 4)
    case 'monument':
      return new THREE.ConeGeometry(1.5, 1.5, 4)
    case 'factory':
      return new THREE.BoxGeometry(3, 2, 2)
    case 'temple':
      return new THREE.DodecahedronGeometry(1.5)
    default:
      return new THREE.BoxGeometry(2, 2, 2)
  }
}

const getBuildingColor = (type: string) => {
  switch (type) {
    case 'house': return '#4a90e2'
    case 'tower': return '#f59e0b'
    case 'monument': return '#f97316'
    case 'factory': return '#10b981'
    case 'temple': return '#8b5cf6'
    default: return '#6b7280'
  }
}

export default function Building3D({ building, isSelected, onSelect, onBuild }: Building3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)

  const handlePointerOver = () => {
    setHovered(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
  }

  const handleClick = () => {
    if (isBuilding) {
      setIsBuilding(false)
      onBuild?.()
    } else {
      onSelect?.()
    }
  }

  const toggleBuildMode = () => {
    setIsBuilding(!isBuilding)
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={building.position}
        rotation={building.rotation}
        scale={building.scale}
        geometry={getBuildingGeometry(building.type)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={getBuildingColor(building.type)}
          emissive={getBuildingColor(building.type)}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
          metalness={0.7}
          roughness={0.3}
          transparent={true}
          opacity={0.95}
        />
        
        {hovered && (
          <pointLight
            position={[0, 0, 0]}
            intensity={1.5}
            distance={6}
            color={getBuildingColor(building.type)}
          />
        )}
      </mesh>
      
      {isSelected && isBuilding && (
        <group position={[0, 2, 0]}>
          <mesh>
            <ringGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  )
}