'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewbieLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      await checkProfileAndRedirect()
      setLoading(false)
    }
  }

  const checkProfileAndRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push("/login")

    // Always redirect to onboarding after successful login
    router.push("/onboarding")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-black">
      <div className="max-w-md w-full space-y-6">

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <img src={"handshake.png"} alt="Handshake" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">BuddyConnect</h2>
          <p className="text-sm text-gray-500">Let’s begin your onboarding journey.</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-lg bg-white shadow-md p-8 space-y-5">
          <div className='flex flex-col items-center'>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your email and password to access your dashboard
            </p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600 cursor-pointer border-gray-300 rounded" />
              Remember me
            </label>
            <a href="#" className="text-black-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-black text-white cursor-pointer rounded-md text-sm hover:bg-neutral-800 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
