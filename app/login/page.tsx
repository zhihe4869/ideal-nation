'use client'

import { useState, useEffect } from 'react'
import { LogIn, User, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react'
import { useAuthStore } from '../../lib/auth-store'
import { OAuth2Client } from '../../lib/oauth-client'

const oauthClient = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_SECOND_ME_REDIRECT_URI || '',
  authUrl: process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || ''
})

export default function LoginPage() {
  const [secondMeUrl, setSecondMeUrl] = useState('http://localhost:8002')
  const [userName, setUserName] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [oauthError, setOauthError] = useState('')
  
  const { login } = useAuthStore()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error) {
      setOauthError(decodeURIComponent(error))
    }
  }, [])

  const handleOAuthLogin = () => {
    const authUrl = oauthClient.getAuthorizationUrl()
    window.location.href = authUrl
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // 验证Second Me连接
      const response = await fetch(`${secondMeUrl}/api/kernel2/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello' }
          ],
          stream: false,
          max_tokens: 10
        }),
      })

      if (!response.ok) {
        throw new Error('无法连接到Second Me，请检查URL是否正确')
      }

      // 创建用户
      const user = {
        id: `user-${Date.now()}`,
        name: userName || '匿名用户',
        avatarId: `avatar-${Date.now()}`,
        secondMeUrl,
        isLoggedIn: true
      }

      login(user)
      
      // 保存到localStorage
      localStorage.setItem('ideal-nation-secondme-url', secondMeUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIDEwMCIgeG1sPSJodHRwOi8vd3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIDEwMCI+PC9zdmc+')] opacity-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              理想国
            </h1>
            <p className="text-purple-200 text-sm">
              登录Second Me，创建您的数字分身
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="输入您的用户名"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-purple-200">
                  Second Me URL
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrl(!showUrl)}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  {showUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showUrl ? '隐藏' : '显示'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showUrl ? 'text' : 'password'}
                  value={secondMeUrl}
                  onChange={(e) => setSecondMeUrl(e.target.value)}
                  placeholder="http://localhost:8002"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
              <p className="text-xs text-purple-400 mt-2">
                默认：http://localhost:8002
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {oauthError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                OAuth登录失败: {oauthError}
              </div>
            )}

            <button
              type="button"
              onClick={handleOAuthLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span>使用 Second Me 登录</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-purple-300">或者</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>连接中...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>直接连接本地 Second Me</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center space-y-2 text-sm text-purple-300">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>需要Second Me运行在本地</span>
              </p>
              <p className="text-xs text-purple-400">
                如果还没有Second Me，请访问
                <a 
                  href="https://github.com/mindverse/Second-Me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Second Me GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}