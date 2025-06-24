"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserNotifications, getUnreadNotificationCount, subscribeToNotifications, markNotificationAsRead } from "@/lib/supabase-notifications"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Notification {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  type: string
}

export default function HeaderHome() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    
    // Get current user ID (you'll need to implement this based on your auth system)
    const userId = "current-user-id" // Replace with actual user ID from your auth

    useEffect(() => {
        loadNotifications()
        loadUnreadCount()
        
        // Subscribe to real-time notifications
        const subscription = subscribeToNotifications(userId, (payload) => {
            console.log('New notification:', payload)
            loadNotifications()
            loadUnreadCount()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [userId])

    const loadNotifications = async () => {
        const result = await getUserNotifications(userId)
        if (result.success) {
            setNotifications(result.data || [])
        }
    }

    const loadUnreadCount = async () => {
        const result = await getUnreadNotificationCount(userId)
        if (result.success) {
            setUnreadCount(result.count)
        }
    }

    const handleNotificationClick = async (notificationId: string) => {
        await markNotificationAsRead(notificationId)
        loadNotifications()
        loadUnreadCount()
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        return `${Math.floor(diffInHours / 24)}d ago`
    }

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
            
            <div className="relative">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <Badge 
                                    variant="destructive" 
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Badge>
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id)}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                            !notification.is_read ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {formatTimeAgo(notification.created_at)}
                                            </span>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    )
}