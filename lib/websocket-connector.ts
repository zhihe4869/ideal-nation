// WebSocket 连接器
// 用于管理 WebSocket 连接，支持真实服务器和模拟服务器

import { WebSocketClient, wsClient } from './websocket-client'
import { wsMockServer } from './websocket-mock'
import { WebSocketMessage } from './websocket-client'

export class WebSocketConnector {
  private client: WebSocketClient
  private useMock: boolean

  constructor(useMock: boolean = true) {
    this.client = wsClient
    this.useMock = useMock

    if (useMock) {
      this.setupMockConnection()
    }
  }

  private setupMockConnection(): void {
    // 注册模拟客户端
    wsMockServer.registerClient(this.mockClient)
  }

  connect(url?: string): void {
    if (this.useMock) {
      // 启动模拟服务器
      wsMockServer.start()
      wsMockServer.simulateAvatarActivity()
      wsMockServer.simulateConversation()
      wsMockServer.simulateFragmentCreation()
      console.log('Connected to mock WebSocket server')
    } else {
      // 连接到真实服务器
      if (url) {
        // 这里可以创建一个新的 WebSocketClient 实例
        this.client = new WebSocketClient(url)
      }
      this.client.connect()
    }
  }

  disconnect(): void {
    if (this.useMock) {
      wsMockServer.stop()
    } else {
      this.client.disconnect()
    }
  }

  send(type: string, data: any): void {
    if (this.useMock) {
      // 模拟发送消息
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now()
      }
      wsMockServer.handleClientMessage(this.mockClient, message)
    } else {
      this.client.send(type, data)
    }
  }

  on(type: string, handler: (message: WebSocketMessage) => void): void {
    if (this.useMock) {
      // 模拟消息处理
      if (type === '*') {
        // 处理所有消息
        wsMockServer.onMessage('*', (message) => handler(message))
      } else {
        wsMockServer.onMessage(type, (message) => handler(message))
      }
    } else {
      this.client.on(type, handler)
    }
  }

  off(type: string, handler: (message: WebSocketMessage) => void): void {
    if (!this.useMock) {
      this.client.off(type, handler)
    }
  }

  getConnectionStatus(): boolean {
    if (this.useMock) {
      return true // 模拟服务器始终连接
    } else {
      return this.client.getConnectionStatus()
    }
  }

  // 数字分身相关方法
  sendAvatarUpdate(avatarId: string, updates: any): void {
    this.send('avatar_update', { avatarId, updates })
  }

  sendConversationMessage(conversationId: string, message: any): void {
    this.send('conversation_message', { conversationId, message })
  }

  sendFragmentCreated(fragment: any): void {
    this.send('fragment_created', fragment)
  }

  sendRuleCreated(rule: any): void {
    this.send('rule_created', rule)
  }

  // 模拟客户端
  private get mockClient() {
    return {
      send: (message: WebSocketMessage) => {
        // 处理来自模拟服务器的消息
        this.client.processMessage(message)
      },
      onMessage: (message: WebSocketMessage) => {
        // 处理发送给模拟服务器的消息
        wsMockServer.handleClientMessage(this.mockClient, message)
      }
    }
  }
}

// 创建默认连接器实例
export const wsConnector = new WebSocketConnector()
