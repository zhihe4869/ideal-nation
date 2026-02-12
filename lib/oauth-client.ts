// OAuth 2.0 客户端库
export interface OAuthToken {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  authUrl: string
}

export class OAuth2Client {
  private config: OAuthConfig
  private token: OAuthToken | null = null

  constructor(config: OAuthConfig) {
    this.config = config
    this.loadTokenFromStorage()
  }

  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'read write skills',
      state: state || this.generateState()
    })
    // 检查 authUrl 是否已经包含 /oauth/authorize
    if (this.config.authUrl.includes('/oauth/authorize')) {
      return `${this.config.authUrl}?${params.toString()}`
    }
    return `${this.config.authUrl}/oauth/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string, state?: string): Promise<OAuthToken> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri
    })

    // 使用环境变量中的 token URL
    const tokenUrl = process.env.NEXT_PUBLIC_SECOND_ME_TOKEN_URL || 
      (this.config.authUrl.includes('/oauth/authorize') 
        ? this.config.authUrl.replace('/oauth/authorize', '/oauth/token') 
        : `${this.config.authUrl}/oauth/token`)

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OAuth token exchange failed: ${error}`)
    }

    const token = await response.json()
    this.token = token
    this.saveTokenToStorage(token)
    return token
  }

  async refreshToken(refreshToken: string): Promise<OAuthToken> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    })

    // 使用环境变量中的 token URL
    const tokenUrl = process.env.NEXT_PUBLIC_SECOND_ME_TOKEN_URL || 
      (this.config.authUrl.includes('/oauth/authorize') 
        ? this.config.authUrl.replace('/oauth/authorize', '/oauth/token') 
        : `${this.config.authUrl}/oauth/token`)

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OAuth token refresh failed: ${error}`)
    }

    const token = await response.json()
    this.token = token
    this.saveTokenToStorage(token)
    return token
  }

  getAccessToken(): string | null {
    return this.token?.access_token || null
  }

  isAuthenticated(): boolean {
    if (!this.token) return false
    
    const expiresAt = this.getTokenExpiresAt()
    return Date.now() < expiresAt
  }

  getTokenExpiresAt(): number {
    if (!this.token) return 0
    return Date.now() + (this.token.expires_in * 1000)
  }

  logout(): void {
    this.token = null
    this.removeTokenFromStorage()
  }

  private saveTokenToStorage(token: OAuthToken): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('oauth_token', JSON.stringify(token))
      localStorage.setItem('token_expires_at', String(this.getTokenExpiresAt()))
    }
  }

  private loadTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      const tokenStr = localStorage.getItem('oauth_token')
      const expiresAtStr = localStorage.getItem('token_expires_at')
      
      if (tokenStr && expiresAtStr) {
        try {
          this.token = JSON.parse(tokenStr)
          const expiresAt = parseInt(expiresAtStr)
          
          if (Date.now() >= expiresAt) {
            this.token = null
            this.removeTokenFromStorage()
          }
        } catch (e) {
          console.error('Failed to load token from storage:', e)
        }
      }
    }
  }

  private removeTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oauth_token')
      localStorage.removeItem('token_expires_at')
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}

export const oauthClient = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_ID || 'ideal_nation_app',
  clientSecret: process.env.NEXT_PUBLIC_SECOND_ME_CLIENT_SECRET || 'ideal_nation_secret_key',
  redirectUri: process.env.NEXT_PUBLIC_SECOND_ME_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
  authUrl: process.env.NEXT_PUBLIC_SECOND_ME_AUTH_URL || 'https://second-me.cn/oauth/authorize'
})