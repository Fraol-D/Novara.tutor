import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

type AuthUser = {
  id: string
  email: string
  fullName: string
}

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setSession: (payload: { token: string; user: AuthUser }) => void
  clearSession: () => void
}

const TOKEN_KEY = 'tutorflow_access_token'
const USER_KEY = 'tutorflow_auth_user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      setSession: (payload) => {
        setToken(payload.token)
        setUser(payload.user)
        localStorage.setItem(TOKEN_KEY, payload.token)
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      },
      clearSession: () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      },
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
