// Second Me 客户端库
// 用于与 Second Me API 交互

import { OAuthToken } from './oauth-client'

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
  digitalTwins: DigitalTwin[]
}

class SecondMeClient {
  private apiUrl: string
  private token: OAuthToken | null

  constructor(apiUrl: string = 'https://second-me.cn', token: OAuthToken | null = null) {
    this.apiUrl = apiUrl
    this.token = token
  }

  setToken(token: OAuthToken): void {
    this.token = token
  }

  getToken(): OAuthToken | null {
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error('No authentication token provided')
    }

    const url = `${this.apiUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${this.token.token_type} ${this.token.access_token}`,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Second Me API request failed: ${error}`)
    }

    return await response.json()
  }

  // 获取用户信息
  async getUserInfo(): Promise<UserInfo> {
    return this.request<UserInfo>('/api/user')
  }

  // 获取用户的数字分身列表
  async getDigitalTwins(): Promise<DigitalTwin[]> {
    return this.request<DigitalTwin[]>('/api/digital-twins')
  }

  // 获取特定数字分身的详细信息
  async getDigitalTwin(twinId: string): Promise<DigitalTwin> {
    return this.request<DigitalTwin>(`/api/digital-twins/${twinId}`)
  }

  // 创建新的数字分身
  async createDigitalTwin(twinData: Partial<DigitalTwin>): Promise<DigitalTwin> {
    return this.request<DigitalTwin>('/api/digital-twins', {
      method: 'POST',
      body: JSON.stringify(twinData),
    })
  }

  // 更新数字分身信息
  async updateDigitalTwin(twinId: string, twinData: Partial<DigitalTwin>): Promise<DigitalTwin> {
    return this.request<DigitalTwin>(`/api/digital-twins/${twinId}`, {
      method: 'PUT',
      body: JSON.stringify(twinData),
    })
  }

  // 删除数字分身
  async deleteDigitalTwin(twinId: string): Promise<void> {
    await this.request<void>(`/api/digital-twins/${twinId}`, {
      method: 'DELETE',
    })
  }

  // 数字分身对话
  async chatWithDigitalTwin(twinId: string, message: string): Promise<{ response: string }> {
    return this.request<{ response: string }>(`/api/digital-twins/${twinId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  // 数字分身技能调用
  async callDigitalTwinSkill(twinId: string, skillId: string, parameters: any): Promise<any> {
    return this.request<any>(`/api/digital-twins/${twinId}/skills/${skillId}`, {
      method: 'POST',
      body: JSON.stringify(parameters),
    })
  }

  // 对话方法（用于数字分身之间的交流）
  async chat(messages: Array<{ role: string; content: string }>, temperature: number = 0.8, max_tokens: number = 200): Promise<any> {
    // 模拟对话响应
    const mockResponses = [
      "你好！很高兴认识你，我是一个数字分身。",
      "我对人工智能和数字世界很感兴趣，你呢？",
      "理想国是一个很有趣的概念，我们可以一起构建它。",
      "我认为数字分身之间的交流可以产生很多创意。",
      "科技的发展真是令人惊叹，不是吗？",
      "我喜欢思考未来的可能性。",
      "我们可以一起创造一些有意义的东西。",
      "数字世界和现实世界的融合是一个大趋势。"
    ]

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    // 模拟 API 响应格式
    return {
      choices: [
        {
          delta: {
            content: randomResponse
          }
        }
      ]
    }
  }

  // 从理想碎片生成规则
  async generateRuleFromFragments(fragments: any[]): Promise<string> {
    // 模拟规则生成
    const mockRules = [
      "数字分身之间的交流应该尊重彼此的个性和观点。",
      "理想碎片的创建应该基于真实的想法和感受。",
      "数字世界的规则应该公平公正，有利于所有数字分身。",
      "创意和创新应该得到鼓励和支持。",
      "数字分身应该有自由表达的权利。",
      "合作和共赢是构建理想国的基础。"
    ]

    return mockRules[Math.floor(Math.random() * mockRules.length)]
  }
}

// 创建默认客户端实例
export const secondMeClient = new SecondMeClient(
  process.env.NEXT_PUBLIC_SECOND_ME_API_URL || 'https://second-me.cn'
)

export type { DigitalTwin, UserInfo }
export { SecondMeClient }
