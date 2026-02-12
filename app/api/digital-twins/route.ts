// 数字分身列表 API 端点
// 用于获取所有用户的数字分身列表

import { NextRequest, NextResponse } from 'next/server'

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

// 模拟用户数据
const mockUsers = [
  {
    id: 'user-1',
    username: '理想国公民',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cyberpunk%20user%20avatar&size=512x512'
  },
  {
    id: 'user-2',
    username: '科技爱好者',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=tech%20enthusiast%20avatar&size=512x512'
  },
  {
    id: 'user-3',
    username: '艺术创作者',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=artistic%20creator%20avatar&size=512x512'
  }
]

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
  },
  {
    id: 'twin-5',
    userId: 'user-2',
    name: '数据分析专家',
    description: '通过数据洞察未来',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=data%20analyst%20cyberpunk%20avatar&size=512x512',
    personality: '严谨、客观、注重事实',
    skills: ['数据分析', '可视化', '预测建模'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'twin-6',
    userId: 'user-3',
    name: '音乐制作人',
    description: '创造触动心灵的音乐',
    avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=music%20producer%20cyberpunk%20avatar&size=512x512',
    personality: '感性、富有激情、注重细节',
    skills: ['音乐创作', '编曲', '混音'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// 为数字分身添加用户信息
const enhancedDigitalTwins = mockDigitalTwins.map(twin => {
  const user = mockUsers.find(u => u.id === twin.userId)
  return {
    ...twin,
    user: user ? {
      id: user.id,
      username: user.username,
      avatar: user.avatar
    } : undefined
  }
})

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')
    const skill = searchParams.get('skill')

    // 过滤数字分身
    let filteredTwins = [...enhancedDigitalTwins]

    if (userId) {
      filteredTwins = filteredTwins.filter(twin => twin.userId === userId)
    }

    if (skill) {
      filteredTwins = filteredTwins.filter(twin => 
        twin.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      )
    }

    // 分页
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedTwins = filteredTwins.slice(start, end)

    // 返回结果
    return NextResponse.json({
      total: filteredTwins.length,
      page,
      limit,
      data: paginatedTwins
    })
  } catch (error) {
    console.error('Error fetching digital twins:', error)
    
    // 如果出错，返回所有数字分身
    return NextResponse.json({
      total: enhancedDigitalTwins.length,
      page: 1,
      limit: enhancedDigitalTwins.length,
      data: enhancedDigitalTwins
    })
  }
}
