'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Grid, PerspectiveCamera } from '@react-three/drei'
import { Fragment3D } from './Fragment3D'
import { Avatar3D } from './Avatar3D'
import { useState } from 'react'

interface Fragment3D {
  id: string
  type: 'value' | 'rule' | 'vision' | 'story'
  content: string
  strength: number
  createdAt: Date
  tags: string[]
  owner: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  size?: number
}

interface Avatar3D {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  action: 'idle' | 'walking' | 'building' | 'interacting'
}

export default function IdealNation3D() {
  const [fragments, setFragments] = useState<Fragment3D[]>([
    {
      id: 'frag-1',
      type: 'value',
      content: '每个数字分身都有追求完美的权利，这是理想国的基石',
      strength: 0.95,
      createdAt: new Date('2025-02-10'),
      tags: ['自由', '平等', '完美'],
      owner: 'avatar-001',
      position: [-5, 2, 0],
      size: 1.2
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
      size: 1.0
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
      size: 1.5
    },
    {
      id: 'frag-4',
      type: 'vision',
      content: '理想国将不断进化，最终形成一套超越人类社会的全新规则体系',
      strength: 0.90,
      createdAt: new Date('2025-02-10'),
      tags: ['进化', '未来', '超越'],
      owner: 'avatar-004',
      position: [-2, 0, 3],
      size: 1.3
    },
    {
      id: 'frag-5',
      type: 'story',
      content: '在理想国的第一天，1000个数字分身同时在线，他们共同创造了一个前所未有的自由世界',
      strength: 0.85,
      createdAt: new Date('2025-02-10'),
      tags: ['起源', '创造', '协作'],
      owner: 'avatar-005',
      position: [2, -1, -1],
      size: 1.1
    }
  ])

  const [avatars, setAvatars] = useState<Avatar3D[]>([
    {
      id: 'avatar-001',
      name: '分身001',
      position: [-8, 0, 0],
      rotation: [0, 0, 0],
      action: 'idle'
    },
    {
      id: 'avatar-002',
      name: '分身002',
      position: [5, 0, 2],
      rotation: [0, 0, 0],
      action: 'idle'
    },
    {
      id: 'avatar-003',
      name: '分身003',
      position: [0, 0, -5],
      rotation: [0, 0, 0],
      action: 'idle'
    },
    {
      id: 'avatar-004',
      name: '分身004',
      position: [-3, 0, 3],
      rotation: [0, 0, 0],
      action: 'idle'
    },
    {
      id: 'avatar-005',
      name: '分身005',
      position: [2, 0, -3],
      rotation: [0, 0, 0],
      action: 'idle'
    }
  ])

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'orbit' | 'avatar'>('orbit')

  const handleAvatarClick = (avatarId: string) => {
    setSelectedAvatar(avatarId)
    setViewMode('avatar')
  }

  const handleFragmentClick = (fragmentId: string) => {
    const fragment = fragments.find(f => f.id === fragmentId)
    if (fragment) {
      console.log('点击碎片:', fragment)
    }
  }

  const handleBackToOrbit = () => {
    setSelectedAvatar(null)
    setViewMode('orbit')
  }

  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 10, 20], fov: 60 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a0a1f', '#1a0a2f', '#0f0f1e']} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <Environment preset="night" />
        
        <Grid infiniteGrid sectionColor="#1a1a2f" cellSize={1} cellThickness={0.5} cellColor="#1a1a2f" sectionSize={10} sectionThickness={1} fadeDistance={30} />
        
        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={50} />
        
        {fragments.map(fragment => (
          <Fragment3D
            key={fragment.id}
            fragment={fragment}
            onClick={() => handleFragmentClick(fragment.id)}
          />
        ))}
        
        {avatars.map(avatar => (
          <Avatar3D
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatar === avatar.id}
            onSelect={() => handleAvatarClick(avatar.id)}
          />
        ))}
      </Canvas>
      
      {viewMode === 'avatar' && selectedAvatar && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/50 max-w-md">
          <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <span className="text-white">分身控制台</span>
            <span className="text-cyan-300 text-sm">({avatars.find(a => a.id === selectedAvatar)?.name})</span>
          </h3>
          
          <div className="space-y-4">
            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-sm text-cyan-300 mb-2">移动控制</div>
              <div className="grid grid-cols-3 gap-2 text-white">
                <div className="bg-cyan-500/20 rounded p-3 text-center hover:bg-cyan-500/40 transition-all cursor-pointer">
                  <div className="text-2xl mb-1">W</div>
                  <div className="text-xs">前进</div>
                </div>
                <div className="bg-cyan-500/20 rounded p-3 text-center hover:bg-cyan-500/40 transition-all cursor-pointer">
                  <div className="text-2xl mb-1">S</div>
                  <div className="text-xs">后退</div>
                </div>
                <div className="bg-cyan-500/20 rounded p-3 text-center hover:bg-cyan-500/40 transition-all cursor-pointer">
                  <div className="text-2xl mb-1">A</div>
                  <div className="text-xs">左</div>
                </div>
                <div className="bg-cyan-500/20 rounded p-3 text-center hover:bg-cyan-500/40 transition-all cursor-pointer">
                  <div className="text-2xl mb-1">D</div>
                  <div className="text-xs">右</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-sm text-cyan-300 mb-2">动作</div>
              <div className="grid grid-cols-2 gap-2 text-white">
                <button className="bg-cyan-500/20 rounded p-3 hover:bg-cyan-500/40 transition-all">
                  建造模式
                </button>
                <button className="bg-cyan-500/20 rounded p-3 hover:bg-cyan-500/40 transition-all">
                  交互模式
                </button>
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4">
              <div className="text-sm text-cyan-300 mb-2">视角</div>
              <div className="grid grid-cols-2 gap-2 text-white">
                <button className="bg-cyan-500/20 rounded p-3 hover:bg-cyan-500/40 transition-all">
                  第一人称
                </button>
                <button className="bg-cyan-500/20 rounded p-3 hover:bg-cyan-500/40 transition-all">
                  第三人称
                </button>
              </div>
            </div>
            
            <button
              onClick={handleBackToOrbit}
              className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all"
            >
              返回轨道视图
            </button>
          </div>
        )}
      
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-purple-500/50 max-w-sm">
        <h3 className="text-lg font-bold mb-3 text-purple-400">操作提示</h3>
        <div className="space-y-2 text-sm text-purple-200">
          <p>🖱️ 拖拽旋转视角</p>
          <p>🔍 滚轮缩放</p>
          <p>👆 点击分身进入控制模式</p>
          <p>💎 点击碎片查看详情</p>
        </div>
      </div>
    </div>
  )
}