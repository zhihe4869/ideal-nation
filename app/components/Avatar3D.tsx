'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarData {
  id: string
  userId: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  action: 'idle' | 'walking' | 'building' | 'interacting'
  color: string
  isOnline: boolean
  lastActivity: Date
}

interface Avatar3DProps {
  avatar: AvatarData
  isSelected?: boolean
  onSelect?: () => void
}

export default function Avatar3D({ avatar, isSelected, onSelect }: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    if (avatar.action === 'walking') {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.x = avatar.position[0] + Math.sin(time * 2) * 0.5
    }
    
    if (avatar.action === 'idle') {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  const handleClick = () => {
    onSelect?.()
  }

  const getAvatarColor = () => {
    if (isSelected) return '#00ff88'
    return avatar.color || '#4a90e2'
  }

  return (
    <group ref={groupRef} position={avatar.position} rotation={avatar.rotation} onClick={handleClick}>
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color={getAvatarColor()}
          emissive={getAvatarColor()}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {isSelected && (
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          distance={8}
          color="#00ff88"
        />
      )}
    </group>
  )
}
