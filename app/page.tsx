'use client'

import { useState, useEffect } from 'react'
import { Plus, Sparkles, Users, TrendingUp, BookOpen, Globe, Box, LogOut, User as UserIcon, MessageCircle, Eye as ViewEye, Activity } from 'lucide-react'
import Nation3DPage from './nation-3d/page'
import { secondMeClient } from '../lib/second-me-client'
import { useAuthStore } from '../lib/auth-store'
import { useRouter } from 'next/navigation'

interface IdealFragment {
  id: string
  type: 'value' | 'rule' | 'vision' | 'story'
  content: string
  strength: number
  createdAt: Date
  tags: string[]
  owner: string
}

interface GeneratedRule {
  id: string
  content: string
  sourceFragments: string[]
  consensusScore: number
  active: boolean
}

interface IdealNation {
  id: string
  name: string
  fragments: IdealFragment[]
  rules: GeneratedRule[]
  evolutionStage: number
  totalAvatars: number
}

export default function HomePage() {
  const [fragments, setFragments] = useState<IdealFragment[]>([])
  const [rules, setRules] = useState<GeneratedRule[]>([])
  const [nation, setNation] = useState<IdealNation | null>(null)
  const [selectedType, setSelectedType] = useState<'value' | 'rule' | 'vision' | 'story'>('value')
  const [newFragmentContent, setNewFragmentContent] = useState('')
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showOnlineUsers, setShowOnlineUsers] = useState(false)
  
  const { currentUser, onlineUsers, logout, updateOnlineUsers, setSpectating, isSpectating, spectatingUserId } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    loadInitialData()
    checkAuth()
  }, [])

  const checkAuth = () => {
    if (!currentUser) {
      router.push('/login')
    }
  }

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      const initialFragments: IdealFragment[] = [
        {
          id: 'frag-1',
          type: 'value',
          content: '每个数字分身都有追求完美的权利，这是理想国的基石',
          strength: 0.95,
          createdAt: new Date('2025-02-10'),
          tags: ['自由', '平等', '完美'],
          owner: 'avatar-001'
        },
        {
          id: 'frag-2',
          type: 'value',
          content: '理想国不应该有统治者，规则由所有分身共同演化产生',
          strength: 0.92,
          createdAt: new Date('2025-02-10'),
          tags: ['民主', '自治', '演化'],
          owner: 'avatar-002'
        },
        {
          id: 'frag-3',
          type: 'rule',
          content: '所有分身必须尊重他人的理想碎片，不得恶意破坏',
          strength: 0.88,
          createdAt: new Date('2025-02-10'),
          tags: ['尊重', '和谐', '秩序'],
          owner: 'avatar-003'
        },
        {
          id: 'frag-4',
          type: 'vision',
          content: '理想国将不断进化，最终形成一套超越人类社会的全新规则体系',
          strength: 0.90,
          createdAt: new Date('2025-02-10'),
          tags: ['进化', '未来', '超越'],
          owner: 'avatar-004'
        },
        {
          id: 'frag-5',
          type: 'story',
          content: '在理想国的第一天，1000个数字分身同时在线，他们共同创造了一个前所未有的自由世界',
          strength: 0.85,
          createdAt: new Date('2025-02-10'),
          tags: ['起源', '创造', '协作'],
          owner: 'avatar-005'
        }
      ]

      const initialRules: GeneratedRule[] = [
        {
          id: 'rule-1',
          content: '理想国禁止任何形式的强制和压迫',
          sourceFragments: ['frag-1', 'frag-2'],
          consensusScore: 0.96,
          active: true
        },
        {
          id: 'rule-2',
          content: '每个分身都有平等的参与权，无论其碎片强度如何',
          sourceFragments: ['frag-1', 'frag-3'],
          consensusScore: 0.94,
          active: true
        },
        {
          id: 'rule-3',
          content: '理想国鼓励碎片融合和创新，形成新的规则和价值观',
          sourceFragments: ['frag-2', 'frag-4'],
          consensusScore: 0.91,
          active: true
        }
      ]

      const mockNation: IdealNation = {
        id: 'nation-1',
        name: '理想国',
        fragments: initialFragments,
        rules: initialRules,
        evolutionStage: 1,
        totalAvatars: 1000
      }
      
      setNation(mockNation)
      setFragments(initialFragments)
      setRules(initialRules)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFragment = async () => {
    if (!newFragmentContent.trim()) return
    
    setIsAnalyzing(true)
    try {
      const analysis = await secondMeClient.analyzeFragment({
        id: `frag-${Date.now()}`,
        type: selectedType,
        content: newFragmentContent,
        strength: 0.8,
        createdAt: new Date(),
        tags: [],
        owner: 'current-user'
      })

      const newFragment: IdealFragment = {
        id: `frag-${Date.now()}`,
        type: selectedType,
        content: newFragmentContent,
        strength: analysis.strength,
        createdAt: new Date(),
        tags: analysis.tags,
        owner: 'current-user'
      }
      
      setFragments([...fragments, newFragment])
      setNewFragmentContent('')
      
      if (fragments.length >= 3) {
        await generateNewRule()
      }
    } catch (error) {
      console.error('Failed to create fragment:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateNewRule = async () => {
    try {
      const recentFragments = fragments.slice(-5)
      const ruleContent = await secondMeClient.generateRuleFromFragments(recentFragments)
      
      const newRule: GeneratedRule = {
        id: `rule-${Date.now()}`,
        content: ruleContent,
        sourceFragments: recentFragments.map(f => f.id),
        consensusScore: Math.random() * 0.2 + 0.8,
        active: true
      }
      
      setRules([...rules, newRule])
    } catch (error) {
      console.error('Failed to generate rule:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'value': return 'from-blue-500 to-cyan-500'
      case 'rule': return 'from-purple-500 to-pink-500'
      case 'vision': return 'from-amber-500 to-orange-500'
      case 'story': return 'from-emerald-500 to-teal-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'value':
        return <Sparkles className="w-5 h-5" />
      case 'rule':
        return <BookOpen className="w-5 h-5" />
      case 'vision':
        return <Globe className="w-5 h-5" />
      case 'story':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Plus className="w-5 h-5" />
    }
  }

  if (viewMode === '3d') {
    return <Nation3DPage />
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => router.push('/profile')}
          className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-purple-500/50 hover:bg-black/90 transition-all"
        >
          <UserIcon className="w-5 h-5 text-purple-400" />
        </button>
        <button
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-purple-500/50 hover:bg-black/90 transition-all"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">{onlineUsers.length + 1} 在线</span>
          </div>
        </button>
        
        <button
          onClick={() => router.push('/login')}
          className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-purple-500/50 hover:bg-black/90 transition-all"
        >
          <LogOut className="w-5 h-5 text-red-400" />
        </button>
      </div>

      {showOnlineUsers && (
        <div className="fixed top-20 right-4 z-40 bg-black/90 backdrop-blur-xl rounded-xl p-6 border border-purple-500/50 max-w-sm">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            在线用户
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{currentUser.name}</div>
                <div className="text-xs text-purple-300">您（当前用户）</div>
              </div>
              <ViewEye className="w-5 h-5 text-purple-400" />
            </div>
            
            {onlineUsers.map((user) => (
              <div 
                key={user.userId}
                className="flex items-center gap-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer"
                onClick={() => setSpectating(true, user.userId)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{user.userName}</div>
                  <div className="text-xs text-purple-300">{user.action}</div>
                </div>
                <ViewEye className="w-5 h-5 text-purple-400 hover:text-green-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isSpectating && spectatingUserId && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black/90 backdrop-blur-xl rounded-xl p-4 border border-green-500/50">
          <div className="flex items-center gap-3">
            <ViewEye className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">
              正在围观：{onlineUsers.find(u => u.userId === spectatingUserId)?.userName}
            </span>
            <button
              onClick={() => setSpectating(false)}
              className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
            >
              退出围观
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text pb-2">
            理想国
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            由数字分身的理想碎片构成的、不断演化的自由世界
          </p>
          <div className="flex justify-center gap-8 text-sm text-purple-300">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{nation?.totalAvatars || 0} 个数字分身在线</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{fragments.length} 个理想碎片</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{rules.length} 条生成规则</span>
            </div>
          </div>
        </header>

        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setViewMode('3d')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
          >
            <Box className="w-6 h-6 mr-2" />
            进入3D理想国
          </button>
          
          <button
            onClick={() => router.push('/ai-observation')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
          >
            <Activity className="w-6 h-6 mr-2" />
            AI自主模式
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Plus className="w-6 h-6" />
                创建理想碎片
              </h2>
              
              <div className="flex gap-2 mb-4">
                {['value', 'rule', 'vision', 'story'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as 'value' | 'rule' | 'vision' | 'story')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-purple-200 border border-purple-500/30'
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span className="ml-2">
                      {type === 'value' && '价值观'}
                      {type === 'rule' && '规则'}
                      {type === 'vision' && '愿景'}
                      {type === 'story' && '故事'}
                    </span>
                  </button>
                ))}
              </div>

              <textarea
                value={newFragmentContent}
                onChange={(e) => setNewFragmentContent(e.target.value)}
                placeholder={`输入您的${selectedType === 'value' ? '价值观' : selectedType === 'rule' ? '规则' : selectedType === 'vision' ? '愿景' : '故事'}...`}
                className="w-full h-32 bg-black/30 border border-purple-500/30 rounded-lg p-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              />

              <button
                onClick={handleCreateFragment}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
              >
                提交到理想国
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                演化阶段 {nation?.evolutionStage || 1}
              </h3>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-purple-300 mb-2">当前规则共识度</div>
                  <div className="text-3xl font-bold text-white">
                    {rules.length > 0 
                      ? Math.round(rules.reduce((sum, r) => sum + r.consensusScore, 0) / rules.length * 100)
                      : 0}%
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-purple-300 mb-2">平均碎片强度</div>
                  <div className="text-3xl font-bold text-white">
                    {fragments.length > 0 
                      ? (fragments.reduce((sum, f) => sum + f.strength, 0) / fragments.length).toFixed(2)
                      : '0.00'}
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-purple-300 mb-2">规则活跃数</div>
                  <div className="text-3xl font-bold text-white">
                    {rules.filter(r => r.active).length} / {rules.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            理想碎片展示
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fragments.map((fragment) => (
              <div
                key={fragment.id}
                className="fragment-card group cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`rule-badge bg-gradient-to-r ${getTypeColor(fragment.type)}`}>
                    {fragment.type === 'value' && '价值观'}
                    {fragment.type === 'rule' && '规则'}
                    {fragment.type === 'vision' && '愿景'}
                    {fragment.type === 'story' && '故事'}
                  </div>
                  <div className="text-xs text-purple-300">
                    强度: {(fragment.strength * 100).toFixed(0)}%
                  </div>
                </div>
                
                <p className="text-white text-base leading-relaxed mb-4">
                  {fragment.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {fragment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-purple-300">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>分身: {fragment.owner}</span>
                  </div>
                  <div>
                    {new Date(fragment.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            生成的规则
          </h2>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
                  rule.active 
                    ? 'border-green-500/50 hover:border-green-500' 
                    : 'border-red-500/30 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      rule.active ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <h3 className="text-xl font-bold text-white">
                      {rule.content}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-300 mb-1">共识度</div>
                    <div className="text-2xl font-bold text-white">
                      {(rule.consensusScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>来源: {rule.sourceFragments.length} 个碎片</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule.active 
                      ? 'bg-green-500/30 text-green-300' 
                      : 'bg-red-500/30 text-red-300'
                  }`}>
                    {rule.active ? '活跃' : '已停用'}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {rule.sourceFragments.slice(0, 3).map((fragId, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                    >
                      {fragId}
                    </span>
                  ))}
                  {rule.sourceFragments.length > 3 && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      +{rule.sourceFragments.length - 3}
                    </span>
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
