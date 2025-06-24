import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"

export default function HeaderHome() {
    return (
        <header className='w-full header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300'>
            <div className='flex gap-3 items-center'>
                <Avatar className='w-10 h-10'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                    <h6 className='text-base font-medium'>Welcome Togtuun</h6>
                    <div className='flex'>
                        <p className='text-[#525252] font-medium text-sm'>UX/UI Designer • Design</p>
                    </div>
                </div>
            </div>
            <div>
                <Bell size={18} />
            </div>
        </header>
    )
}