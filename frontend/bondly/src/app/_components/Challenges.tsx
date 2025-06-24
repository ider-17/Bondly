'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@radix-ui/react-progress";
import { BookOpen, CalendarDays, LayoutGrid, List, Mountain, NotebookPen, Star, Trophy } from "lucide-react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const tabs = ["Active", "Completed", "Upcoming"]

export default function Challenges() {

    const [activeTab, setActiveTab] = useState("Active")

    return (
        <>
            <div className='w-full flex gap-5 justify-between'>
                <div className='w-1/3 bg-slate-50 border rounded-xl py-5 flex flex-col gap-2 items-center'>
                    <div className='w-8 h-8 bg-indigo-100 rounded-lg flex justify-center items-center'>
                        <CalendarDays size={18} color='#6366F1' />
                    </div>

                    <div className='flex flex-col items-center text-center'>
                        <p>2</p>
                        <p>Days Active</p>
                    </div>
                </div>

                <div className='w-1/3 bg-slate-50 border rounded-xl py-5 flex flex-col gap-2 items-center'>
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#22C55E' />
                    </div>

                    <div className='flex flex-col items-center text-center'>
                        <p>1</p>
                        <p>Challenges Done</p>
                    </div>
                </div>

                <div className='w-1/3 bg-slate-50 border rounded-xl py-5 flex flex-col gap-2 items-center'>
                    <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                        <BookOpen size={18} color='#6D28D9' />
                    </div>

                    <div className='flex flex-col items-center text-center'>
                        <p>2</p>
                        <p>Tips Read</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center gap-4 mt-5">
                    <div className="flex-1">
                        <div className="bg-gray-100 rounded-xl p-1 flex justify-between w-full">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${activeTab === tab ? "bg-white shadow text-black" : "text-gray-600"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-lg shadow-sm w-10 h-10"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-lg shadow-sm w-10 h-10"
                            >
                                <List className="w-5 h-5" />
                            </Button>
                        </div>

                        <Select>
                            <SelectTrigger className="w-[160px] h-10 shadow-sm rounded-lg text-sm">
                                <SelectValue placeholder="All weeks" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All weeks</SelectItem>
                                <SelectItem value="this">This week</SelectItem>
                                <SelectItem value="next">Next week</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>



                {activeTab === "Active" && (
                    <div className="p-4 space-y-2 bg-slate-50 border rounded-2xl mt-5">

                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 stroke-[2.5]" />
                            <h2 className="text-l font-medium">
                                Өөрийгөө багтаа танилцуулaарай<span className="ml-1">😊</span>
                            </h2>
                        </div>

                        <div className="flex items-center mt-4 gap-2">
                            <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-black font-medium">Week 1</span>
                            <span className="px-3 py-1 text-sm rounded-full bg-green-200 text-green-900 font-semibold">Easy</span>
                            <span className="px-3 py-1 text-sm rounded-full border border-gray-300 text-black font-medium flex items-center gap-1">
                                <Star className="w-4 h-4 stroke-[2.2]" />
                                20
                            </span>
                        </div>

                        <div className="mt-4">
                            <Dialog>
                                <DialogTrigger className="p-3 bg-white rounded-xl border flex gap-2 items-center">
                                    Write Note <NotebookPen className="w-4 h-4" />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Write Note</DialogTitle>
                                        <DialogDescription>Complete your first code review</DialogDescription>
                                        <hr className="my-2" />
                                        <p>Challenge notes</p>
                                        <Textarea placeholder="Describe your progress, challenges faced, and what you’ve learned..." />

                                        <hr className="mt-4"></hr>

                                        <div className="flex justify-between items-center">
                                            <Button variant="outline">Cancel</Button>
                                            <div className="flex gap-3">
                                                <Button className="bg-black text-white" variant="outline">Request Approval</Button>
                                            </div>
                                        </div>


                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}

                {activeTab === "Completed" && (
                    <div className="p-4 mt-5 text-green-700 font-semibold text-center rounded-xl border border-green-200 bg-green-50">
                        🎉 You’ve completed 1 challenges! Keep it up!
                    </div>
                )}

                {activeTab === "Upcoming" && (
                    <div className="p-4 mt-5 text-violet-700 font-semibold text-center rounded-xl border border-violet-200 bg-violet-50">
                        📅 Stay tuned! New challenges will appear here soon.
                    </div>
                )}
            </div>
        </>
    )
}