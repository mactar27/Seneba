"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Ride } from "@/lib/types"
import { Navigation, Clock, Banknote, X, Check } from "lucide-react"
import { useEffect, useState } from "react"

interface RideRequestCardProps {
  ride: Ride
  onAccept: () => void
  onDecline: () => void
}

export function RideRequestCard({ ride, onAccept, onDecline }: RideRequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDecline])

  return (
    <Card className="p-4 border-2 border-accent animate-pulse-border overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">Nouvelle course</p>
            <p className="text-sm text-muted-foreground">{timeLeft}s pour accepter</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-accent">
          <Banknote className="h-5 w-5" />
          {ride.base_fare} FCFA
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="w-0.5 h-8 bg-border" />
            <div className="h-3 w-3 rounded-full bg-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Prise en charge</p>
              <p className="text-sm font-medium line-clamp-1">{ride.pickup_address}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="text-sm font-medium line-clamp-1">{ride.destination_address}</p>
            </div>
          </div>
        </div>
      </div>

      {ride.distance_km && ride.duration_minutes && (
        <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Navigation className="h-4 w-4" />
            {Number(ride.distance_km || 0).toFixed(1)} km
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />~{ride.duration_minutes} min
          </div>
        </div>
      )}

      {/* Payment Method Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Paiement :</span>
        {ride.payment_method === 'wave' ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1cc6ff]/10 text-[#00a3d9] border border-[#1cc6ff]">Wave</span>
        ) : ride.payment_method === 'orange_money' ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff6600]/10 text-[#e65c00] border border-[#ff6600]">Orange Money</span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white border border-slate-800">Cash</span>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 h-12 bg-transparent" onClick={onDecline}>
          <X className="h-5 w-5 mr-2" />
          Refuser
        </Button>
        <Button className="flex-1 h-12 bg-green-600 hover:bg-green-700" onClick={onAccept}>
          <Check className="h-5 w-5 mr-2" />
          Accepter
        </Button>
      </div>
    </Card>
  )
}
