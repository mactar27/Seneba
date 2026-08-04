"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SenebaLogo } from "@/components/seneba-logo"
import type { Driver } from "@/lib/types"
import { NotificationBell } from "@/components/dashboard/notification-bell"

interface DashboardHeaderProps {
  driver: Driver
}

export function DashboardHeader({ driver }: DashboardHeaderProps) {
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
              {driver.vehicle_make} {driver.vehicle_model}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SenebaLogo className="h-6" />
          <NotificationBell driverId={driver.id} />
        </div>
      </div>
    </header>
  )
}
