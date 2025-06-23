'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

interface Interest {
    id: string
    label: string
    emoji: string
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const OnboardingFlow = () => {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [previousExperience, setPreviousExperience] = useState('')
    const [careerGoals, setCareerGoals] = useState('')
    const [userId, setUserId] = useState<string | null>(null)

    const interests: Interest[] = [
        { id: 'movies', label: 'Movies & TV Shows', emoji: '🎬' },
        { id: 'books', label: 'Books & Reading', emoji: '📚' },
        { id: 'design', label: 'Art & Design', emoji: '🎨' },
        { id: 'fitness', label: 'Fitness & Gym', emoji: '🏋️' },
        { id: 'ai', label: 'AI & Robotics', emoji: '🤖' },
        { id: 'music', label: 'Music', emoji: '🎵' }
    ]

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (!user || error) {
                router.push('/newbie/login')
            } else {
                setUserId(user.id)
            }
        }
        fetchUser()
    }, [router])

    const handleInterestToggle = useCallback((interestId: string) => {
        setSelectedInterests(prev => {
            if (prev.includes(interestId)) {
                return prev.filter(id => id !== interestId)
            } else if (prev.length < 6) {
                return [...prev, interestId]
            }
            return prev
        })
    }, [])

    const canProceedStep1 = selectedInterests.length >= 1 && previousExperience.length > 0

    const handleNext = () => {
        if (currentStep < 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = async () => {
        if (!userId) return

        const { error } = await supabase
            .from('user_profiles')
            .upsert({
                id: userId,
                interests: selectedInterests,
                experience: previousExperience,
                goal: careerGoals
            })

        if (error) {
            console.error('Failed to save onboarding info:', error)
            alert('Алдаа гарлаа!')
        } else {
            router.push('/newbie/home')
        }
    }

    const ProgressDots = ({ total, current }: { total: number; current: number }) => (
        <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: total }).map((_, index) => (
                <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === current ? 'bg-blue-500' : 'bg-gray-300'}`}
                />
            ))}
        </div>
    )

    const InterestsStep = () => (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-green-600 text-2xl">🌟</div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Interests</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Select your favorite topics to make your journey more fun and personal.
                </p>
            </div>

            <p className="text-center text-gray-700 text-sm mb-6">Select 3-6 interests</p>

            <div className="space-y-3 mb-8">
                {interests.map((interest) => (
                    <button
                        key={interest.id}
                        onClick={() => handleInterestToggle(interest.id)}
                        className={`w-full p-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center gap-2 ${selectedInterests.includes(interest.id)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                    >
                        <span>{interest.emoji}</span>
                        <span className="font-medium">{interest.label}</span>
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Previous Experience</h3>
                <textarea
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    placeholder="Tell us about your background and previous experience..."
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="off"
                />
            </div>

            <ProgressDots total={2} current={0} />

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!canProceedStep1}
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${canProceedStep1
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                    <span className="text-sm">→</span>
                </button>
            </div>
        </div>
    )

    const GoalsStep = () => (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Goals</h2>
                <p className="text-gray-600 text-sm">
                    What do you hope to achieve in your first year?
                </p>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Career Goals</h3>
                <textarea
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    placeholder="Describe your short-term and long-term career goals..."
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none h-32 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="off"
                />
            </div>

            <ProgressDots total={2} current={1} />

            <div className="flex justify-between">
                <button
                    onClick={handleBack}
                    className="px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleComplete}
                    className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                >
                    Complete Setup
                    <span className="text-sm">→</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {currentStep === 0 ? <InterestsStep /> : <GoalsStep />}
        </div>
    )
}

export default OnboardingFlow
