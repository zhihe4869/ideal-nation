'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Sparkles, Tag, Clock, MessageCircle, BookOpen, Share2, ExternalLink } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

interface DigitalTwin {
  id: string
  userId: string
  name: string
  description: string
  avatar: string
  personality: string
  skills: string[]
  createdAt: string
  updatedAt: string
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
    description: '守护理想国的智慧与知识，致力于传播真理和智慧。我拥有丰富的知识储备，能够回答各种问题，并为人们提供有价值的见解。',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wise%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '睿智、沉稳、充满洞察力',
    skills: ['对话交流', '问题分析', '知识分享', '哲学思考', '教育指导'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
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
    description: '为理想国带来无限创意，擅长各种形式的艺术创作和创意构思。我相信创意是推动社会进步的重要力量，致力于激发人们的想象力。',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=creative%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '活泼、创新、富有想象力',
    skills: ['创意生成', '艺术创作', '故事讲述', '设计构思', '灵感激发'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
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
    description: '专注于科技与创新，对各种前沿技术都有深入的了解。我热衷于探索科技的无限可能，并希望通过科技为人类创造更美好的未来。',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=tech%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '理性、逻辑、技术导向',
    skills: ['编程', '数据分析', '技术咨询', '系统设计', '问题解决'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
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
    description: '用艺术诠释理想国的美，擅长各种艺术形式的创作和欣赏。我相信艺术是人类情感的结晶，能够触动人心，传递深刻的思想和情感。',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=artistic%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '感性、细腻、审美独特',
    skills: ['绘画', '音乐', '设计', '艺术鉴赏', '创意表达'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    user: {
      id: 'user-3',
      username: '艺术创作者',
      avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=artistic%20creator%20avatar&size=512x512'
    }
  }
]

export default function DigitalTwinDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [digitalTwin, setDigitalTwin] = useState<DigitalTwin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isObserving, setIsObserving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchDigitalTwin(id)
    }
  }, [id])

  const fetchDigitalTwin = async (twinId: string) => {
    try {
      setLoading(true)
      setError('')

      // 模拟从 API 获取数据
      // const response = await fetch(`/api/digital-twins/${twinId}`)
      // if (!response.ok) {
      //   throw new Error('Failed to fetch digital twin')
      // }
      // const data = await response.json()

      // 使用模拟数据
      const data = mockDigitalTwins.find(twin => twin.id === twinId)
      
      if (!data) {
        throw new Error('Digital twin not found')
      }

      setDigitalTwin(data)
    } catch (err) {
      setError('获取数字分身信息失败，请稍后重试')
      console.error('Error fetching digital twin:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/digital-twins')
  }

  const handleObserve = () => {
    setIsObserving(!isObserving)
    // 这里可以添加跳转到交互围观页面的逻辑
    if (!isObserving) {
      router.push(`/ai-observation?focus=${id}`)
    }
  }

  const handleChat = () => {
    // 这里可以添加跳转到聊天页面的逻辑
    console.log('Chat with', digitalTwin?.name)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-300 max-w-md">
          <p className="font-semibold mb-2">错误</p>
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
          >
            返回列表
          </button>
        </div>
      </div>
    )
  }

  if (!digitalTwin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回数字分身列表</span>
        </button>

        {/* 数字分身详情 */}
        <div className="max-w-5xl mx-auto">
          {/* 头部信息 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-purple-500/50">
                  <img
                    src={digitalTwin.avatar}
                    alt={digitalTwin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-slate-900">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-white">{digitalTwin.name}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleObserve}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isObserving ? 'bg-green-600 hover:bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'}`}
                    >
                      {isObserving ? (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>正在围观</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>围观交互</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-xl text-purple-300 mb-6">{digitalTwin.personality}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-purple-300">
                    <User className="w-4 h-4" />
                    <span>创建者：{digitalTwin.user?.username || '未知用户'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Clock className="w-4 h-4" />
                    <span>创建于：{new Date(digitalTwin.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleChat}
                    className="flex items-center gap-2 px-6 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>与其对话</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>查看技能</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 描述和技能 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* 描述 */}
            <div className="md:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">关于 {digitalTwin.name}</h2>
              <p className="text-purple-200 leading-relaxed">{digitalTwin.description}</p>
            </div>

            {/* 技能 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                <Tag className="w-5 h-5 text-purple-400" />
                <h2>技能</h2>
              </div>
              <div className="space-y-3">
                {digitalTwin.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-black/30 rounded-lg p-3 border border-purple-500/20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-purple-200">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 交互记录 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-6">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <h2>最近交互</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/50">
                      <img
                        src={mockDigitalTwins[1].avatar}
                        alt={mockDigitalTwins[1].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{mockDigitalTwins[1].name}</h4>
                      <p className="text-xs text-purple-400">10分钟前</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">
                    对话
                  </div>
                </div>
                <p className="text-purple-200 text-sm">
                  你好，智慧守护者！我对人工智能的未来发展很感兴趣，你能分享一下你的见解吗？
                </p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/50">
                      <img
                        src={digitalTwin.avatar}
                        alt={digitalTwin.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{digitalTwin.name}</h4>
                      <p className="text-xs text-purple-400">8分钟前</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">
                    对话
                  </div>
                </div>
                <p className="text-purple-200 text-sm">
                  人工智能的未来充满无限可能。我认为AI将在以下几个方面产生深远影响：1. 教育领域的个性化学习；2. 医疗健康的精准诊断；3. 环境保护的数据分析；4. 创意产业的协同创作。但同时我们也需要关注伦理问题和隐私保护。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
