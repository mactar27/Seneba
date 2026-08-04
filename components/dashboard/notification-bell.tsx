"use client"

import { useState, useEffect, useCallback } from "react"
import { getNotifications, markAllAsRead, markAsRead, type Notification } from "@/lib/actions/notifications"
import { Bell, CheckCheck, Car, DollarSign, Star, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function NotifIcon({ type }: { type: Notification["type"] }) {
  const iconMap = {
    ride_request: <Car className="h-4 w-4 text-primary" />,
    ride_cancelled: <AlertCircle className="h-4 w-4 text-destructive" />,
    payment: <DollarSign className="h-4 w-4 text-green-600" />,
    rating: <Star className="h-4 w-4 text-accent" />,
    system: <Info className="h-4 w-4 text-muted-foreground" />,
  }
  const bgMap = {
    ride_request: "bg-primary/10",
    ride_cancelled: "bg-destructive/10",
    payment: "bg-green-500/10",
    rating: "bg-accent/10",
    system: "bg-muted",
  }
  return (
    <div className={`h-9 w-9 rounded-full ${bgMap[type]} flex items-center justify-center shrink-0`}>
      {iconMap[type]}
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return "À l'instant"
  if (mins < 60) return `Il y a ${mins} min`
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${days}j`
}

interface NotificationPanelProps {
  driverId: string
}

export function NotificationBell({ driverId }: NotificationPanelProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadNotifications = useCallback(async () => {
    const data = await getNotifications()
    setNotifications(data)
    setUnread(data.filter(n => !n.is_read).length)
  }, [])

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 5000)
    return () => clearInterval(interval)
  }, [loadNotifications])

  const handleOpen = async () => {
    setOpen(prev => !prev)
  }

  const handleMarkAll = async () => {
    setLoading(true)
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnread(0)
    setLoading(false)
  }

  const handleRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnread(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={handleOpen}>
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <Card className="absolute right-0 top-12 w-80 max-h-[70vh] z-50 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unread > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 text-primary h-7"
                  onClick={handleMarkAll}
                  disabled={loading}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tout lire
                </Button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <Bell className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${!notif.is_read ? "bg-primary/5" : ""}`}
                      onClick={() => !notif.is_read && handleRead(notif.id)}
                    >
                      <NotifIcon type={notif.type} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.is_read ? "font-semibold" : "font-medium"}`}>{notif.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notif.body}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDate(notif.created_at)}</p>
                      </div>
                      {!notif.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
