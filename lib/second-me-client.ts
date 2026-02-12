// Second Me API Client
// 基于Second Me Local Chat API文档

export interface SecondMeMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface SecondMeMetadata {
  enable_l0_retrieval?: boolean
  role_id?: string
}

export interface SecondMeChatRequest {
  messages: SecondMeMessage[]
  metadata?: SecondMeMetadata
  stream?: boolean
  model?: string
  temperature?: number
  max_tokens?: number
}

export interface SecondMeChatResponse {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
  choices: Array<{
    index: number
    delta: {
      content?: string
    }
    finish_reason: string | null
  }>
}

export class SecondMeClient {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string = 'http://localhost:8002', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async chat(request: SecondMeChatRequest): Promise<SecondMeChatResponse> {
    const url = `${this.baseUrl}/api/kernel2/chat`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          stream: false, // 默认不使用流式响应
        }),
      })

      if (!response.ok) {
        throw new Error(`Second Me API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Second Me API call failed:', error)
      throw error
    }
  }

  async chatStream(
    request: SecondMeChatRequest,
    onChunk: (content: string) => void,
    onComplete: () => void
  ): Promise<void> {
    const url = `${this.baseUrl}/api/kernel2/chat`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Second Me API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') {
            onComplete()
            return
          }

          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6)
              const data = JSON.parse(jsonStr)
              
              if (data.choices && data.choices[0]) {
                const content = data.choices[0].delta?.content
                if (content) {
                  onChunk(content)
                }
              }
            } catch (e) {
              console.error('Failed to parse chunk:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Second Me streaming failed:', error)
      throw error
    }
  }

  async generateRuleFromFragments(fragments: IdealFragment[]): Promise<string> {
    const fragmentsText = fragments
      .map(f => `[${f.type}] ${f.content}`)
      .join('\n')

    const systemPrompt = `你是一个理想国的规则生成器。基于用户提供的理想碎片，生成一条新的规则。
规则应该：
1. 反映碎片的共同价值观
2. 简洁明了
3. 具有可操作性
4. 符合理想国的核心理念：自由、平等、演化

只返回规则内容，不要其他解释。`

    const request: SecondMeChatRequest = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fragmentsText },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }

    const response = await this.chat(request)
    return response.choices[0].delta.content || ''
  }

  async analyzeFragment(fragment: IdealFragment): Promise<{
    strength: number
    tags: string[]
  }> {
    const systemPrompt = `你是一个理想碎片分析器。分析用户提供的理想碎片，返回：
1. strength: 碎片强度（0-1.0之间的浮点数）
2. tags: 相关标签数组（3-5个）

以JSON格式返回，例如：
{
  "strength": 0.95,
  "tags": ["自由", "平等", "创新"]
}`

    const request: SecondMeChatRequest = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fragment.content },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }

    const response = await this.chat(request)
    const content = response.choices[0].delta.content || '{}'
    
    try {
      return JSON.parse(content)
    } catch (e) {
      return {
        strength: 0.8,
        tags: ['未知'],
      }
    }
  }
}

export interface IdealFragment {
  id: string
  type: 'value' | 'rule' | 'vision' | 'story'
  content: string
  strength: number
  createdAt: Date
  tags: string[]
  owner: string
}

export const secondMeClient = new SecondMeClient(
  process.env.NEXT_PUBLIC_SECOND_ME_URL || 'http://localhost:8002',
  process.env.NEXT_PUBLIC_SECOND_ME_API_KEY
)