import { Suspense } from 'react'
import DigitalTwinWorldContent from './DigitalTwinWorldContent'

export default function DigitalTwinWorldPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-300">加载数字分身世界...</p>
        </div>
      </div>
    }>
      <DigitalTwinWorldContent />
    </Suspense>
  )
}
