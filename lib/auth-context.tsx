'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserType = 'customer' | 'agency' | null

export interface User {
  id: string
  email: string
  name: string
  type: 'customer' | 'agency'
  agencyName?: string
}

interface AuthContextType {
  user: User | null
  userType: UserType
  isLoading: boolean
  login: (email: string, password: string, type: 'customer' | 'agency') => Promise<void>
  register: (email: string, password: string, name: string, type: 'customer' | 'agency', agencyName?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string, type: 'customer' | 'agency') => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Login failed')
    }
    const userData = await res.json()
    setUser(userData)
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    type: 'customer' | 'agency',
    agencyName?: string
  ) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, type, agencyName }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Registration failed')
    }
    const userData = await res.json()
    setUser(userData)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, userType: user?.type || null, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
