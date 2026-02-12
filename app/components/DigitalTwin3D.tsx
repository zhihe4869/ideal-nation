'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Cylinder, Text, Billboard, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface DigitalTwinData {
  id: string
  userId: string
  name: string
  description: string
  avatar: string
  personality: string
  skills: string[]
  position: [number, number, number]
  rotation: [number, number, number]
  action: 'idle' | 'walking' | 'thinking' | 'interacting' | 'creating'
  color: string
  isOnline: boolean
  lastActivity: Date
  user?: {
    id: string
    username: string
    avatar?: string
  }
}

interface DigitalTwin3DProps {
  digitalTwin: DigitalTwinData
  isSelected?: boolean
  onSelect?: () => void
  scale?: number
}

export default function DigitalTwin3D({ digitalTwin, isSelected, onSelect, scale = 1 }: DigitalTwin3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const [avatarTexture, setAvatarTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    // 加载头像纹理
    const loadAvatarTexture = async () => {
      try {
        // 使用 TextureLoader 的 loading manager 来优化加载
        const manager = new THREE.LoadingManager()
        const loader = new THREE.TextureLoader(manager)
        const texture = await loader.loadAsync(digitalTwin.avatar)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = false
        setAvatarTexture(texture)
      } catch (error) {
        console.error('Error loading avatar texture:', error)
      }
    }

    loadAvatarTexture()

    return () => {
      // 清理纹理
      if (avatarTexture) {
        avatarTexture.dispose()
      }
    }
  }, [digitalTwin.avatar, avatarTexture])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // 根据动作更新动画
    switch (digitalTwin.action) {
      case 'walking':
        const time = state.clock.getElapsedTime()
        groupRef.current.position.x = digitalTwin.position[0] + Math.sin(time * 2) * 0.2 * scale
        groupRef.current.position.z = digitalTwin.position[2] + Math.cos(time * 2) * 0.2 * scale
        
        if (headRef.current) {
          headRef.current.position.y = 1.2 * scale + Math.sin(time * 4) * 0.05 * scale
        }
        if (bodyRef.current) {
          bodyRef.current.position.y = 0.5 * scale + Math.sin(time * 4) * 0.03 * scale
        }
        break

      case 'thinking':
        if (headRef.current) {
          headRef.current.rotation.y += delta * 0.8
          headRef.current.position.y = 1.2 * scale + Math.sin(state.clock.getElapsedTime() * 2) * 0.08 * scale
        }
        break

      case 'interacting':
        if (groupRef.current) {
          groupRef.current.rotation.y += delta * 1
        }
        break

      case 'creating':
        if (pulseRef.current && pulseRef.current.material) {
          const time = state.clock.getElapsedTime()
          pulseRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.2)
          if (!Array.isArray(pulseRef.current.material)) {
            (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 3) * 0.2
          }
        }
        break

      case 'idle':
      default:
        if (groupRef.current) {
          groupRef.current.rotation.y += delta * 0.3
        }
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1
        }
        break
    }
  })

  const handleClick = () => {
    onSelect?.()
  }

  const getAvatarColor = () => {
    if (isSelected) return '#00ff88'
    return digitalTwin.color || '#4a90e2'
  }

  const getActionColor = () => {
    switch (digitalTwin.action) {
      case 'walking': return '#4a90e2'
      case 'thinking': return '#9b59b6'
      case 'interacting': return '#e74c3c'
      case 'creating': return '#2ecc71'
      default: return '#95a5a6'
    }
  }

  return (
    <group ref={groupRef} position={digitalTwin.position} rotation={digitalTwin.rotation} onClick={handleClick}>
      {/* 脉冲效果 */}
      <Sphere
        ref={pulseRef}
        args={[1.5 * scale, 32, 32]}
        position={[0, 1 * scale, 0]}
      >
        <meshStandardMaterial
          color={getActionColor()}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* 身体 */}
      <Cylinder
        ref={bodyRef}
        args={[0.5 * scale, 0.8 * scale, 1.2 * scale, 32]}
        position={[0, 0.6 * scale, 0]}
      >
        <meshStandardMaterial
          color={getAvatarColor()}
          emissive={getAvatarColor()}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* 头部 */}
      <Sphere
        ref={headRef}
        args={[0.6 * scale, 32, 32]}
        position={[0, 1.8 * scale, 0]}
      >
        <meshStandardMaterial
          color={getAvatarColor()}
          emissive={getAvatarColor()}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>

      {/* 眼睛 */}
      <group position={[0, 1.9 * scale, 0.6 * scale]}>
        <Sphere args={[0.1 * scale, 16, 16]} position={[-0.2 * scale, 0.1 * scale, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.05 * scale, 16, 16]} position={[-0.2 * scale, 0.1 * scale, 0.05 * scale]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.1 * scale, 16, 16]} position={[0.2 * scale, 0.1 * scale, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.05 * scale, 16, 16]} position={[0.2 * scale, 0.1 * scale, 0.05 * scale]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
      </group>

      {/* 名字标签 */}
      <Billboard position={[0, 2.8 * scale, 0]}>
        <Text
          fontSize={0.4 * scale}
          color={isSelected ? '#00ff88' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5fBBc4.woff"
        >
          {digitalTwin.name}
        </Text>
      </Billboard>

      {/* 技能光环 */}
      <group position={[0, 0, 0]}>
        {digitalTwin.skills.slice(0, 3).map((skill, index) => (
          <Sphere
            key={index}
            args={[1.2 * scale + index * 0.2, 16, 16]}
            position={[
              Math.sin((index / 3) * Math.PI * 2) * (1 + index * 0.2),
              1 * scale,
              Math.cos((index / 3) * Math.PI * 2) * (1 + index * 0.2)
            ]}
          >
            <meshStandardMaterial
              color={getActionColor()}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
        ))}
      </group>

      {/* 选中效果 */}
      {isSelected && (
        <>
          <pointLight
            position={[0, 2 * scale, 0]}
            intensity={3}
            distance={10}
            color="#00ff88"
          />
          <Sphere args={[1.8 * scale, 32, 32]}>
            <meshStandardMaterial
              color="#00ff88"
              transparent
              opacity={0.1}
              wireframe
            />
          </Sphere>
        </>
      )}
    </group>
  )
}
