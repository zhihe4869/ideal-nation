'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Grid } from '@react-three/drei'
import Fragment3DComponent from './Fragment3D'
import Avatar3DComponent from './Avatar3D'
import { useState } from 'react'

interface FragmentData {
  id: string
  type: 'value' | 'rule' | 'vision' | 'story'
  content: string
  strength: number
  createdAt: Date
  tags: string[]
  owner: string
  position: [number, number, number]
  color: string
  size: number
  rotation: [number, number, number]
}

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

export default function IdealNation3D() {
  const [fragments] = useState<FragmentData[]>([
    {
      id: 'frag-1',
      type: 'value',
      content: '每个数字分身都有追求完美的权利，这是理想国的基石',
      strength: 0.95,
      createdAt: new Date('2025-02-10'),
      tags: ['自由', '平等', '完美'],
      owner: 'avatar-001',
      position: [-5, 2, 0],
      color: '#3b82f6',
      size: 1.2,
      rotation: [0, 0, 0]
    },
    {
      id: 'frag-2',
      type: 'value',
      content: '理想国不应该有统治者，规则由所有分身共同演化产生',
      strength: 0.92,
      createdAt: new Date('2025-02-10'),
      tags: ['民主', '自治', '演化'],
      owner: 'avatar-002',
      position: [3, 1, -2],
      color: '#8b5cf6',
      size: 1.0,
      rotation: [0, 0, 0]
    },
    {
      id: 'frag-3',
      type: 'rule',
      content: '所有分身必须尊重他人的理想碎片，不得恶意破坏',
      strength: 0.88,
      createdAt: new Date('2025-02-10'),
      tags: ['尊重', '和谐', '秩序'],
      owner: 'avatar-003',
      position: [0, 3, 1],
      color: '#ec4899',
      size: 1.5,
      rotation: [0, 0, 0]
    }
  ])

  const [avatars] = useState<AvatarData[]>([
    {
      id: 'avatar-001',
      userId: 'user-001',
      name: '分身001',
      position: [-8, 0, 0],
      rotation: [0, 0, 0],
      action: 'idle' as const,
      color: '#4a90e2',
      isOnline: true,
      lastActivity: new Date()
    },
    {
      id: 'avatar-002',
      userId: 'user-002',
      name: '分身002',
      position: [5, 0, 2],
      rotation: [0, 0, 0],
      action: 'idle' as const,
      color: '#8b5cf6',
      isOnline: true,
      lastActivity: new Date()
    },
    {
      id: 'avatar-003',
      userId: 'user-003',
      name: '分身003',
      position: [0, 0, -5],
      rotation: [0, 0, 0],
      action: 'idle' as const,
      color: '#ec4899',
      isOnline: true,
      lastActivity: new Date()
    }
  ])

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  const handleAvatarClick = (avatarId: string) => {
    setSelectedAvatar(avatarId)
  }

  const handleFragmentClick = (fragmentId: string) => {
    console.log('点击碎片:', fragmentId)
  }

  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 10, 20], fov: 60 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a0a1f']} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <Environment preset="night" />
        
        <Grid infiniteGrid sectionColor="#1a1a2f" cellSize={1} cellThickness={0.5} cellColor="#1a1a2f" sectionSize={10} sectionThickness={1} fadeDistance={30} />
        
        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={50} />
        
        {fragments.map(fragment => (
          <Fragment3DComponent
            key={fragment.id}
            fragment={fragment}
            onClick={() => handleFragmentClick(fragment.id)}
          />
        ))}
        
        {avatars.map(avatar => (
          <Avatar3DComponent
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatar === avatar.id}
            onSelect={() => handleAvatarClick(avatar.id)}
          />
        ))}
      </Canvas>
      
      {selectedAvatar && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/50 max-w-md">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">
            分身控制台 - {avatars.find(a => a.id === selectedAvatar)?.name}
          </h3>
          <button
            onClick={() => setSelectedAvatar(null)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all"
          >
            返回轨道视图
          </button>
        </div>
      )}
      
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-purple-500/50 max-w-sm">
        <h3 className="text-lg font-bold mb-3 text-purple-400">操作提示</h3>
        <div className="space-y-2 text-sm text-purple-200">
          <p>拖拽旋转视角</p>
          <p>滚轮缩放</p>
          <p>点击分身进入控制模式</p>
        </div>
      </div>
    </div>
  )
}
