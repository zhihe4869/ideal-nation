import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from '@/lib/oauth-client'

const oauthClient = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_ID || 'ideal_nation_app',
  clientSecret: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_SECRET || 'ideal_nation_secret_key',
  redirectUri: process.env.NEXT_PUBLIC_SECOND_ME_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
  authUrl: process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || 'https://second-me.cn/oauth/authorize'
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/login?error=' + encodeURIComponent(error), request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  try {
    const token = await oauthClient.exchangeCodeForToken(code, state || undefined)
    
    const response = NextResponse.redirect(new URL('/profile', request.url))
    response.cookies.set('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: token.expires_in
    })
    
    if (token.refresh_token) {
      response.cookies.set('refresh_token', token.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60
      })
    }
    
    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
  }
}
