"use client"

import { useMemo, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Car, Clock, Route, Banknote, Smartphone, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FareEstimateProps {
  pickup: string
  destination: string
  onSelectionChange?: (selection: { type: string, payment: string, totalFare: number }) => void
}

export function FareEstimate({ pickup, destination, onSelectionChange }: FareEstimateProps) {
  const [courseType, setCourseType] = useState<"standard" | "confort">("standard")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "orange_money" | "wave">("cash")

  const estimate = useMemo(() => {
    const baseKm = 3 + Math.random() * 10
    const duration = Math.round(baseKm * 3 + 5)
    
    const stdTotal = Math.round(500 + baseKm * 300)
    const confTotal = Math.round(1000 + baseKm * 500)

    return {
      distance: Number(baseKm || 0).toFixed(1),
      duration,
      standardFare: stdTotal,
      confortFare: confTotal,
    }
  }, [pickup, destination])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        type: courseType,
        payment: paymentMethod,
        totalFare: courseType === "standard" ? estimate.standardFare : estimate.confortFare
      })
    }
  }, [courseType, paymentMethod, estimate, onSelectionChange])

  return (
    <div className="mt-4 space-y-4">
      {/* Route Info */}
      <div className="flex gap-4 text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-1.5">
          <Route className="h-4 w-4" />
          <span>{estimate.distance} km</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>~{estimate.duration} min</span>
        </div>
      </div>

      {/* Course Types */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Type de course</h3>
        
        {/* Standard */}
        <Card 
          className={cn("p-4 cursor-pointer transition-colors border-2", courseType === "standard" ? "border-primary bg-primary/5" : "border-transparent bg-muted/30")}
          onClick={() => setCourseType("standard")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Standard</p>
                <p className="text-xs text-muted-foreground">Economic & fast</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{estimate.standardFare} FCFA</p>
            </div>
          </div>
        </Card>

        {/* Comfort */}
        <Card 
          className={cn("p-4 cursor-pointer transition-colors border-2", courseType === "confort" ? "border-primary bg-primary/5" : "border-transparent bg-muted/30")}
          onClick={() => setCourseType("confort")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Comfort</p>
                <p className="text-xs text-muted-foreground">Spacious vehicles</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{estimate.confortFare} FCFA</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Moyen de paiement</h3>
        <div className="flex flex-col gap-2">
          {/* Cash */}
          <Card 
            className={cn("p-3 cursor-pointer transition-colors border-2 flex items-center justify-between", paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-transparent bg-muted/30")}
            onClick={() => setPaymentMethod("cash")}
          >
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Cash</span>
            </div>
            {paymentMethod === "cash" && <Check className="h-4 w-4 text-primary" />}
          </Card>

          {/* Orange Money */}
          <Card 
            className={cn("p-3 cursor-pointer transition-colors border-2 flex items-center justify-between", paymentMethod === "orange_money" ? "border-primary bg-primary/5" : "border-transparent bg-muted/30")}
            onClick={() => setPaymentMethod("orange_money")}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Orange Money</span>
            </div>
            {paymentMethod === "orange_money" && <Check className="h-4 w-4 text-primary" />}
          </Card>

          {/* Wave */}
          <Card 
            className={cn("p-3 cursor-pointer transition-colors border-2 flex items-center justify-between", paymentMethod === "wave" ? "border-primary bg-primary/5" : "border-transparent bg-muted/30")}
            onClick={() => setPaymentMethod("wave")}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Wave</span>
            </div>
            {paymentMethod === "wave" && <Check className="h-4 w-4 text-primary" />}
          </Card>
        </div>
      </div>
    </div>
  )
}
