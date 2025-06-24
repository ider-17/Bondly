'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import SideBarMenu from '@/app/_components/SideBarMenu'
import Header from '@/app/_components/Header'
import RotatingBuddyCard from '@/app/_components/RotatingBuddyCard'
import EventsThisWeek from '@/app/_components/EventsThisWeek'
import YourProgress from '@/app/_components/YourProgress'
import ActiveChallenges from '@/app/_components/ActiveChallenges'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewbieHomePage() {
    const [challenges, setChallenges] = useState<any[]>([])
    const [description, setDescription] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [userId, setUserId] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchChallenges()
        fetchUser()
    }, [])

    const fetchUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (user) setUserId(user.id)
    }

    const fetchChallenges = async () => {
        const { data, error } = await supabase.from('challenges').select('*')
        if (error) console.error(error)
        else setChallenges(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedId || !description) return

        const { error } = await supabase.from('submissions').insert([
            {
                user_id: userId,
                challenge_id: selectedId,
                description,
                status: 'pending',
            },
        ])

        if (error) {
            console.error(error)
            setMessage('Алдаа гарлаа')
        } else {
            setMessage('Амжилттай илгээгдлээ!')
            setDescription('')
            setSelectedId(null)
        }
    }

    return (
        <div className='w-full h-screen bg-white flex text-black overflow-scroll'>
            <SideBarMenu />
            <div className='w-full ml-[264px]'>
                <Header />
                <div className='flex gap-5 p-5 mt-21'>
                    <div className='w-1/2 space-y-5'>
                        <RotatingBuddyCard />
                        <EventsThisWeek />
                    </div>

                    <div className='w-1/2 space-y-5'>
                        <YourProgress />
                        <ActiveChallenges />
                    </div>
                </div>
            </div>
        </div>
    )
}

{/* <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Таны даалгаврууд</h1>

            <div className="space-y-4">
                {challenges.map((c) => (
                    <div
                        key={c.id}
                        className={`border p-4 rounded cursor-pointer ${selectedId === c.id ? 'bg-blue-100' : ''
                            }`}
                        onClick={() => setSelectedId(c.id)}
                    >
                        <h2 className="font-semibold text-white">{c.title}</h2>
                        <p className="text-sm text-white">{c.description}</p>
                    </div>
                ))}
            </div>

            {selectedId && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="Даалгаврынхаа тайлбарыг бичнэ үү..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Илгээх
                    </button>
                    {message && <p className="text-green-600">{message}</p>}
                </form>
            )}
        </div> */}