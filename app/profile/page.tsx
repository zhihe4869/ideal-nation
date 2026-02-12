'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Calendar, LogOut, Settings, Activity, Sparkles, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  agentCard?: AgentCard
}

interface AgentCard {
  id: string
  name: string
  description: string
  avatar: string
  skills: Skill[]
  endpoints: {
    chat: string
    skills: string
  }
  createdAt: string
  updatedAt: string
}

interface Skill {
  id: string
  name: string
  description: string
  inputModes: string[]
  outputModes: string[]
  examples: string[]
  category: 'chat' | 'analysis' | 'generation' | 'automation' | 'other'
}

export default function ProfilePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }
      const data = await response.json()
      setUserInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user info')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    localStorage.removeItem('oauth_token')
    localStorage.removeItem('token_expires_at')
    router.push('/')
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
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
          >
            返回登录
          </button>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIDEwMCIgeG1sPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEwMCAxMDAgMTAwIj48L3N2Zz4=')] opacity-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回理想国</span>
        </button>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt={userInfo.username} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{userInfo.username}</h1>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Mail className="w-4 h-4" />
                    <span>{userInfo.email}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-300 hover:text-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>

            {userInfo.bio && (
              <div className="mb-6">
                <p className="text-purple-200">{userInfo.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">加入时间</span>
                </div>
                <p className="text-white font-semibold">
                  {new Date(userInfo.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Skills 数量</span>
                </div>
                <p className="text-white font-semibold">
                  {userInfo.agentCard?.skills.length || 0}
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">状态</span>
                </div>
                <p className="text-green-400 font-semibold">活跃</p>
              </div>
            </div>
          </div>

          {userInfo.agentCard && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">AI 分身卡</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-purple-300 font-semibold mb-2">名称</h3>
                  <p className="text-white">{userInfo.agentCard.name}</p>
                </div>
                <div>
                  <h3 className="text-purple-300 font-semibold mb-2">描述</h3>
                  <p className="text-white">{userInfo.agentCard.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-purple-300 font-semibold mb-4">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userInfo.agentCard.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-black/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <h4 className="text-white font-semibold">{skill.name}</h4>
                      </div>
                      <p className="text-purple-200 text-sm mb-3">{skill.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-purple-600/30 rounded text-xs text-purple-300">
                          {skill.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/agent-card')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
                >
                  <Settings className="w-4 h-4" />
                  <span>管理 Agent Card</span>
                </button>
                <button
                  onClick={() => router.push('/skills')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>管理 Skills</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">快速操作</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/ai-observation')}
                className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-1">AI 自主观察</h3>
                  <p className="text-purple-300 text-sm">围观 AI 分身们的自主交互</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/nation-3d')}
                className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-1">3D 理想国</h3>
                  <p className="text-purple-300 text-sm">探索沉浸式 3D 世界</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
