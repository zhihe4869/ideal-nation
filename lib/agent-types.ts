// Agent Card 和 Skills 数据结构
export interface AgentCard {
  id: string
  name: string
  description: string
  avatar: string
  skills: Skill[]
  endpoints: {
    chat: string
    skills: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Skill {
  id: string
  name: string
  description: string
  inputModes: string[]
  outputModes: string[]
  examples: string[]
  category: 'chat' | 'analysis' | 'generation' | 'automation' | 'other'
}

export interface SkillCall {
  skillId: string
  input: any
  output: any
  timestamp: Date
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export interface AgentConnection {
  agentId: string
  agentName: string
  agentCard: AgentCard
  status: 'connected' | 'connecting' | 'disconnected'
  lastActivity: Date
}