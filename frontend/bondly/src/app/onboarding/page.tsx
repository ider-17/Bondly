'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const interestOptions = [
  "🎯 Productivity",
  "🤖 AI & Robotics",
  "🎨 Design",
  "💻 Development",
  "🏋️ Fitness & Wellness",
  "📚 Books & Learning",
]

export default function Onboarding() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [experience, setExperience] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
      else router.push("/login")
    }
    getUser()
  }, [router])

  const toggleInterest = (item: string) => {
    setInterests(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : prev.length < 6
          ? [...prev, item]
          : prev
    )
  }

  const handleSubmit = async () => {
    if (!userId) return
    if (interests.length < 3) {
      alert("Please select at least 3 interests.")
      return
    }

    setLoading(true)

    const { error } = await supabase.from("user_profiles").insert({
      id: userId,
      interests, 
      experience,
    })

    setLoading(false)

    if (error) {
      console.error("Failed to submit:", error)
      alert(`Failed to save. Error: ${error.message}`)
    } else {
      router.push("/newbie/home")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 text-black">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6">

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <span className="text-green-600 text-lg">🌱</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Your Interests</h2>
          <p className="text-sm text-gray-500">
            Select your favorite topics to make your journey more personal.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Select 3–6 interests</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {interestOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => toggleInterest(option)}
                className={`text-sm px-4 py-2 rounded-full border transition
                  ${interests.includes(option)
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Previous Experience
          </label>
          <textarea
            rows={3}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Tell us about your background and previous experience..."
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded border border-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm rounded bg-black text-white hover:bg-neutral-800 transition"
          >
            {loading ? "Saving..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  )
}
