"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SenebaLogo } from "@/components/seneba-logo"
import type { Driver } from "@/lib/types"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { switchRole } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User, Loader2 } from "lucide-react"

interface DashboardHeaderProps {
  driver: Driver
}

export function DashboardHeader({ driver }: DashboardHeaderProps) {
  const router = useRouter()
  const [switching, setSwitching] = useState(false)

  const handleSwitchToPassenger = async () => {
    setSwitching(true)
    try {
      const res = await switchRole('client')
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("seneba_session")
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            localStorage.setItem("seneba_session", JSON.stringify({ ...parsed, role: 'client' }))
          } catch (_) {}
        }
      }
      router.push(res.redirect || '/client/book')
    } catch (e) {
      console.error("Error switching to passenger:", e)
      setSwitching(false)
    }
  }

  const initials = driver.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={driver.profile_image_url || "/images/mactar-profile.png"} alt={driver.full_name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{driver.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {driver.vehicle_make || "Toyota"} {driver.vehicle_model || "Corolla"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Switch to Passenger Mode Button */}
          <button
            onClick={handleSwitchToPassenger}
            disabled={switching}
            className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0066CC] text-xs font-black flex items-center gap-1.5 border border-blue-200/60 active:scale-95 transition-all shadow-sm disabled:opacity-50"
            title="Passer en mode Passager"
          >
            {switching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066CC]" />
            ) : (
              <User className="w-3.5 h-3.5 text-[#0066CC]" />
            )}
            <span>Passager</span>
          </button>
          <NotificationBell driverId={driver.id} />
        </div>
      </div>
    </header>
  )
}
