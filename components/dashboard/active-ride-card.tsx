"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Ride, RideStatus } from "@/lib/types"
import { Phone, MessageSquare, Navigation, CheckCircle2 } from "lucide-react"

interface ActiveRideCardProps {
  ride: Ride
  onStatusUpdate: (status: RideStatus) => void
}

export function ActiveRideCard({ ride, onStatusUpdate }: ActiveRideCardProps) {
  const statusConfig = {
    accepted: {
      label: "Course acceptée",
      action: "Je suis arrivé",
      nextStatus: "arriving" as RideStatus,
      color: "bg-blue-500",
    },
    arriving: {
      label: "En route vers le client",
      action: "Démarrer la course",
      nextStatus: "in_progress" as RideStatus,
      color: "bg-yellow-500",
    },
    in_progress: {
      label: "Course en cours",
      action: "Terminer la course",
      nextStatus: "completed" as RideStatus,
      color: "bg-green-500",
    },
    requested: { label: "", action: "", nextStatus: "accepted" as RideStatus, color: "" },
    completed: { label: "", action: "", nextStatus: "completed" as RideStatus, color: "" },
    cancelled: { label: "", action: "", nextStatus: "cancelled" as RideStatus, color: "" },
  }

  const config = statusConfig[ride.status]

  return (
    <Card className="p-4 border-2 border-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${config.color} animate-pulse`} />
          <p className="font-semibold">{config.label}</p>
        </div>
        <p className="text-lg font-bold">{ride.total_fare || ride.base_fare} FCFA</p>
      </div>

      {/* Client Info */}
      {ride.client_name && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-semibold text-primary">{ride.client_name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium">{ride.client_name}</p>
              <p className="text-sm text-muted-foreground">Client</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
              <Phone className="h-4 w-4" />
              <span className="sr-only">Appeler</span>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Message</span>
            </Button>
          </div>
        </div>
      )}

      {/* Route */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="w-0.5 h-8 bg-border" />
            <div className="h-3 w-3 rounded-full bg-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Prise en charge</p>
                <p className="text-sm font-medium">{ride.pickup_address}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="sr-only">Navigation</span>
              </Button>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="text-sm font-medium">{ride.destination_address}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="sr-only">Navigation</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full h-12 text-base font-semibold" onClick={() => onStatusUpdate(config.nextStatus)}>
        <CheckCircle2 className="h-5 w-5 mr-2" />
        {config.action}
      </Button>
    </Card>
  )
}
