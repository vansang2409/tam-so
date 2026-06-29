import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined }
    let alive = true
    supabase.auth.getSession().then(({ data, error: err }) => {
      if (!alive) return
      if (err) setError(err.message)
      setSession(data?.session || null)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
      setError('')
    })
    return () => { alive = false; data?.subscription?.unsubscribe?.() }
  }, [])

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    loading,
    error,
    configured: isSupabaseConfigured,
    supabase
  }), [session, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
