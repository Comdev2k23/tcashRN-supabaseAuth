// hooks/useUser.ts
import { supabase } from '@/lib/Auth'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(data?.session?.user ?? null)
      } catch (err) {
        console.error('❌ Error getting session:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    userId: user?.id,
    loading,
    isSignedIn: !!user,
  }
}
