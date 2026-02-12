'use client'

import { useState, useEffect } from 'react'
import { User, Save, ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

export default function AgentCardPage() {
  const router = useRouter()
  const [agentCard, setAgentCard] = useState<AgentCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: ''
  })

  useEffect(() => {
    fetchAgentCard()
  }, [])

  const fetchAgentCard = async () => {
    try {
      const response = await fetch('/api/agent-card')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch agent card')
      }
      const data = await response.json()
      setAgentCard(data)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        avatar: data.avatar || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agent card')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/agent-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: agentCard?.skills || [],
          endpoints: agentCard?.endpoints || {
            chat: '/api/chat',
            skills: '/api/skills'
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save agent card')
      }

      const data = await response.json()
      setAgentCard(data)
      setSuccess('Agent Card 保存成功！')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agent card')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
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
          onClick={() => router.push('/profile')}
          className="mb-6 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回个人资料</span>
        </button>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">管理 Agent Card</h1>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-300 mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  AI 分身名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：我的数字分身"
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述您的 AI 分身的特点和能力..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  头像 URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.png"
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>保存中...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>保存 Agent Card</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {agentCard && agentCard.skills.length > 0 && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">已配置的 Skills</h2>
                </div>
                <button
                  onClick={() => router.push('/skills')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>添加 Skills</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentCard.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-black/30 rounded-lg p-4 border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{skill.name}</h3>
                      <span className="px-2 py-1 bg-purple-600/30 rounded text-xs text-purple-300">
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">API 端点</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-purple-300 font-semibold mb-2">Chat 端点</h3>
                <code className="block px-4 py-2 bg-black/30 rounded-lg text-purple-200 text-sm">
                  {agentCard?.endpoints.chat || '/api/chat'}
                </code>
              </div>
              <div>
                <h3 className="text-purple-300 font-semibold mb-2">Skills 端点</h3>
                <code className="block px-4 py-2 bg-black/30 rounded-lg text-purple-200 text-sm">
                  {agentCard?.endpoints.skills || '/api/skills'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
