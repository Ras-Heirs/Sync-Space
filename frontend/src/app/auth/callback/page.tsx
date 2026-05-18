'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { API_URL } from '../../../lib/api'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Mengekstrak data Google...')
  
  // GEMBOK: Mencegah Next.js mengeksekusi proses login 2 kali (yang bikin error merah)
  const hasProcessed = useRef(false)

  useEffect(() => {
    let isMounted = true

    const processAuth = async () => {
      // Jika gembok sudah tertutup, jangan jalan lagi
      if (hasProcessed.current) return
      hasProcessed.current = true // Langsung tutup gembok!

      try {
        const hash = window.location.hash
        let user = null
        let accessToken = null

        // 1. TANGKAP PAKSA DARI URL (Pembajakan Token Google)
        if (hash && hash.includes('access_token')) {
          const hashParams = new URLSearchParams(hash.substring(1))
          const token = hashParams.get('access_token')
          const refresh = hashParams.get('refresh_token')

          if (token && refresh) {
            setStatus('Menyimpan sesi Google...')
            // setSession mengembalikan user langsung. TIDAK PERLU getUser() lagi!
            const { data, error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: refresh
            })
            
            if (error) throw error
            user = data?.user
            accessToken = token
          }
        } 
        
        // 2. JIKA URL KOSONG, CEK APAKAH SUDAH ADA DI MEMORI
        if (!user) {
          const { data } = await supabase.auth.getSession()
          user = data?.session?.user
          accessToken = data?.session?.access_token
        }

        // 3. JIKA BENAR-BENAR GAGAL
        if (!user || !accessToken) {
          if (isMounted) router.push('/login?error=Google_Token_Missing')
          return
        }

        setStatus('Menyinkronkan dengan server backend...')

        // 4. LAPORKAN KE BACKEND EXPRESS
        try {
          const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0],
              image: user.user_metadata?.avatar_url
            })
          })

          const data = await response.json()

          if (data.success && isMounted) {
            localStorage.setItem('token', data.payload.token)
            localStorage.setItem('user', JSON.stringify(data.payload.user))
            
            if (!data.payload.user.domicile) {
              router.push('/complete-profile')
            } else {
              router.push('/dashboard')
            }
          } else {
            fallbackLocalLogin(user, accessToken)
          }
        } catch (err) {
          fallbackLocalLogin(user, accessToken)
        }

      } catch (err) {
        console.error("Proses auth error:", err)
        if (isMounted) router.push('/login?error=System_Error')
      }
    }

    const fallbackLocalLogin = (userData: any, token: string) => {
      if (!isMounted) return
      setStatus('Server lambat, masuk dengan mode lokal...')
      
      const fallbackUser = {
        id: userData.id,
        name: userData.user_metadata?.full_name || userData.email?.split('@')[0],
        email: userData.email,
        image: userData.user_metadata?.avatar_url
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(fallbackUser))
      
      setTimeout(() => {
        if (isMounted) router.push('/dashboard')
      }, 1500)
    }

    processAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-400 font-bold animate-pulse tracking-wide">{status}</p>
        <p className="text-gray-500 text-sm mt-4 font-mono">Finalizing Authentication...</p>
      </div>
    </div>
  )
}