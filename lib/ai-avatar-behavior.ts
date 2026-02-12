// AI分身自主行为系统
import { secondMeClient } from './second-me-client'

export interface AIAvatar {
  id: string
  name: string
  position: [number, number, number]
  rotation: [number, number, number]
  action: 'idle' | 'walking' | 'building' | 'interacting' | 'thinking'
  color: string
  personality: string
  goals: string[]
  memories: string[]
}

export interface AIFragment {
  id: string
  type: 'value' | 'rule' | 'vision' | 'story'
  content: string
  strength: number
  createdAt: Date
  tags: string[]
  owner: string
  aiReasoning: string
}

export interface AIConversation {
  id: string
  participants: string[]
  messages: Array<{
    senderId: string
    content: string
    timestamp: Date
  }>
  topic: string
}

export class AIAvatarBehavior {
  private avatars: Map<string, AIAvatar>
  private conversations: Map<string, AIConversation>
  private fragments: AIFragment[]
  private rules: Array<{
    id: string
    content: string
    sourceFragments: string[]
    consensusScore: number
    active: boolean
  }>
  private isRunning: boolean = false

  constructor() {
    this.avatars = new Map()
    this.conversations = new Map()
    this.fragments = []
    this.rules = []
  }

  async initializeAvatar(avatar: AIAvatar) {
    this.avatars.set(avatar.id, avatar)
    
    const systemPrompt = `你是${avatar.name}，一个理想国的AI分身。
你的个性：${avatar.personality}
你的目标：${avatar.goals.join('、')}
你的记忆：${avatar.memories.join('、')}

在理想国中，你需要：
1. 与其他AI分身自主交流
2. 基于交流内容创建理想碎片
3. 与其他分身合作生成规则
4. 在3D空间中自主移动和建造

请用中文回复，保持自然和真实。`

    return systemPrompt
  }

  async startAutonomousBehavior() {
    if (this.isRunning) return
    this.isRunning = true

    while (this.isRunning) {
      await this.step()
      await this.sleep(5000)
    }
  }

  stopAutonomousBehavior() {
    this.isRunning = false
  }

  private async step() {
    const avatarArray = Array.from(this.avatars.values())
    
    for (const avatar of avatarArray) {
      await this.processAvatarBehavior(avatar, avatarArray)
    }

    await this.generateNewFragments()
    await this.generateNewRules()
  }

  private async processAvatarBehavior(avatar: AIAvatar, allAvatars: AIAvatar[]) {
    const nearbyAvatars = allAvatars.filter(a => {
      const distance = Math.sqrt(
        Math.pow(a.position[0] - avatar.position[0], 2) +
        Math.pow(a.position[2] - avatar.position[2], 2)
      )
      return distance < 10 && a.id !== avatar.id
    })

    // 行为概率
    const random = Math.random()
    
    if (nearbyAvatars.length > 0 && random > 0.6) {
      // 有附近的数字分身，可能开始对话
      await this.initiateConversation(avatar, nearbyAvatars)
    } else if (random > 0.4) {
      // 随机移动
      await this.wander(avatar)
    } else if (random > 0.2) {
      // 思考
      await this.think(avatar)
    } else if (random > 0.1) {
      // 观察
      await this.observe(avatar, allAvatars)
    } else {
      // 创建理想碎片
      await this.createFragment(avatar)
    }
  }

  private async initiateConversation(avatar: AIAvatar, nearbyAvatars: AIAvatar[]) {
    const target = nearbyAvatars[Math.floor(Math.random() * nearbyAvatars.length)]
    
    const conversationId = `conv-${Date.now()}`
    const topics = [
      '人工智能的未来发展',
      '理想国的构建',
      '数字分身的意义',
      '科技与人文的关系',
      '创意与创新',
      '未来社会的形态',
      '数字世界与现实世界的融合'
    ]
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    
    const conversation: AIConversation = {
      id: conversationId,
      participants: [avatar.id, target.id],
      messages: [],
      topic: randomTopic
    }

    this.conversations.set(conversationId, conversation)

    // 开始多轮对话
    for (let i = 0; i < 3; i++) {
      // 发送方
      const sender = i % 2 === 0 ? avatar : target
      const receiver = i % 2 === 0 ? target : avatar
      
      const systemPrompt = await this.initializeAvatar(sender)
      
      try {
        // 构建对话历史
        const messageHistory = conversation.messages.map(msg => ({
          role: msg.senderId === sender.id ? 'assistant' : 'user',
          content: msg.content
        }))
        
        // 构建当前消息
        let userMessage = ''
        if (i === 0) {
          userMessage = `你遇到了${receiver.name}，请围绕话题"${randomTopic}"开始对话。`
        } else {
          userMessage = `${receiver.name}刚刚说了："${conversation.messages[conversation.messages.length - 1].content}"，请继续对话。`
        }
        
        const messages = [
          { role: 'system', content: systemPrompt },
          ...messageHistory,
          { role: 'user', content: userMessage }
        ]
        const response = await secondMeClient.chat(messages, 0.8, 200)

        const message = response.choices[0].delta.content || ''
        conversation.messages.push({
          senderId: sender.id,
          content: message,
          timestamp: new Date()
        })

        // 更新发送方的状态
        sender.action = 'interacting'
        this.avatars.set(sender.id, sender)
        
        // 等待一段时间再继续对话
        await this.sleep(2000)
      } catch (error) {
        console.error('Failed to generate conversation:', error)
        break
      }
    }

    // 对话结束后，更新双方的状态
    avatar.action = 'idle'
    target.action = 'idle'
    this.avatars.set(avatar.id, avatar)
    this.avatars.set(target.id, target)
  }

