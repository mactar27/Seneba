"use client"

import { Input } from "@/components/ui/input"
import { MapPin, Navigation } from "lucide-react"

interface LocationInputProps {
  pickup: string
  destination: string
  onPickupChange: (value: string) => void
  onDestinationChange: (value: string) => void
}

export function LocationInput({ pickup, destination, onPickupChange, onDestinationChange }: LocationInputProps) {
  return (
    <div className="relative">
      {/* Vertical line connecting dots */}
      <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-muted-foreground/30" />

      <div className="space-y-4">
        {/* Pickup input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>
          <Input
            placeholder="Point de départ"
            value={pickup}
            onChange={(e) => onPickupChange(e.target.value)}
            className="pl-12 pr-12 h-14 bg-muted/30 border-2 border-muted-foreground/10 focus-visible:ring-0 focus-visible:border-primary focus-visible:bg-card transition-all text-base font-medium rounded-2xl"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
            onClick={() => onPickupChange("Ma position actuelle")}
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>

        {/* Destination input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <div className="h-4 w-4 rounded-full bg-[#F97316] flex items-center justify-center shadow-sm">
              <MapPin className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <Input
            placeholder="Where to?"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="pl-12 h-14 bg-muted/30 border-2 border-muted-foreground/10 focus-visible:ring-0 focus-visible:border-[#F97316] focus-visible:bg-card transition-all text-base font-medium rounded-2xl"
          />
        </div>
      </div>

      {/* Quick destinations */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          type="button"
          onClick={() => onDestinationChange("Aéroport AIBD")}
          className="flex whitespace-nowrap items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Aéroport AIBD
        </button>
        <button
          type="button"
          onClick={() => onDestinationChange("Dakar Plateau")}
          className="flex whitespace-nowrap items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors border border-muted-foreground/10"
        >
          <MapPin className="h-4 w-4" />
          Plateau
        </button>
        <button
          type="button"
          onClick={() => onDestinationChange("Almadies")}
          className="flex whitespace-nowrap items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors border border-muted-foreground/10"
        >
          <MapPin className="h-4 w-4" />
          Almadies
        </button>
      </div>
    </div>
  )
}
