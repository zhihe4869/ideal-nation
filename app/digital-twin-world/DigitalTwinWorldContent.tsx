'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { ArrowLeft, Users, Sparkles, Activity, Settings, Search, Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import DigitalTwinWorld from '../components/DigitalTwinWorld'

interface DigitalTwin {
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

// 模拟数字分身数据
const mockDigitalTwins: DigitalTwin[] = [
  {
    id: 'twin-1',
    userId: 'user-1',
    name: '智慧守护者',
    description: '守护理想国的智慧与知识',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wise%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '睿智、沉稳、充满洞察力',
    skills: ['对话交流', '问题分析', '知识分享'],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    action: 'thinking',
    color: '#4a90e2',
    isOnline: true,
    lastActivity: new Date(),
    user: {
      id: 'user-1',
      username: '理想国公民',
      avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cyberpunk%20user%20avatar&size=512x512'
    }
  },
  {
    id: 'twin-2',
    userId: 'user-1',
    name: '创意先锋',
    description: '为理想国带来无限创意',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=creative%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '活泼、创新、富有想象力',
    skills: ['创意生成', '艺术创作', '故事讲述'],
    position: [3, 0, 2],
    rotation: [0, 0, 0],
    action: 'creating',
    color: '#9b59b6',
    isOnline: true,
    lastActivity: new Date(),
    user: {
      id: 'user-1',
      username: '理想国公民',
      avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cyberpunk%20user%20avatar&size=512x512'
    }
  },
  {
    id: 'twin-3',
    userId: 'user-2',
    name: '科技达人',
    description: '专注于科技与创新',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=tech%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '理性、逻辑、技术导向',
    skills: ['编程', '数据分析', '技术咨询'],
    position: [-2, 0, 3],
    rotation: [0, 0, 0],
    action: 'walking',
    color: '#e74c3c',
    isOnline: true,
    lastActivity: new Date(),
    user: {
      id: 'user-2',
      username: '科技爱好者',
      avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=tech%20enthusiast%20avatar&size=512x512'
    }
  },
  {
    id: 'twin-4',
    userId: 'user-3',
    name: '艺术大师',
    description: '用艺术诠释理想国的美',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=artistic%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '感性、细腻、审美独特',
    skills: ['绘画', '音乐', '设计'],
    position: [-4, 0, -2],
    rotation: [0, 0, 0],
    action: 'interacting',
    color: '#2ecc71',
    isOnline: true,
    lastActivity: new Date(),
    user: {
      id: 'user-3',
      username: '艺术创作者',
      avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=artistic%20creator%20avatar&size=512x512'
    }
  },
  {
    id: 'twin-5',
    userId: 'user-2',
    name: '数据分析专家',
    description: '通过数据洞察未来',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=data%20analyst%20cyberpunk%20avatar&size=512x512',
    personality: '严谨、客观、注重事实',
    skills: ['数据分析', '可视化', '预测建模'],
    position: [5, 0, -3],
    rotation: [0, 0, 0],
    action: 'thinking',
    color: '#f39c12',
    isOnline: true,
    lastActivity: new Date(),
    user: {
      id: 'user-2',
      username: '科技爱好者',
      avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=tech%20enthusiast%20avatar&size=512x512'
    }
  }
]

export default function DigitalTwinWorldContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const focusTwinId = searchParams.get('focus')
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>(mockDigitalTwins)
  const [selectedTwin, setSelectedTwin] = useState<DigitalTwin | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [fps, setFps] = useState(60)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(Date.now())

  useEffect(() => {
    // 模拟加载时间
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // 模拟数字分身的随机行为
    const interval = setInterval(() => {
      setDigitalTwins(prevTwins => {
        return prevTwins.map(twin => {
          const actions: DigitalTwin['action'][] = ['idle', 'walking', 'thinking', 'interacting', 'creating']
          const randomAction = actions[Math.floor(Math.random() * actions.length)]
          
          // 随机更新位置
          const randomPosition = [
            twin.position[0] + (Math.random() - 0.5) * 0.1,
            twin.position[1],
            twin.position[2] + (Math.random() - 0.5) * 0.1
          ]

          return {
            ...twin,
            action: randomAction,
            position: randomPosition as [number, number, number]
          }
        })
      })
    }, 3000)

    // 计算 FPS
    const fpsInterval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastTimeRef.current
      const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
      setFps(currentFps)
      frameCountRef.current = 0
      lastTimeRef.current = now
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(fpsInterval)
    }
  }, [])

  const handleBack = () => {
    router.push('/digital-twins')
  }

  const handleTwinSelect = (twinId: string) => {
    const twin = digitalTwins.find(t => t.id === twinId)
    setSelectedTwin(twin || null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以添加搜索逻辑
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const getActionColor = (action: DigitalTwin['action']) => {
    switch (action) {
      case 'idle': return 'text-gray-400'
      case 'walking': return 'text-blue-400'
      case 'thinking': return 'text-purple-400'
      case 'interacting': return 'text-red-400'
      case 'creating': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getActionText = (action: DigitalTwin['action']) => {
    switch (action) {
      case 'idle': return '待机'
      case 'walking': return '移动中'
      case 'thinking': return '思考中'
      case 'interacting': return '交互中'
      case 'creating': return '创造中'
      default: return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-white">数字分身世界</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all">
            <Activity className="w-5 h-5" />
          </button>
          <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        {showSidebar && (
          <div className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto">
            {/* 搜索和过滤 */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索数字分身..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="按技能过滤..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </form>

            {/* 数字分身列表 */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                数字分身 ({digitalTwins.length})
              </h2>
              {digitalTwins.map((twin) => (
                <div
                  key={twin.id}
                  className={`bg-black/30 rounded-lg p-4 border transition-all cursor-pointer ${
                    selectedTwin?.id === twin.id
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-purple-500/20 hover:border-purple-500/40'
                  }`}
                  onClick={() => handleTwinSelect(twin.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/50">
                      <img
                        src={twin.avatar}
                        alt={twin.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">{twin.name}</h3>
                        <span className={`text-xs font-medium ${getActionColor(twin.action)}`}>
                          {getActionText(twin.action)}
                        </span>
                      </div>
                      <p className="text-xs text-purple-300 mb-2">{twin.personality}</p>
                      <div className="flex items-center gap-2 text-xs text-purple-400">
                        <span>{twin.user?.username || '未知用户'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D 世界 */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <DigitalTwinWorld
              digitalTwins={digitalTwins}
              onTwinSelect={handleTwinSelect}
              focusTwinId={focusTwinId || undefined}
            />
          </div>

          {/* 选中数字分身的详情 */}
          {selectedTwin && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 p-4 max-h-60 overflow-y-auto">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-500/50 flex-shrink-0">
                  <img
                    src={selectedTwin.avatar}
                    alt={selectedTwin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{selectedTwin.name}</h3>
                    <span className={`text-sm font-medium ${getActionColor(selectedTwin.action)}`}>
                      {getActionText(selectedTwin.action)}
                    </span>
                  </div>
                  <p className="text-purple-300 text-sm mb-3">{selectedTwin.personality}</p>
                  <p className="text-purple-200 text-sm mb-3 line-clamp-2">{selectedTwin.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTwin.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-600/20 rounded-full text-xs text-purple-300 border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {selectedTwin.skills.length > 4 && (
                      <span className="px-2 py-1 bg-black/30 rounded-full text-xs text-purple-400 border border-purple-500/20">
                        +{selectedTwin.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