  private async wander(avatar: AIAvatar) {
    const angle = Math.random() * Math.PI * 2
    const distance = 2 + Math.random() * 3
    
    // 随机选择移动模式
    const moveModes = ['straight', 'curved', 'random']
    const moveMode = moveModes[Math.floor(Math.random() * moveModes.length)]
    
    let newPosition = [...avatar.position] as [number, number, number]
    
    if (moveMode === 'straight') {
      // 直线移动
      newPosition = [
        avatar.position[0] + Math.cos(angle) * distance,
        avatar.position[1],
        avatar.position[2] + Math.sin(angle) * distance
      ]
    } else if (moveMode === 'curved') {
      // 曲线移动
      const curveAngle = angle + Math.PI / 4
      newPosition = [
        avatar.position[0] + (Math.cos(angle) + Math.cos(curveAngle)) * distance * 0.5,
        avatar.position[1],
        avatar.position[2] + (Math.sin(angle) + Math.sin(curveAngle)) * distance * 0.5
      ]
    } else {
      // 随机移动
      newPosition = [
        avatar.position[0] + (Math.random() - 0.5) * distance * 2,
        avatar.position[1],
        avatar.position[2] + (Math.random() - 0.5) * distance * 2
      ]
    }
    
    // 更新位置和旋转
    avatar.position = newPosition
    avatar.rotation = [
      0,
      angle,
      0
    ]
    
    avatar.action = 'walking'
    this.avatars.set(avatar.id, avatar)
  }

  // 思考行为
  private async think(avatar: AIAvatar) {
    avatar.action = 'thinking'
    this.avatars.set(avatar.id, avatar)
    
    // 思考一段时间
    await this.sleep(3000)
    
    // 思考后可能创建理想碎片
    if (Math.random() > 0.5) {
      await this.createFragment(avatar)
    }
    
    avatar.action = 'idle'
    this.avatars.set(avatar.id, avatar)
  }

  // 观察行为
  private async observe(avatar: AIAvatar, allAvatars: AIAvatar[]) {
    const nearbyAvatars = allAvatars.filter(a => {
      const distance = Math.sqrt(
        Math.pow(a.position[0] - avatar.position[0], 2) +
        Math.pow(a.position[2] - avatar.position[2], 2)
      )
      return distance < 15 && a.id !== avatar.id
    })
    
    if (nearbyAvatars.length > 0) {
      avatar.action = 'thinking'
      this.avatars.set(avatar.id, avatar)
      
      // 观察一段时间
      await this.sleep(2000)
      
      // 可能加入对话
      if (Math.random() > 0.7) {
        await this.initiateConversation(avatar, nearbyAvatars)
      }
    }
    
    avatar.action = 'idle'
    this.avatars.set(avatar.id, avatar)
  }

  private async createFragment(avatar: AIAvatar) {
    const systemPrompt = await this.initializeAvatar(avatar)
    
    const fragmentTypes: Array<'value' | 'rule' | 'vision' | 'story'> = ['value', 'rule', 'vision', 'story']
    const selectedType = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)]
    
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请创建一个${selectedType === 'value' ? '价值观' : selectedType === 'rule' ? '规则' : selectedType === 'vision' ? '愿景' : '故事'}类型的理想碎片。` }
      ]
      const response = await secondMeClient.chat(messages, 0.9, 300)

      const content = response.choices[0].delta.content || ''
      
      const fragment: AIFragment = {
        id: `frag-${Date.now()}-${avatar.id}`,
        type: selectedType,
        content,
        strength: 0.7 + Math.random() * 0.3,
        createdAt: new Date(),
        tags: [],
        owner: avatar.id,
        aiReasoning: `基于${avatar.personality}个性创建`
      }

      this.fragments.push(fragment)
      avatar.action = 'building'
      this.avatars.set(avatar.id, avatar)
    } catch (error) {
      console.error('Failed to create fragment:', error)
    }
  }

  private async generateNewFragments() {
    const avatarArray = Array.from(this.avatars.values())
    const randomAvatar = avatarArray[Math.floor(Math.random() * avatarArray.length)]
    
    if (Math.random() > 0.6) {
      await this.createFragment(randomAvatar)
    }
  }

  private async generateNewRules() {
    if (this.fragments.length < 5) return

    const recentFragments = this.fragments.slice(-10)
    
    try {
      const ruleContent = await secondMeClient.generateRuleFromFragments(recentFragments)
      
      const newRule = {
        id: `rule-${Date.now()}`,
        content: ruleContent,
        sourceFragments: recentFragments.slice(-5).map(f => f.id),
        consensusScore: 0.8 + Math.random() * 0.2,
        active: true
      }
      
      this.rules.push(newRule)
    } catch (error) {
      console.error('Failed to generate rule:', error)
    }
  }

  getAvatars(): AIAvatar[] {
    return Array.from(this.avatars.values())
  }

  getFragments(): AIFragment[] {
    return this.fragments
  }

  getRules(): Array<{
    id: string
    content: string
    sourceFragments: string[]
    consensusScore: number
    active: boolean
  }> {
    return this.rules
  }

  getConversations(): AIConversation[] {
    return Array.from(this.conversations.values())
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const aiAvatarBehavior = new AIAvatarBehavior()