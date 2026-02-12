'use client'

import { useState, useEffect } from 'react'
import { Users, MessageCircle, Sparkles, BookOpen, Play, Pause, RotateCw, Activity } from 'lucide-react'
import { aiAvatarBehavior, AIAvatar, AIFragment, AIConversation } from '../../lib/ai-avatar-behavior'

export default function AIObservationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [avatars, setAvatars] = useState<AIAvatar[]>([])
  const [fragments, setFragments] = useState<AIFragment[]>([])
  const [rules, setRules] = useState<any[]>([])
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatars(aiAvatarBehavior.getAvatars())
      setFragments(aiAvatarBehavior.getFragments())
      setRules(aiAvatarBehavior.getRules())
      setConversations(aiAvatarBehavior.getConversations())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'idle': return 'text-gray-400'
      case 'walking': return 'text-blue-400'
      case 'building': return 'text-amber-400'
      case 'interacting': return 'text-purple-400'
      case 'thinking': return 'text-cyan-400'
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
      default: return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text pb-2">
            AI理想国 - 自主交互模式
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            观察AI分身如何自主交互、创造理想碎片、生成规则
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
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

          <div className="grid grid-cols-4 gap-4 text-sm text-purple-300 mb-8">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span>{avatars.length} 个AI分身</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{fragments.length} 个理想碎片</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span>{rules.length} 条生成规则</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              <span>{conversations.length} 次对话</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Activity className="w-6 h-6 text-purple-400" />
                AI分身实时活动
              </h2>
              
              <div className="space-y-4">
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
                          <div className="text-xs text-purple-300">
                            {avatar.personality}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${getActionColor(avatar.action)}`}>
                        {getActionText(avatar.action)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-purple-300 mb-1">位置</div>
                        <div className="text-white font-mono">
                          ({avatar.position[0].toFixed(1)}, {avatar.position[1].toFixed(1)})
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="text-purple-300 mb-1">目标</div>
                        <div className="text-white text-xs">
                          {avatar.goals.slice(0, 2).join('、')}
                          {avatar.goals.length > 2 && '...'}
                        </div>
                      </div>
                    </div>

                    {avatar.memories.length > 0 && (
                      <div className="mt-3 bg-purple-500/10 rounded-lg p-3">
                        <div className="text-purple-300 text-xs mb-1">记忆</div>
                        <div className="text-white text-xs">
                          {avatar.memories.slice(0, 2).join('、')}
                          {avatar.memories.length > 2 && '...'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                AI对话记录
              </h2>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {conversations.map((conversation) => (
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
                      <div className="text-sm text-purple-200 mb-2">
                        <span className="font-medium">主题：</span>
                        {conversation.topic}
                      </div>
                    )}

                    <div className="space-y-2">
                      {conversation.messages.slice(-3).map((message, index) => (
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
                                ? 'bg-purple-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            <div className="text-xs text-purple-200 mb-1">
                              {avatars.find(a => a.id === message.senderId)?.name || '未知'}
                            </div>
                            <div className="text-white">
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

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
                最新理想碎片
              </h2>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {fragments.slice(-10).map((fragment) => (
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

                    <p className="text-white text-base mb-2">
                      {fragment.content}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="text-purple-300">
                        创建者：{avatars.find(a => a.id === fragment.owner)?.name || '未知'}
                      </div>
                      {fragment.aiReasoning && (
                        <div className="text-cyan-300">
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
      </div>
    </div>
  )
}