'use client'

import { useEffect, useState } from 'react'
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

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

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
        if (!user) return router.push("/newbie/login")

        const { data: profile } = await supabase
            .from("user_profiles")
            .select("id")
            .eq("id", user.id)
            .single()

        if (profile) {
            router.push("/newbie/home")
        } else {
            router.push("/newbie/onboarding")
        }
    }

    if (loading) {
        return <div className="text-center mt-10">Уншиж байна...</div>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
            >
                <h1 className="text-xl font-bold mb-4">Newbie Login</h1>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-black py-2 px-4 rounded w-full"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
