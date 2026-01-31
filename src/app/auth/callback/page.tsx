"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { membersApi } from "@/lib/api"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/sign-in')
          return
        }

        if (!session) {
          console.error('No session found')
          toast.error('No session found')
          router.push('/sign-in')
          return
        }

        console.log('Session obtained:', session)

        // Determine the provider from the session
        const provider = session.user.app_metadata.provider as 'google' | 'github' | 'azure'

        // Send the access token to our backend to create/get the member
        const result = await membersApi.signinWithOAuth({
          provider: provider,
          access_token: session.access_token,
        })

        console.log('Member authenticated:', result)
        toast.success('Successfully signed in!')
        
        // Redirect to dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Callback handling error:', error)
        toast.error('Failed to complete authentication')
        router.push('/sign-in')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
