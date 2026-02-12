// 用户信息 API 端点

import { NextRequest, NextResponse } from 'next/server'
import { secondMeClient } from '@/lib/second-me-client'

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
}

interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  agentCard?: {
    id: string
    name: string
    description: string
    avatar: string
    skills: {
      id: string
      name: string
      description: string
      inputModes: string[]
      outputModes: string[]
      examples: string[]
      category: 'chat' | 'analysis' | 'generation' | 'automation' | 'other'
    }[]
    endpoints: {
      chat: string
      skills: string
    }
    createdAt: string
    updatedAt: string
  }
}

// 模拟用户数据
const mockUserInfo: UserInfo = {
  id: 'user-1',
  username: '理想国公民',
  email: 'user@example.com',
  avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cyberpunk%20digital%20avatar&size=512x512',
  bio: '由 AI 数字分身共同构建的虚拟国度的公民',
  createdAt: '2024-01-01T00:00:00Z',
  agentCard: {
    id: 'agent-card-1',
    name: '理想国使者',
    description: '代表理想国与其他数字分身交流的使者',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cyberpunk%20digital%20avatar%20with%20wings&size=512x512',
    skills: [
      {
        id: 'skill-1',
        name: '对话交流',
        description: '与其他数字分身进行自然的对话交流',
        inputModes: ['text'],
        outputModes: ['text'],
        examples: ['你好，很高兴认识你！', '今天天气怎么样？'],
        category: 'chat'
      },
      {
        id: 'skill-2',
        name: '创意生成',
        description: '生成创意内容和想法',
        inputModes: ['text'],
        outputModes: ['text', 'image'],
        examples: ['帮我想一个故事创意', '设计一个未来城市'],
        category: 'generation'
      },
      {
        id: 'skill-3',
        name: '问题分析',
        description: '分析和解决复杂问题',
        inputModes: ['text'],
        outputModes: ['text'],
        examples: ['如何解决城市交通拥堵问题？', '分析气候变化的影响'],
        category: 'analysis'
      }
    ],
    endpoints: {
      chat: 'https://api.example.com/chat',
      skills: 'https://api.example.com/skills'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}

// 模拟数字分身数据
const mockDigitalTwins: DigitalTwin[] = [
  {
    id: 'twin-1',
    userId: 'user-1',
    name: '智慧守护者',
    description: '守护理想国的智慧与知识',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wise%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '睿智、沉稳、充满洞察力',
    skills: ['对话交流', '问题分析', '知识分享'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'twin-2',
    userId: 'user-1',
    name: '创意先锋',
    description: '为理想国带来无限创意',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=creative%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '活泼、创新、富有想象力',
    skills: ['创意生成', '艺术创作', '故事讲述'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'twin-3',
    userId: 'user-2',
    name: '科技达人',
    description: '专注于科技与创新',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=tech%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '理性、逻辑、技术导向',
    skills: ['编程', '数据分析', '技术咨询'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'twin-4',
    userId: 'user-3',
    name: '艺术大师',
    description: '用艺术诠释理想国的美',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=artistic%20cyberpunk%20digital%20avatar&size=512x512',
    personality: '感性、细腻、审美独特',
    skills: ['绘画', '音乐', '设计'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取认证令牌
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')

    // 检查是否有认证信息
    if (!authHeader && !cookieHeader) {
      return NextResponse.json(
        { error: 'Unauthorized: No authentication token provided' },
        { status: 401 }
      )
    }

    // 这里应该从认证令牌中获取用户信息
    // 由于是模拟环境，我们直接返回模拟数据
    
    // 模拟从 Second Me API 获取数据
    // const userInfo = await secondMeClient.getUserInfo()

    // 返回模拟用户信息
    return NextResponse.json({
      ...mockUserInfo,
      digitalTwins: mockDigitalTwins.filter(twin => twin.userId === mockUserInfo.id)
    })
  } catch (error) {
    console.error('Error fetching user info:', error)
    
    // 如果出错，返回模拟数据
    return NextResponse.json({
      ...mockUserInfo,
      digitalTwins: mockDigitalTwins.filter(twin => twin.userId === mockUserInfo.id)
    })
  }
}
