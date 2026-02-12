// WebSocket 客户端
// 用于实现实时通信和状态同步

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

type MessageHandler = (message: WebSocketMessage) => void

export class WebSocketClient {
  private socket: WebSocket | null = null
  private url: string
  private messageHandlers: Map<string, MessageHandler[]>
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private reconnectDelay: number = 1000
  private isConnected: boolean = false

  constructor(url: string = 'wss://your-websocket-server.com') {
    this.url = url
    this.messageHandlers = new Map()
  }

  connect(): void {
    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.isConnected = true
        this.reconnectAttempts = 0
        this.emit('connected', { message: 'WebSocket connected' })
      }

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket disconnected')
        this.isConnected = false
        this.emit('disconnected', { message: 'WebSocket disconnected' })
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', { error: 'WebSocket connection error' })
      }
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      this.attemptReconnect()
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.isConnected = false
    }
  }

  send(type: string, data: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return
    }

    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now()
    }

    this.socket.send(JSON.stringify(message))
  }

  on(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)?.push(handler)
  }

  off(type: string, handler: MessageHandler): void {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type)!
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    this.processMessage(message)
  }

  // 公开方法，用于处理消息
  public processMessage(message: WebSocketMessage): void {
    if (this.messageHandlers.has(message.type)) {
      const handlers = this.messageHandlers.get(message.type)!
      handlers.forEach(handler => handler(message))
    }
    // 触发所有消息的处理
    if (this.messageHandlers.has('*')) {
      const handlers = this.messageHandlers.get('*')!
      handlers.forEach(handler => handler(message))
    }
  }

  private emit(type: string, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now()
    }
    this.handleMessage(message)
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnect attempts reached')
      this.emit('reconnect_failed', { message: 'Max reconnect attempts reached' })
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected
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
}

// 创建默认客户端实例
export const wsClient = new WebSocketClient()
