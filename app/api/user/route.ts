import { NextRequest, NextResponse } from 'next/server'

export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  agentCard?: AgentCard
}

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
    const response = await fetch(`${AUTH_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired or invalid' }, { status: 401 })
      }
      const errorText = await response.text()
      return NextResponse.json({ error: `Failed to fetch user info: ${errorText}` }, { status: response.status })
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching user info:', error)
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
    
    const response = await fetch(`${AUTH_URL}/api/user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Failed to update user info: ${errorText}` }, { status: response.status })
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error updating user info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
