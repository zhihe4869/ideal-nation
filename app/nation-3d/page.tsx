'use client'

import { useState } from 'react'
import { Box, Eye, EyeOff, ArrowLeft, RotateCw } from 'lucide-react'
import { IdealNation3D } from './IdealNation3D'

export default function Nation3DPage() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={() => setViewMode('2d')}
        className="absolute top-4 left-4 z-50 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/50 hover:bg-black/90 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-cyan-400" />
        <span className="ml-2 text-white font-medium">返回2D视图</span>
      </button>

      <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-purple-500/50">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">3D模式</span>
        </div>
        <div className="text-xs text-purple-300">
          拖拽旋转视角 | 滚轮缩放 | 点击分身进入控制
        </div>
      </div>

      <IdealNation3D />
    </div>
  )
}