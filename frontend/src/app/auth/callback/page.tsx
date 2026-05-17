'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AuthCallbackPage() {

  const router = useRouter()

  useEffect(() => {

    const checkProfile = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!data) {
        router.push('/complete-profile')
      }

      else {
        router.push('/dashboard')
      }
    }

    checkProfile()

  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  )
}