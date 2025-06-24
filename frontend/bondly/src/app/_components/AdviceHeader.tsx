import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"

export default function AdviceHeader() {
    return (
        <header className='fixed top-0 right-0 w-full pl-[284px] header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300'>
            <div className='flex flex-col '>
                <h6 className='text-2xl font-bold'>Advices</h6>
                <div className='flex'>
                    <p className='text-[#525252] font-medium text-sm'>Идэвхтэй, дууссан болон удахгүй болох сорилтуудаа эндээс хянах боломжтой</p>
                </div>
            </div>
            <div>
                <Bell size={18} />
            </div>
        </header>
    )
}