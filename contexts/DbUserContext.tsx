'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { getUserByClerkId } from '../actions/databaseActions'

export interface DatabaseUser {
  id: number
  name: string
  clerk_id: string
  email: string
  wallet_address: string
  encrypted_private_key: string
  iv: string
  created_at: Date
}

interface UserContextType {
  dbUser: DatabaseUser | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    if (!user?.id) {
      setDbUser(null)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const userData = await getUserByClerkId(user.id)
      setDbUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data')
      console.error('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [user?.id])

  const refetch = async () => {
    await fetchUserData()
  }

  return (
    <UserContext.Provider value={{ dbUser, loading, error, refetch }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}