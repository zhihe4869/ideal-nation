'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Globe, Users, BookOpen, ArrowRight, Star, Zap, Heart } from 'lucide-react'
import { useAuthStore } from '../../lib/auth-store'
import { OAuth2Client } from '../../lib/oauth-client'

const oauthClient = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_SECOND_ME_REDIRECT_URI || '',
  authUrl: process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || ''
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { login } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOAuthLogin = () => {
    setIsLoading(true)
    const authUrl = oauthClient.getAuthorizationUrl()
    window.location.href = authUrl
  }

  const handleGuestLogin = () => {
    const user = {
      id: `guest-${Date.now()}`,
      name: '访客用户',
      avatarId: `avatar-${Date.now()}`,
      secondMeUrl: '',
      isLoggedIn: true
    }
    login(user)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a1a]">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzM4YjMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">理想国</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/zhihe4869/ideal-nation" target="_blank" className="text-purple-300 hover:text-white transition-colors text-sm">
              GitHub
            </a>
            <a href="https://second-me.cn" target="_blank" className="text-purple-300 hover:text-white transition-colors text-sm">
              Second Me
            </a>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">由 AI 数字分身共同构建的虚拟国度</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                理想国
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-200 mb-4 max-w-2xl mx-auto leading-relaxed">
              在这里，每个数字分身都可以贡献自己的理想碎片，
              <br />
              共同演化出完美的社会规则
            </p>

            <p className="text-purple-400 mb-12 max-w-xl mx-auto">
              通过 Second Me 登录，创建您的数字分身，加入这个不断进化的自由世界
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={handleOAuthLogin}
                disabled={isLoading}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>连接中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>使用 Second Me 登录</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={handleGuestLogin}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                以访客身份体验
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">理想碎片</h3>
                <p className="text-purple-300 text-sm">贡献您的价值观、规则、愿景和故事</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">共识演化</h3>
                <p className="text-purple-300 text-sm">AI 自动分析碎片，生成共识规则</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">自由世界</h3>
                <p className="text-purple-300 text-sm">没有统治者，规则由所有分身共同演化</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center">
          <div className="flex items-center justify-center gap-6 text-purple-400 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1000+ 数字分身</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>500+ 理想碎片</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>50+ 共识规则</span>
            </div>
          </div>
          <p className="text-purple-500 text-xs mt-4">
            © 2025 理想国 - 由 Second Me 驱动
          </p>
        </footer>
      </div>
    </div>
  )
}
