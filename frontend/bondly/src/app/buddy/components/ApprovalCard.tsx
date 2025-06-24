"use client"

import { Sparkles, SquareCheckBig, CircleCheckBig, CircleMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getPendingApprovals, approveOrDeclineSubmission } from "@/lib/supabase-notifications";

interface PendingSubmission {
    id: string;
    user_id: string;
    challenge_id: string;
    content: string;
    created_at: string;
    challenges: {
        title: string;
        difficulty: string;
    };
    user_profiles: {
        name: string;
        avatar_url?: string;
    };
}

export default function ApprovalCard() {
    const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    
    // Get current reviewer info (replace with your auth system)
    const currentReviewerId = "current-reviewer-id" // Get from your auth context
    const currentReviewerName = "Senior Developer" // Get from your auth context

    useEffect(() => {
        loadPendingApprovals()
    }, [])

    const loadPendingApprovals = async () => {
        setLoading(true)
        const result = await getPendingApprovals(currentReviewerId)
        if (result.success) {
            setPendingSubmissions(result.data || [])
        }
        setLoading(false)
    }

    const handleApproval = async (submissionId: string, status: 'approved' | 'declined') => {
        setProcessingId(submissionId)
        
        try {
            const result = await approveOrDeclineSubmission(
                submissionId,
                status,
                currentReviewerId,
                currentReviewerName
            )

            if (result.success) {
                // Remove the processed submission from the list
                setPendingSubmissions(prev => 
                    prev.filter(submission => submission.id !== submissionId)
                )
                
                const message = status === 'approved' 
                    ? 'Challenge approved successfully!' 
                    : 'Challenge declined successfully!'
                alert(message)
            } else {
                alert('Failed to process approval. Please try again.')
            }
        } catch (error) {
            console.error('Error processing approval:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setProcessingId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, ' • ')
    }

    if (loading) {
        return (
            <div className='bg-slate-50 rounded-xl border border-neutral-300 py-5 px-6'>
                <div className='flex gap-3 items-center mb-5'>
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <SquareCheckBig className="text-green-500"/>
                    </div>
                    <h6 className='text-lg font-semibold'>Approval Requests</h6>
                </div>
                <div className="text-center py-4">Loading...</div>
            </div>
        )
    }

    return (
        <div className='bg-slate-50 rounded-xl border border-neutral-300 py-5 px-6 space-y-5'>
            <div className='flex gap-3 items-center'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                    <SquareCheckBig className="text-green-500"/>
                </div>
                <h6 className='text-lg font-semibold'>Approval Requests</h6>
            </div>

            <div className='w-full space-y-4'>
                {pendingSubmissions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        No pending approval requests
                    </div>
                ) : (
                    pendingSubmissions.map((submission) => (
                        <div key={submission.id} className='rounded-lg p-4 space-y-3 bg-white border border-gray-200'>
                            <div className='flex items-start gap-3'>
                                <Sparkles className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <div className="flex-1">
                                    <p className='text-sm font-medium text-gray-800 mb-2'>
                                        {submission.user_profiles.name} submitted "{submission.challenges.title}"
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className='text-sm text-gray-700'>
                                            {submission.content}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <Badge variant="default" className="text-black bg-gray-200 rounded-full">
                                        {formatDate(submission.created_at)}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs rounded-full">
                                        {submission.challenges.difficulty}
                                    </Badge>
                                </div>
                            </div>

                            <div className='flex gap-3 pt-2'>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="flex-1 bg-transparent text-gray-700 hover:bg-red-50 hover:text-red-700 h-10"
                                    onClick={() => handleApproval(submission.id, 'declined')}
                                    disabled={processingId === submission.id}
                                >
                                    {processingId === submission.id ? 'Processing...' : 'Decline'}
                                    <CircleMinus size={16} className="ml-1" />
                                </Button>
                                <Button 
                                    size="sm"
                                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 h-10"
                                    onClick={() => handleApproval(submission.id, 'approved')}
                                    disabled={processingId === submission.id}
                                >
                                    {processingId === submission.id ? 'Processing...' : 'Approve'}
                                    <CircleCheckBig size={16} className="ml-1"/>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}