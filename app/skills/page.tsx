'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowLeft, Play, Plus, Trash2, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Skill {
  id: string
  name: string
  description: string
  inputModes: string[]
  outputModes: string[]
  examples: string[]
  category: 'chat' | 'analysis' | 'generation' | 'automation' | 'other'
}

export default function SkillsPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')
  const [testing, setTesting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/skills')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch skills')
      }
      const data = await response.json()
      setSkills(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSkills()
    setRefreshing(false)
  }

  const handleTestSkill = async (skill: Skill) => {
    if (!testInput.trim()) {
      setError('请输入测试内容')
      return
    }

    setTesting(true)
    setError('')
    setTestOutput('')

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId: skill.id,
          input: testInput
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to call skill')
      }

      const data = await response.json()
      setTestOutput(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to call skill')
    } finally {
      setTesting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      chat: 'bg-blue-600/30 text-blue-300',
      analysis: 'bg-green-600/30 text-green-300',
      generation: 'bg-purple-600/30 text-purple-300',
      automation: 'bg-orange-600/30 text-orange-300',
      other: 'bg-gray-600/30 text-gray-300'
    }
    return colors[category as keyof typeof colors] || colors.other
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
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回个人资料</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Skills 管理</h1>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 mb-6">
                {error}
              </div>
            )}

            {skills.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-purple-300 text-lg mb-2">暂无 Skills</p>
                <p className="text-purple-400 text-sm">请先在 Agent Card 中配置 Skills</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-black/30 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="text-white font-semibold">{skill.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(skill.category)}`}>
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm mb-4">{skill.description}</p>
                    <div className="space-y-2">
                      <div className="text-xs text-purple-400">
                        <span className="font-medium">输入模式:</span> {skill.inputModes.join(', ')}
                      </div>
                      <div className="text-xs text-purple-400">
                        <span className="font-medium">输出模式:</span> {skill.outputModes.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSkill && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">测试: {selectedSkill.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  关闭
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    测试输入
                  </label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="输入测试内容..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                </div>

                <button
                  onClick={() => handleTestSkill(selectedSkill)}
                  disabled={testing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                >
                  {testing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>测试中...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>运行测试</span>
                    </>
                  )}
                </button>

                {testOutput && (
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      测试输出
                    </label>
                    <pre className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-purple-200 text-sm overflow-auto max-h-96">
                      {testOutput}
                    </pre>
                  </div>
                )}

                <div>
                  <h3 className="text-purple-300 font-semibold mb-3">示例</h3>
                  <div className="space-y-2">
                    {selectedSkill.examples.map((example, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-black/30 rounded-lg border border-purple-500/20 text-purple-200 text-sm"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">API 文档</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-purple-300 font-semibold mb-2">获取所有 Skills</h3>
                <code className="block px-4 py-2 bg-black/30 rounded-lg text-purple-200 text-sm">
                  GET /api/skills
                </code>
              </div>
              <div>
                <h3 className="text-purple-300 font-semibold mb-2">调用 Skill</h3>
                <code className="block px-4 py-2 bg-black/30 rounded-lg text-purple-200 text-sm">
                  POST /api/skills
                </code>
                <pre className="mt-2 px-4 py-2 bg-black/30 rounded-lg text-purple-200 text-sm">
                  {`{
  "skillId": "skill-id",
  "input": "your input"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
