// WebSocket 模拟服务器
// 用于在本地开发环境中模拟 WebSocket 通信

import { WebSocketMessage } from './websocket-client'

interface MockClient {
  send: (message: WebSocketMessage) => void
  onMessage: (message: WebSocketMessage) => void
}

export class WebSocketMockServer {
  private clients: Set<MockClient>
  private messageHandlers: Map<string, ((message: WebSocketMessage, client: MockClient) => void)[]>
  private isRunning: boolean

  constructor() {
    this.clients = new Set()
    this.messageHandlers = new Map()
    this.isRunning = false
  }

  start(): void {
    this.isRunning = true
    console.log('WebSocket mock server started')
  }

  stop(): void {
    this.isRunning = false
    this.clients.clear()
    console.log('WebSocket mock server stopped')
  }

  registerClient(client: MockClient): void {
    this.clients.add(client)
    console.log(`Client connected. Total clients: ${this.clients.size}`)
    // 发送连接成功消息
    client.send({
      type: 'connected',
      data: { message: 'Connected to mock server' },
      timestamp: Date.now()
    })
  }

  unregisterClient(client: MockClient): void {
    this.clients.delete(client)
    console.log(`Client disconnected. Total clients: ${this.clients.size}`)
  }

  onMessage(type: string, handler: (message: WebSocketMessage, client: MockClient) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)?.push(handler)
  }

  broadcast(type: string, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now()
    }
    this.clients.forEach(client => client.send(message))
  }

  sendToClient(client: MockClient, type: string, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now()
    }
    client.send(message)
  }

  handleClientMessage(client: MockClient, message: WebSocketMessage): void {
    if (!this.isRunning) return

    // 处理消息
    if (this.messageHandlers.has(message.type)) {
      const handlers = this.messageHandlers.get(message.type)!
      handlers.forEach(handler => handler(message, client))
    }

    // 广播消息给其他客户端
    this.clients.forEach(otherClient => {
      if (otherClient !== client) {
        otherClient.send(message)
      }
    })
  }

  // 模拟数字分身活动
  simulateAvatarActivity(): void {
    setInterval(() => {
      if (!this.isRunning) return

      const activities = [
        'idle',
        'walking',
        'thinking',
        'interacting',
        'creating'
      ]

      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      const avatarId = `avatar-${Math.floor(Math.random() * 4) + 1}`

      this.broadcast('avatar_update', {
        avatarId,
        updates: {
          action: randomActivity,
          position: [
            (Math.random() - 0.5) * 20,
            0,
            (Math.random() - 0.5) * 20
          ],
          timestamp: Date.now()
        }
      })
    }, 5000)
  }

  // 模拟对话
  simulateConversation(): void {
    setInterval(() => {
      if (!this.isRunning) return

      const topics = [
        '人工智能的未来发展',
        '理想国的构建',
        '数字分身的意义',
        '科技与人文的关系',
        '创意与创新'
      ]

      const randomTopic = topics[Math.floor(Math.random() * topics.length)]
      const avatar1Id = `avatar-${Math.floor(Math.random() * 4) + 1}`
      let avatar2Id = `avatar-${Math.floor(Math.random() * 4) + 1}`
      while (avatar2Id === avatar1Id) {
        avatar2Id = `avatar-${Math.floor(Math.random() * 4) + 1}`
      }

      const conversationId = `conv-${Date.now()}`
      const messages = [
        {
          senderId: avatar1Id,
          content: `你好，我是一个数字分身，对"${randomTopic}"很感兴趣。`,
          timestamp: new Date()
        },
        {
          senderId: avatar2Id,
          content: `你好！我也对这个话题很感兴趣，我们可以一起讨论。`,
          timestamp: new Date(Date.now() + 2000)
        }
      ]

      this.broadcast('conversation_started', {
        conversationId,
        participants: [avatar1Id, avatar2Id],
        topic: randomTopic,
        messages
      })
    }, 15000)
  }

  // 模拟理想碎片创建
  simulateFragmentCreation(): void {
    setInterval(() => {
      if (!this.isRunning) return

      const types = ['value', 'rule', 'vision', 'story']
      const randomType = types[Math.floor(Math.random() * types.length)]
      const avatarId = `avatar-${Math.floor(Math.random() * 4) + 1}`

      const fragments = {
        value: '数字世界应该是一个平等、自由的空间，每个数字分身都有表达自己的权利。',
        rule: '数字分身之间的交流应该尊重彼此的个性和观点，避免恶意攻击。',
        vision: '未来的理想国将是一个由数字分身和人类共同构建的和谐社会。',
        story: '在理想国中，一个数字分身通过自己的努力和创意，为整个社区带来了新的希望和活力。'
      }

      this.broadcast('fragment_created', {
        id: `frag-${Date.now()}`,
        type: randomType,
        content: fragments[randomType as keyof typeof fragments],
        strength: 0.7 + Math.random() * 0.3,
        createdAt: new Date(),
        tags: [randomType, 'ideal', 'nation'],
        owner: avatarId,
        aiReasoning: '基于数字分身的个性和目标创建'
      })
    }, 10000)
  }
}

// 创建默认模拟服务器实例
export const wsMockServer = new WebSocketMockServer()
