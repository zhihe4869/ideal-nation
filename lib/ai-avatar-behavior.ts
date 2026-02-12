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
        Math.pow(a.position[1] - avatar.position[1], 2)
      )
      return distance < 10 && a.id !== avatar.id
    })

    if (nearbyAvatars.length > 0 && Math.random() > 0.5) {
      await this.initiateConversation(avatar, nearbyAvatars)
    } else if (Math.random() > 0.7) {
      await this.wander(avatar)
    } else if (Math.random() > 0.8) {
      await this.createFragment(avatar)
    }
  }

  private async initiateConversation(avatar: AIAvatar, nearbyAvatars: AIAvatar[]) {
    const target = nearbyAvatars[Math.floor(Math.random() * nearbyAvatars.length)]
    
    const conversationId = `conv-${Date.now()}`
    const conversation: AIConversation = {
      id: conversationId,
      participants: [avatar.id, target.id],
      messages: [],
      topic: ''
    }

    this.conversations.set(conversationId, conversation)

    const systemPrompt = await this.initializeAvatar(avatar)
    
    try {
      const response = await secondMeClient.chat({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `你遇到了${target.name}，请开始对话。` }
        ],
        temperature: 0.8,
        max_tokens: 200
      })

      const message = response.choices[0].delta.content || ''
      conversation.messages.push({
        senderId: avatar.id,
        content: message,
        timestamp: new Date()
      })

      avatar.action = 'interacting'
      this.avatars.set(avatar.id, avatar)
    } catch (error) {
      console.error('Failed to generate conversation:', error)
    }
  }

  private async wander(avatar: AIAvatar) {
    const angle = Math.random() * Math.PI * 2
    const distance = 2 + Math.random() * 3
    
    avatar.position = [
      avatar.position[0] + Math.cos(angle) * distance,
      avatar.position[1] + Math.sin(angle) * distance,
      avatar.position[2]
    ]
    
    avatar.rotation = [
      0,
      angle,
      0
    ]
    
    avatar.action = 'walking'
    this.avatars.set(avatar.id, avatar)
  }

  private async createFragment(avatar: AIAvatar) {
    const systemPrompt = await this.initializeAvatar(avatar)
    
    const fragmentTypes: Array<'value' | 'rule' | 'vision' | 'story'> = ['value', 'rule', 'vision', 'story']
    const selectedType = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)]
    
    try {
      const response = await secondMeClient.chat({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请创建一个${selectedType === 'value' ? '价值观' : selectedType === 'rule' ? '规则' : selectedType === 'vision' ? '愿景' : '故事'}类型的理想碎片。` }
        ],
        temperature: 0.9,
        max_tokens: 300
      })

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