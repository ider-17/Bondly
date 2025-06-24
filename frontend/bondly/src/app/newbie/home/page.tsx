'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import SideBarMenu from '@/app/_components/SideBarMenu'
// import Header from '@/app/_components/Header'
import RotatingBuddyCard from '@/app/buddy/components/RotatingInternCard'
import EventsThisWeek from '@/app/_components/EventsThisWeek'
import YourProgress from '@/app/_components/YourProgress'
import ActiveChallenges from '@/app/_components/ActiveChallenges'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewbieHomePage() {
    const [selectedSection, setSelectedSection] = useState("Home")
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

    const renderContent = () => {
        switch (selectedSection) {
            case 'Home':
                return (
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
                )
            case 'Challenges':
                return (
                    <div className="p-6 mt-100 max-w-2xl">
                        Challenge section
                    </div>
                )
            case 'Advice':
                return (
                    <div className="p-6 mt-100">
                        Advice section
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className='w-full h-screen bg-white flex text-black overflow-scroll'>
            <SideBarMenu
                onSelectSection={(section) => setSelectedSection(section)}
                selectedSection={selectedSection}
            />
            <div className='w-full ml-[264px]'>
                {/* <Header /> */}
                {renderContent()}
            </div>
        </div>
    )
}
