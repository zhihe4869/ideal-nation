// Skills 客户端
import { Skill, SkillCall } from './agent-types'

export class SkillsClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = 'http://localhost:8002', token?: string) {
    this.baseUrl = baseUrl
    this.token = token || null
  }

  setToken(token: string): void {
    this.token = token
  }

  async getSkills(): Promise<Skill[]> {
    const response = await fetch(`${this.baseUrl}/api/skills`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.statusText}`)
    }

    return response.json()
  }

  async getSkill(skillId: string): Promise<Skill> {
    const response = await fetch(`${this.baseUrl}/api/skills/${skillId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch skill: ${response.statusText}`)
    }

    return response.json()
  }

  async callSkill(skillId: string, input: any): Promise<SkillCall> {
    const call: SkillCall = {
      skillId,
      input,
      output: null,
      timestamp: new Date(),
      status: 'running'
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/skills/${skillId}/call`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        call.status = 'failed'
        throw new Error(`Failed to call skill: ${response.statusText}`)
      }

      const output = await response.json()
      call.output = output
      call.status = 'completed'
      return call
    } catch (error) {
      call.status = 'failed'
      call.output = { error: error instanceof Error ? error.message : 'Unknown error' }
      return call
    }
  }

  async registerSkill(skill: Partial<Skill>): Promise<Skill> {
    const response = await fetch(`${this.baseUrl}/api/skills`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(skill),
    })

    if (!response.ok) {
      throw new Error(`Failed to register skill: ${response.statusText}`)
    }

    return response.json()
  }

  async updateSkill(skillId: string, updates: Partial<Skill>): Promise<Skill> {
    const response = await fetch(`${this.baseUrl}/api/skills/${skillId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`Failed to update skill: ${response.statusText}`)
    }

    return response.json()
  }

  async deleteSkill(skillId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/skills/${skillId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete skill: ${response.statusText}`)
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }
}

export const skillsClient = new SkillsClient()