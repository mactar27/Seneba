"use client"

import { getDriverProfile, getRideHistory } from "@/lib/actions/driver"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Driver, Ride } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { ArrowLeft, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [rides, setRides] = useState<Ride[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadData = useCallback(async () => {
    const driverData = await getDriverProfile()
    if (!driverData) {
      router.push("/auth/login")
      return
    }

    setDriver(driverData)

    const history = await getRideHistory(driverData.id)
    setRides(history)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background pb-20 safe-area-top safe-area-bottom">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Historique</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        {rides.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Aucune course effectuée</p>
            <p className="text-sm text-muted-foreground mt-1">Vos courses terminées apparaîtront ici</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {rides.map((ride) => (
              <Card key={ride.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {ride.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-medium">{ride.status === "completed" ? "Terminée" : "Annulée"}</span>
                  </div>
                  {ride.status === "completed" && (
                    <span className="font-bold text-green-600">{ride.total_fare || ride.base_fare} FCFA</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm line-clamp-1">{ride.pickup_address}</p>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm line-clamp-1">{ride.destination_address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <span>{formatDate(ride.created_at)}</span>
                  {ride.distance_km && <span>{Number(ride.distance_km).toFixed(1)} km</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
