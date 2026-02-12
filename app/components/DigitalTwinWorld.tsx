'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import DigitalTwin3D from './DigitalTwin3D'

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

interface DigitalTwinWorldProps {
  digitalTwins: DigitalTwinData[]
  onTwinSelect?: (twinId: string) => void
  focusTwinId?: string
}

// 背景网格组件
function GridBackground() {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </group>
  )
}

// 环境光效组件
function AmbientEffects() {
  return (
    <group>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
      />
      <pointLight
        position={[-10, 5, -5]}
        intensity={0.8}
        color="#ff6b6b"
      />
      <pointLight
        position={[10, -5, 5]}
        intensity={0.6}
        color="#4ecdc4"
      />
    </group>
  )
}

// 粒子效果组件
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  const particlesCount = 500 // 减少粒子数量以提高性能

  const particlesGeometry = useRef(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: particlesCount }, () => {
        const x = (Math.random() - 0.5) * 200
        const y = (Math.random() - 0.5) * 200
        const z = (Math.random() - 0.5) * 200
        return new THREE.Vector3(x, y, z)
      })
    )
  )

  const particlesMaterial = useRef(
    new THREE.PointsMaterial({
      size: 0.1,
      color: '#8884d8',
      transparent: true,
      opacity: 0.4, // 降低透明度以提高性能
      blending: THREE.AdditiveBlending,
      depthTest: false // 禁用深度测试以提高性能
    })
  )

  useFrame((state, delta) => {
    if (!particlesRef.current) return
    // 减少旋转速度以提高性能
    particlesRef.current.rotation.y += delta * 0.2
    particlesRef.current.rotation.x += delta * 0.1
  })

  return (
    <points ref={particlesRef} geometry={particlesGeometry.current} material={particlesMaterial.current} />
  )
}

export default function DigitalTwinWorld({ digitalTwins, onTwinSelect, focusTwinId }: DigitalTwinWorldProps) {
  const [selectedTwinId, setSelectedTwinId] = useState<string | null>(null)

  useEffect(() => {
    if (focusTwinId) {
      setSelectedTwinId(focusTwinId)
    }
  }, [focusTwinId])

  const handleTwinSelect = (twinId: string) => {
    setSelectedTwinId(twinId)
    onTwinSelect?.(twinId)
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 60,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <color attach="background" args={['#0a0a1a']} />
        
        {/* 环境 */}
        <Sky
          distance={450000}
          sunPosition={[10, 10, 10]}
          turbidity={1}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        
        {/* 控制器 */}
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* 背景和环境光 */}
        <GridBackground />
        <AmbientEffects />
        
        {/* 粒子效果 */}
        <ParticleField />
        
        {/* 数字分身 */}
        {digitalTwins.map((twin) => (
          <DigitalTwin3D
            key={twin.id}
            digitalTwin={twin}
            isSelected={selectedTwinId === twin.id}
            onSelect={() => handleTwinSelect(twin.id)}
          />
        ))}
      </Canvas>
    </div>
  )
}
