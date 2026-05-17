'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { API_URL } from '../../../lib/api'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      try {
        // Sync with our local backend
        const response = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.user_metadata.full_name || user.email?.split('@')[0],
            image: user.user_metadata.avatar_url
          })
        })

        const data = await response.json()

        if (data.success) {
          localStorage.setItem('token', data.payload.token)
          localStorage.setItem('user', JSON.stringify(data.payload.user))
          
          // Check if profile is complete (domicile is required for Sync-Space)
          if (!data.payload.user.domicile) {
            router.push('/complete-profile')
          } else {
            router.push('/dashboard')
          }
        } else {
          router.push('/login?error=Google login failed')
        }
      } catch (err) {
        console.error('Auth sync error:', err)
        router.push('/login?error=Connection failed')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 font-bold">Autentikasi sedang diproses...</p>
      </div>
    </div>
  )
}
