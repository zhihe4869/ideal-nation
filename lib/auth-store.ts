// 用户认证和状态管理
import { create } from 'zustand'

export interface User {
  id: string
  name: string
  avatarId: string
  secondMeUrl: string
  isLoggedIn: boolean
}

export interface Avatar {
  id: string
  userId: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  action: 'idle' | 'walking' | 'building' | 'interacting'
  color: string
  isOnline: boolean
  lastActivity: Date
}

export interface OnlineUser {
  userId: string
  userName: string
  avatarId: string
  position: [number, number, number]
  action: string
}

interface AuthState {
  currentUser: User | null
  onlineUsers: OnlineUser[]
  isSpectating: boolean
  spectatingUserId: string | null
  
  // Actions
  login: (user: User) => void
  logout: () => void
  updateOnlineUsers: (users: OnlineUser[]) => void
  setSpectating: (isSpectating: boolean, userId?: string) => void
  updateUserPosition: (position: [number, number, number]) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  onlineUsers: [],
  isSpectating: false,
  spectatingUserId: null,
  
  login: (user) => {
    set({ currentUser: user })
    localStorage.setItem('ideal-nation-user', JSON.stringify(user))
  },
  
  logout: () => {
    set({ 
      currentUser: null,
      isSpectating: false,
      spectatingUserId: null
    })
    localStorage.removeItem('ideal-nation-user')
  },
  
  updateOnlineUsers: (users) => {
    set({ onlineUsers: users })
  },
  
  setSpectating: (isSpectating, userId) => {
    set({ 
      isSpectating,
      spectatingUserId: userId || null
    })
  },
  
  updateUserPosition: (position) => {
    set((state) => ({
      currentUser: state.currentUser ? {
        ...state.currentUser,
        avatarId: state.currentUser.avatarId
      } : null
    }))
  }
}))

// 初始化时从localStorage加载用户
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('ideal-nation-user')
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser) as User
      useAuthStore.getState().login(user)
    } catch (e) {
      console.error('Failed to load saved user:', e)
    }
  }
}