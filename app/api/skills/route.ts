import { NextRequest, NextResponse } from 'next/server'

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
  timestamp: string
  status: 'pending' | 'running' | 'completed' | 'failed'
}

const AUTH_URL = process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || 'http://localhost:8002'

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${AUTH_URL}/api/skills`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Failed to fetch skills: ${errorText}` }, { status: response.status })
    }

    const skills = await response.json()
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
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
    const { skillId, input } = body
    
    if (!skillId || input === undefined) {
      return NextResponse.json({ error: 'Missing skillId or input' }, { status: 400 })
    }
    
    const response = await fetch(`${AUTH_URL}/api/skills/call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skillId, input }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Failed to call skill: ${errorText}` }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error calling skill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
