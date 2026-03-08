import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import type { AuthUser, UserRole } from '../types'

type SetSessionPayload = {
  token: string
  user: AuthUser
}

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  role: UserRole | null
  setupCompleted: boolean
  setupStep: number
  isAuthenticated: boolean
  setSession: (payload: SetSessionPayload) => void
  patchUser: (updates: Partial<AuthUser>) => void
  clearSession: () => void
}

const TOKEN_KEY = 'tutorflow_access_token'
const USER_KEY = 'tutorflow_auth_user'

const parseStoredToken = () => {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null

  const normalized = raw.trim()
  if (!normalized || normalized === 'null' || normalized === 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }

  return normalized
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(parseStoredToken)
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
      role: user?.role ?? null,
      setupCompleted: Boolean(user?.setupCompleted),
      setupStep: user?.setupStep ?? 1,
      isAuthenticated: Boolean(token && user),
      setSession: (payload) => {
        setToken(payload.token)
        setUser(payload.user)
        localStorage.setItem(TOKEN_KEY, payload.token)
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      },
      patchUser: (updates) => {
        setUser((current) => {
          if (!current) {
            return current
          }

          const next = { ...current, ...updates }
          localStorage.setItem(USER_KEY, JSON.stringify(next))
          return next
        })
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
