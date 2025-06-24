"use client"

import { ArrowRight, FilePlus2, Mountain, Sparkles } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { submitChallenge } from "@/lib/supabase-notifications";
import { Button } from "@/components/ui/button";

interface Challenge {
    id: string;
    title: string;
    week: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: React.ReactNode;
}

export default function ActiveChallenges() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [noteContent, setNoteContent] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    // Get current user info (replace with your auth system)
    const currentUserId = "current-user-id" // Get from your auth context
    const currentUserName = "Togtuun" // Get from your auth context

    const challenges: Challenge[] = [
        {
            id: '1',
            title: 'Өөрийгөө багтаа танилцуулаарай😊',
            week: 'Week 1',
            difficulty: 'Easy',
            icon: <Sparkles size={18} color="#22C55E" />
        },
        {
            id: '2',
            title: 'Эхний долоо хоногийн сэтгэгдлээ тэмдэглээрэй📝',
            week: 'Week 1',
            difficulty: 'Easy',
            icon: <Sparkles size={18} color="#22C55E" />
        },
        {
            id: '3',
            title: 'Компанийн mission statement-ийг уншаарай🎯',
            week: 'Week 1',
            difficulty: 'Easy',
            icon: <Sparkles size={18} color="#22C55E" />
        }
    ];

    const handleSubmitChallenge = async (challengeId: string) => {
        if (!noteContent.trim()) {
            alert('Please write your notes before submitting')
            return
        }

        setIsSubmitting(true)
        
        try {
            const result = await submitChallenge(
                currentUserId,
                challengeId,
                noteContent.trim(),
                currentUserName
            )

            if (result.success) {
                alert('Challenge submitted for approval!')
                setNoteContent('')
                setIsDialogOpen(false)
            } else {
                alert('Failed to submit challenge. Please try again.')
            }
        } catch (error) {
            console.error('Error submitting challenge:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='Events rounded-xl border border-neutral-300 py-5 px-6 space-y-7'>
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#22C55E' />
                    </div>
                    <h6 className="text-lg font-semibold">Active Challenges</h6>
                </div>

                <div className="border border-neutral-300 rounded-lg py-2 px-3 bg-white flex gap-2 items-center">
                    <p>View all</p>
                    <ArrowRight size={18} />
                </div>
            </div>

            {challenges.map((challenge) => (
                <div key={challenge.id} className="py-[10px] space-y-4">
                    <hr />

                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            {challenge.icon}
                        </div>
                        <p className="text-sm font-medium">{challenge.title}</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">{challenge.week}</button>
                        <button className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">{challenge.difficulty}</button>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="flex gap-2 border border-neutral-300 py-2 px-3 bg-white rounded-lg items-center w-fit cursor-pointer">
                                <div>Write note</div>
                                <FilePlus2 size={20} />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[445px]">
                            <DialogHeader>
                                <div className="border border-neutral-300 rounded-xl py-5 px-6 bg-white space-y-5">
                                    <div>
                                        <div className="text-lg font-semibold">Write Note</div>
                                        <div className="text-sm font-medium">{challenge.title}</div>
                                    </div>

                                    <hr />

                                    <div>
                                        <div className="text-sm font-medium mb-2">Challenge Notes</div>
                                        <textarea 
                                            placeholder="Describe your progress, challenges faced, and what you've learned..." 
                                            className="w-full border border-neutral-300 bg-white py-2 px-3 rounded-md h-32 resize-none"
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                        />
                                    </div>

                                    <hr />

                                    <div className="flex gap-[10px] justify-between">
                                        <Button
                                            variant="outline"
                                            className="w-1/2"
                                            onClick={() => {
                                                setIsDialogOpen(false)
                                                setNoteContent('')
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            className="w-1/2 bg-black text-white hover:bg-gray-800"
                                            onClick={() => handleSubmitChallenge(challenge.id)}
                                            disabled={isSubmitting || !noteContent.trim()}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Request Approval'}
                                        </Button>
                                    </div>
                                </div>
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    )
}