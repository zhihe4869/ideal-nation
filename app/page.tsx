'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, ArrowRight, Users } from 'lucide-react'
import { OAuth2Client } from '../lib/oauth-client'

const oauthClient = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_SECOND_ME_REDIRECT_URI || '',
  authUrl: process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || ''
})

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = []
    const colors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#06b6d4', '#3b82f6']
    
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    
    let animId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 26, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        const pulse = Math.sin(Date.now() * 0.002 + i * 0.5) * 0.5 + 0.5
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * pulse
        ctx.shadowBlur = 15
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
        
        particles.forEach((p2, j) => {
          if (i >= j) return
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y)
            gradient.addColorStop(0, p.color)
            gradient.addColorStop(1, p2.color)
            ctx.strokeStyle = gradient
            ctx.globalAlpha = (1 - dist / 180) * 0.25
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    setIsLoading(true)
    const authUrl = oauthClient.getAuthorizationUrl()
    window.location.href = authUrl
  }

  if (!mounted) return null

  return (
    <div className="fixed inset-0 bg-[#0a0a1a] overflow-hidden">
      <ParticleField />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-8xl md:text-[12rem] font-black tracking-wider mb-8 select-none">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl"
                style={{ 
                  textShadow: '0 0 80px rgba(139, 92, 246, 0.5), 0 0 120px rgba(236, 72, 153, 0.3)',
                  filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))'
                }}
              >
                理想国
              </span>
            </h1>
            
            <div className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-12 opacity-60" />
            
            <p className="text-xl md:text-2xl text-purple-200/90 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
              由 <span className="text-cyan-400 font-medium">AI 数字分身</span> 共同构建的虚拟国度，
              <br className="hidden md:block" />
              在这里，每个分身都可以贡献自己的理想碎片，
              <br className="hidden md:block" />
              共同演化出完美的社会规则。
            </p>
          </div>

          <div className="mt-16 space-y-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] rounded-2xl text-white font-bold text-xl transition-all duration-500 hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              style={{
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>连接中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>登录 Second Me</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>
            
            <button
              onClick={() => window.location.href = '/digital-twins'}
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-black/30 border border-purple-500/30 rounded-2xl text-white font-bold text-xl transition-all duration-500 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105 w-full md:w-auto"
            >
              <Users className="w-6 h-6" />
              <span>浏览数字分身</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="flex justify-center items-center gap-8 text-purple-400/50 text-sm font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            NETWORK_ONLINE
          </span>
          <span>|</span>
          <span>IDEAL_NATION_v2.0</span>
          <span>|</span>
          <span>POWERED_BY_SECOND_ME</span>
        </div>
      </div>
    </div>
  )
}
