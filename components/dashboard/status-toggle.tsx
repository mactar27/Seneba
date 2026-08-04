"use client"

import { Switch } from "@/components/ui/switch"
import { Power } from "lucide-react"

interface StatusToggleProps {
  isOnline: boolean
  onToggle: () => void
}

export function StatusToggle({ isOnline, onToggle }: StatusToggleProps) {
  return (
    <div
      className={`rounded-2xl p-4 transition-colors ${
        isOnline ? "bg-green-500/10 border-2 border-green-500/30" : "bg-muted border-2 border-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isOnline ? "bg-green-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"
            }`}
          >
            <Power className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">{isOnline ? "Vous êtes en ligne" : "Vous êtes hors ligne"}</p>
            <p className="text-sm text-muted-foreground">
              {isOnline ? "Prêt à recevoir des courses" : "Activez pour recevoir des courses"}
            </p>
          </div>
        </div>
        <Switch checked={isOnline} onCheckedChange={onToggle} className="scale-125" />
      </div>
    </div>
  )
}
