"use client"

import { CheckCheck, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { SquareCheckBig } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { CircleMinus } from "lucide-react";

export default function ApprovalCard() {
    return (
        <div className='bg-slate-50 rounded-xl border border-neutral-300 py-5 px-6 space-y-5'>
            <div className='flex gap-3 items-center'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                    <SquareCheckBig className="text-green-500"/>
                </div>
                <h6 className='text-lg font-semibold'>Approval Requests</h6>
            </div>

            <div className='w-full space-y-4'>
                <div className='rounded-lg p-4 space-y-3'>
                    <div className='flex items-start gap-2'>
                            <Sparkles className="bg-green-100 text-green-500"/>
                            <p className='text-sm font-normal text-gray-800'>
                                "Өөрийгөө багтаа танилцуулах" challenge-ийг амжилттай биелүүллээ. 
                                Хүүхэн ач, баталгаажуулж өгнө үү. Баярлалаа 🤗✨
                            </p>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Badge variant="default" className="text-black bg-gray-200 rounded-4xl">2025 • 06 • 20</Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs rounded-4xl">
                                Easy
                            </Badge>
                        </div>
                    </div>

                    <div className='flex gap-3 pt-2'>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-transparent text-gray-700 hover:bg-orange-100 active:bg-orange-500 active:text-white h-10"
                        >
                            Decline
                            <CircleMinus size={16} className="mr-1" />
                        </Button>
                        <Button 
                            size="sm"
                            className="flex-1 bg-green-100 hover:bg-green-200 active:bg-green-500 active:text-white text-black h-10"
                        >
                            Approve
                            <CircleCheckBig size={16} className="mr-1"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}