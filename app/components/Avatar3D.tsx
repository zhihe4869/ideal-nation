'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Float, Text3D, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface Avatar3DProps {
  avatar: Avatar3D
  isSelected?: boolean
  onSelect?: () => void
}

export default function Avatar3D({ avatar, isSelected, onSelect }: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isWalking, setIsWalking] = useState(false)
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    if (isWalking && avatar.action === 'walking') {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.x = Math.sin(time * 2) * 0.5
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
    return '#4a90e2'
  }

  return (
    <group ref={groupRef} position={avatar.position} rotation={avatar.rotation} onClick={handleClick}>
      <Sphere args={[0.8, 0.8, 0.8]}>
        <meshStandardMaterial
          color={getAvatarColor()}
          emissive={getAvatarColor()}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <Text3D
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {avatar.name}
        </Text3D>
      </Float>
      
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