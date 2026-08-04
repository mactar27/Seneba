"use client"

import { Card } from "@/components/ui/card"
import { Star, Car } from "lucide-react"

interface QuickStatsProps {
  totalRides: number
  rating: number
}

export function QuickStats({ totalRides, rating }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalRides}</p>
            <p className="text-xs text-muted-foreground">Courses totales</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Star className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold">{Number(rating || 0).toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
