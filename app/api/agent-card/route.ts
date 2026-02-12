import { NextRequest, NextResponse } from 'next/server'

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
  createdAt: string
  updatedAt: string
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

const AUTH_URL = process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || 'http://localhost:8002'

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${AUTH_URL}/api/agent-card`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Failed to fetch agent card: ${errorText}` }, { status: response.status })
    }

    const agentCard = await response.json()
    return NextResponse.json(agentCard)
  } catch (error) {
    console.error('Error fetching agent card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const response = await fetch(`${AUTH_URL}/api/agent-card`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Failed to create/update agent card: ${errorText}` }, { status: response.status })
    }

    const agentCard = await response.json()
    return NextResponse.json(agentCard)
  } catch (error) {
    console.error('Error creating/updating agent card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
