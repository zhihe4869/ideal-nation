'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, Sparkles, User, Star, Clock, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

interface DigitalTwinsResponse {
  total: number
  page: number
  limit: number
  data: DigitalTwin[]
}

export default function DigitalTwinsPage() {
  const router = useRouter()
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)

  useEffect(() => {
    fetchDigitalTwins()
  }, [page, searchTerm, skillFilter])

  const fetchDigitalTwins = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (skillFilter) {
        params.append('skill', skillFilter)
      }

      const response = await fetch(`/api/digital-twins?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch digital twins')
      }

      const data: DigitalTwinsResponse = await response.json()
      setDigitalTwins(data.data)
      setTotal(data.total)
    } catch (err) {
      setError('获取数字分身列表失败，请稍后重试')
      console.error('Error fetching digital twins:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const handleTwinClick = (twinId: string) => {
    router.push(`/digital-twins/${twinId}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text pb-2">
            数字分身画廊
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            探索由 Second Me 创建的各种数字分身，围观它们的独特个性和技能
          </p>

          {/* 搜索和过滤 */}
          <div className="max-w-4xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索数字分身..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div className="flex-1 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="按技能过滤..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/50 whitespace-nowrap"
              >
                搜索
              </button>
            </form>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-300 max-w-md text-center">
              <p className="font-semibold mb-2">错误</p>
              <p>{error}</p>
              <button
                onClick={fetchDigitalTwins}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
              >
                重试
              </button>
            </div>
          </div>
        ) : digitalTwins.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 text-purple-300 max-w-md text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <p className="font-semibold mb-2">暂无数字分身</p>
              <p>还没有用户创建数字分身，成为第一个创建者吧！</p>
            </div>
          </div>
        ) : (
          <>
            {/* 数字分身列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {digitalTwins.map((twin) => (
                <div
                  key={twin.id}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 group"
                  onClick={() => handleTwinClick(twin.id)}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-500/50">
                        <img
                          src={twin.avatar}
                          alt={twin.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-2 border-slate-900">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {twin.name}
                      </h3>
                      <p className="text-purple-300 text-sm mb-3">
                        {twin.personality}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-purple-400">
                        <User className="w-3 h-3" />
                        <span>{twin.user?.username || '未知用户'}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-purple-200 text-sm mb-6 line-clamp-3">
                    {twin.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-3">
                      <Tag className="w-4 h-4" />
                      <span>技能</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {twin.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-600/20 rounded-full text-xs text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                      {twin.skills.length > 5 && (
                        <span className="px-3 py-1 bg-black/30 rounded-full text-xs text-purple-400 border border-purple-500/20">
                          +{twin.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-purple-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(twin.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      <span>由 Second Me 创建</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-black/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                上一页
              </button>
              
              <span className="px-4 py-2 text-purple-300">
                第 {page} 页，共 {Math.ceil(total / limit)} 页
              </span>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
                className="px-4 py-2 rounded-lg bg-black/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
