'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Supabase client үүсгэх
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const interestOptions = [
    "Productivity",
    "AI & Robotics",
    "Design",
    "Development",
    "Fitness & Wellness",
    "Books & Learning",
];

export default function Onboarding() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [interests, setInterests] = useState<string[]>([]);
    const [experience, setExperience] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
            else router.push("/newbie/login"); // redirect if not logged in
        };
        getUser();
    }, [router]);

    const toggleInterest = (item: string) => {
        setInterests(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const handleSubmit = async () => {
        if (!userId) return;

        const { error } = await supabase.from("user_profiles").insert({
            id: userId,
            interests,
            experience,
        });

        if (error) {
            console.error("Failed to submit:", error);
            alert("Failed to save. Try again.");
        } else {
            router.push("/newbie/home");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-center">Welcome!</h2>

                <p className="text-sm mb-2 text-gray-600">What are you interested in?</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {interestOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => toggleInterest(option)}
                            className={`px-3 py-1 rounded-full border ${interests.includes(option)
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <label className="block text-sm font-medium mb-1 text-black">
                    Describe your experience:
                </label>
                <textarea
                    className="w-full p-2 border rounded mb-4"
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="E.g. 1 year of React, interested in backend..."
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
