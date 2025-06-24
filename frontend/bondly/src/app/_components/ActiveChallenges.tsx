import { ArrowRight, Mountain, Sparkles } from "lucide-react";

export default function ActiveChallenges() {
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

            <div className="py-[10px] space-y-4">
                <hr />

                <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sparkles size={18} color="#22C55E" />
                    </div>
                    <p className="text-sm font-medium">Өөрийгөө багтаа танилцуулаарай😊</p>
                </div>

                <div className="flex gap-3"></div>
            </div>
        </div>
    )
}