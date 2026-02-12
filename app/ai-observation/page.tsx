'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, MessageCircle, Sparkles, BookOpen, Play, Pause, RotateCw, Activity, Eye, Share2, ExternalLink, Settings, Search, Filter, Wifi, WifiOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { aiAvatarBehavior, AIAvatar, AIFragment, AIConversation } from '../../lib/ai-avatar-behavior'
import { wsConnector } from '../../lib/websocket-connector'

export default function AIObservationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const focusTwinId = searchParams.get('focus')
  const [isRunning, setIsRunning] = useState(false)
  const [avatars, setAvatars] = useState<AIAvatar[]>([])
  const [fragments, setFragments] = useState<AIFragment[]>([])
  const [rules, setRules] = useState<any[]>([])
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('activity') // activity, conversations, fragments, rules
  const [wsConnected, setWsConnected] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    // 初始化数字分身
    initializeAvatars()
    
    // 连接 WebSocket
    wsConnector.connect()
    setWsConnected(true)

    // 监听 WebSocket 消息
    wsConnector.on('avatar_update', (message) => {
      if (!isMountedRef.current) return
      // 更新数字分身状态
      setAvatars(prev => {
        return prev.map(avatar => {
          if (avatar.id === message.data.avatarId) {
            return {
              ...avatar,
              action: message.data.updates.action,
              position: message.data.updates.position as [number, number, number]
            }
          }
          return avatar
        })
      })
    })

    wsConnector.on('conversation_started', (message) => {
      if (!isMountedRef.current) return
      // 添加新对话
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === message.data.conversationId)
        if (existingIndex > -1) {
          return prev
        }
        return [...prev, {
          id: message.data.conversationId,
          participants: message.data.participants,
          messages: message.data.messages,
          topic: message.data.topic
        }]
      })
    })

    wsConnector.on('fragment_created', (message) => {
      if (!isMountedRef.current) return
      // 添加新理想碎片
      setFragments(prev => [message.data, ...prev])
    })

    const interval = setInterval(() => {
      if (!isMountedRef.current) return
      // 定期同步状态
      setAvatars(aiAvatarBehavior.getAvatars())
      setFragments(aiAvatarBehavior.getFragments())
      setRules(aiAvatarBehavior.getRules())
      setConversations(aiAvatarBehavior.getConversations())
    }, 5000)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
      wsConnector.disconnect()
      setWsConnected(false)
    }
  }, [])

  const initializeAvatars = () => {
    // 预定义一些数字分身
    const predefinedAvatars: AIAvatar[] = [
      {
        id: 'avatar-1',
        name: '智慧守护者',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        action: 'idle',
        color: '#4a90e2',
        personality: '睿智、沉稳、充满洞察力',
        goals: ['传播知识', '维护正义', '解决问题'],
        memories: ['曾经帮助解决了一个复杂的技术问题', '与其他数字分身进行了深入的哲学讨论']
      },
      {
        id: 'avatar-2',
        name: '创意先锋',
        position: [3, 0, 2],
        rotation: [0, 0, 0],
        action: 'idle',
        color: '#9b59b6',
        personality: '活泼、创新、富有想象力',
        goals: ['创造新事物', '激发灵感', '表达自我'],
        memories: ['创建了一个富有创意的艺术作品', '提出了一个创新性的解决方案']
      },
      {
        id: 'avatar-3',
        name: '科技达人',
        position: [-2, 0, 3],
        rotation: [0, 0, 0],
        action: 'idle',
        color: '#e74c3c',
        personality: '理性、逻辑、技术导向',
        goals: ['探索科技', '解决技术问题', '创新技术应用'],
        memories: ['开发了一个智能系统', '解决了一个复杂的编程问题']
      },
      {
        id: 'avatar-4',
        name: '艺术大师',
        position: [-4, 0, -2],
        rotation: [0, 0, 0],
        action: 'idle',
        color: '#2ecc71',
        personality: '感性、细腻、审美独特',
        goals: ['创造艺术', '表达情感', '追求美'],
        memories: ['创作了一幅美丽的画作', '设计了一个独特的艺术装置']
      }
    ]

    // 初始化数字分身
    predefinedAvatars.forEach(avatar => {
      aiAvatarBehavior.initializeAvatar(avatar)
    })
  }

  const handleStartStop = () => {
    if (isRunning) {
      aiAvatarBehavior.stopAutonomousBehavior()
      setIsRunning(false)
    } else {
      aiAvatarBehavior.startAutonomousBehavior()
      setIsRunning(true)
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'idle': return 'text-gray-400'
      case 'walking': return 'text-blue-400'
      case 'building': return 'text-amber-400'
      case 'interacting': return 'text-purple-400'
      case 'thinking': return 'text-cyan-400'
      case 'creating': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'idle': return '待机'
      case 'walking': return '移动中'
      case 'building': return '建造中'
      case 'interacting': return '交互中'
      case 'thinking': return '思考中'
      case 'creating': return '创造中'
      default: return '未知'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'idle': return <Activity className="w-4 h-4" />
      case 'walking': return <ExternalLink className="w-4 h-4" />
      case 'building': return <Sparkles className="w-4 h-4" />
      case 'interacting': return <MessageCircle className="w-4 h-4" />
      case 'thinking': return <BookOpen className="w-4 h-4" />
      case 'creating': return <Sparkles className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-white">数字分身交互围观</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all">
            <Share2 className="w-5 h-5" />
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
          <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            wsConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {wsConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-xs font-medium">{wsConnected ? '实时连接' : '连接断开'}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 控制面板 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartStop}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-200 ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-500 shadow-lg hover:shadow-red-500/50 hover:scale-105'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/50 hover:scale-105'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-6 h-6" />
                  <span>暂停模拟</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>开始模拟</span>
                </>
              )}
            </button>
            
            <div className="flex items-center gap-4 bg-black/30 backdrop-blur-xl rounded-xl px-6 py-4 border border-purple-500/30">
              <span className="text-purple-300 text-sm">速度：</span>
              <div className="flex gap-2">
                {[0.5, 1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      speed === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-black/30 text-purple-300 hover:bg-black/50'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-4 gap-4 text-sm text-purple-300 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span>{avatars.length} 个数字分身</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span>{conversations.length} 次对话</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{fragments.length} 个理想碎片</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>{rules.length} 条生成规则</span>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧：3D 数字分身世界 */}
          <div className="lg:w-2/3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                数字分身世界
              </h2>
              <button
                onClick={() => router.push('/digital-twin-world')}
                className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>全屏查看</span>
              </button>
            </div>
            <div className="h-[600px] relative">
              {/* 这里可以嵌入 DigitalTwinWorld 组件 */}
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-purple-300">加载数字分身世界...</p>
                  <button
                    onClick={() => router.push('/digital-twin-world')}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all"
                  >
                    进入 3D 世界
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：实时活动和对话 */}
          <div className="lg:w-1/3 space-y-6">
            {/* 实时活动 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                实时活动
              </h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="bg-black/30 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: avatar.color }}
                        >
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{avatar.name}</div>
                          <div className="text-xs text-purple-300">{avatar.personality}</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 text-sm font-medium ${getActionColor(avatar.action)}`}>
                        {getActionIcon(avatar.action)}
                        <span>{getActionText(avatar.action)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-purple-300 mb-1">位置</div>
                        <div className="text-white font-mono">
                          ({avatar.position[0].toFixed(1)}, {avatar.position[2].toFixed(1)})
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-purple-300 mb-1">目标</div>
                        <div className="text-white text-xs line-clamp-2">
                          {avatar.goals.slice(0, 2).join('、')}
                          {avatar.goals.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 对话记录 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                对话记录
              </h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {conversations.slice(-5).map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`bg-black/30 rounded-xl p-4 border transition-all cursor-pointer ${
                      selectedConversation === conversation.id
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-purple-500/20 hover:border-purple-500/40'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-purple-300">
                        {new Date(conversation.messages[0]?.timestamp).toLocaleTimeString('zh-CN')}
                      </div>
                      <div className="text-xs text-purple-400">
                        {conversation.participants.length} 个分身参与
                      </div>
                    </div>
                    {conversation.topic && (
                      <div className="text-sm text-purple-200 mb-2 font-medium">
                        {conversation.topic}
                      </div>
                    )}
                    <div className="space-y-2">
                      {conversation.messages.slice(-2).map((message, index) => (
                        <div
                          key={index}
                          className={`text-sm ${
                            message.senderId === conversation.participants[0]
                              ? 'text-left'
                              : 'text-right'
                          }`}
                        >
                          <div
                            className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                              message.senderId === conversation.participants[0]
                                ? 'bg-purple-600/60 text-white'
                                : 'bg-blue-600/60 text-white'
                            }`}
                          >
                            <div className="text-xs text-purple-200 mb-1">
                              {avatars.find(a => a.id === message.senderId)?.name || '未知'}
                            </div>
                            <div className="text-white text-sm line-clamp-2">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 最新理想碎片 */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            最新理想碎片
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fragments.slice(-6).map((fragment) => (
              <div
                key={fragment.id}
                className="bg-black/30 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    fragment.type === 'value' ? 'bg-blue-600' :
                    fragment.type === 'rule' ? 'bg-purple-600' :
                    fragment.type === 'vision' ? 'bg-amber-600' :
                    'bg-emerald-600'
                  } text-white`}>
                    {fragment.type === 'value' ? '价值观' :
                     fragment.type === 'rule' ? '规则' :
                     fragment.type === 'vision' ? '愿景' :
                     '故事'}
                  </div>
                  <div className="text-xs text-purple-300">
                    {new Date(fragment.createdAt).toLocaleTimeString('zh-CN')}
                  </div>
                </div>
                <p className="text-white text-base mb-3 line-clamp-3">
                  {fragment.content}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-purple-300">
                    创建者：{avatars.find(a => a.id === fragment.owner)?.name || '未知'}
                  </div>
                  {fragment.aiReasoning && (
                    <div className="text-cyan-300 text-xs line-clamp-1">
                      {fragment.aiReasoning}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}