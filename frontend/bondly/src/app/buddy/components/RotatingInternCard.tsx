import { ArrowRight, Handshake, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function RotatingInternCard() {
    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-5'>
            <div className='flex gap-3 items-center'>
                <div className='w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center'>
                    <Handshake size={20} color='#F97316' />
                </div>
                <h6 className='font-semibold text-lg'>Your buddy for 2 weeks</h6>
            </div>

            <div className='bg-orange-50 rounded-lg p-3'>
                <h6 className='text-orange-700'>Meet someone new! Chats and micro-goals every 2 weeks</h6>
            </div>

            <div>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex gap-2 items-center'>
                        <Avatar className='w-10 h-10'>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h6 className='text-base font-medium'>Dulguunbayr Tselmeg</h6>
                            <p className='text-[#525252] text-sm font-medium'>Product Manager</p>
                        </div>
                    </div>

                    <Badge className="bg-green-100 text-green-500" variant="default">• Online</Badge>
                </div>

                <div className='w-full flex gap-3'>
                    <Button className="w-1/2 h-10 bg-blue-500 text-white hover:text-blue-500 hover:bg-white hover:border-blue-300 cursor-pointer" variant="outline"><Mail /> Contact me</Button>

                    <Button className="w-1/2 h-10 cursor-pointer" variant="outline">See more
                    <ArrowRight size={26} color='black' />
                    </Button>
                </div>
            </div>

            <hr />

            <div>
                <div className='flex justify-between items-center mb-3'>
                    <p className='text-sm font-medium text-neutral-600'>This week’s micro-goal:</p>

                    <Badge className="bg-orange-100 text-orange-500" variant="default">• In Progress</Badge>
                </div>

                <p>Манай бүтээгдэхүүн хөгжүүлэлтийн төлөвлөгөө ба хэрэглэгчийн <br /> санал хүсэлт авах үйл явцтай танилцаарай ☺ ️</p>
            </div>
        </div>
    )
}