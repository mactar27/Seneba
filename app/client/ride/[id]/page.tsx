"use client"

import { getRideDetails, cancelRide, rateRide } from "@/lib/actions/client"
import { useEffect, useState, use, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SenebaLogoIcon } from "@/components/seneba-logo"
import type { Ride } from "@/lib/types"
import { Phone, MessageCircle, X, Star, Car } from "lucide-react"
import { RatingModal } from "@/components/client/rating-modal"
import dynamic from "next/dynamic"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { getPusherClient } from "@/lib/pusher"

const RideMap = dynamic(() => import("@/components/client/ride-map").then(m => m.RideMap), { ssr: false, loading: () => <div className="h-full w-full bg-muted animate-pulse" /> })

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function RideTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRating, setShowRating] = useState(false)
  const prevStatusRef = useRef<string | null>(null)
  const { notify } = usePushNotifications()

  const loadRide = useCallback(async () => {
    const data = (await getRideDetails(id)) as any
    if (data) {
      const prevStatus = prevStatusRef.current
      const newStatus = data.status

      // Fire real notification on status change
      if (prevStatus && prevStatus !== newStatus) {
        if (newStatus === "accepted") {
          notify(
            "🚗 Chauffeur trouvé !",
            `${data.driver?.full_name || "Votre chauffeur"} accepte votre course.`,
            `/client/ride/${id}`
          )
        } else if (newStatus === "arriving") {
          notify(
            "📍 Chauffeur en route",
            `${data.driver?.full_name || "Votre chauffeur"} arrive bientôt !`,
            `/client/ride/${id}`
          )
        } else if (newStatus === "in_progress") {
          notify(
            "🚀 Course en cours",
            `Destination : ${data.destination_address}`,
            `/client/ride/${id}`
          )
        } else if (newStatus === "completed") {
          notify(
            "✅ Course terminée",
            `Merci d'avoir voyagé avec SENEBA ! Tarif : ${data.total_fare} FCFA`,
            `/client/ride/${id}`
          )
        } else if (newStatus === "cancelled") {
          notify(
            "❌ Course annulée",
            "Votre course a été annulée.",
            "/client/book"
          )
        }
      }

      prevStatusRef.current = newStatus
      setRide(data as Ride)
      if (data.status === "completed" && !data.rating) {
        setShowRating(true)
      }
    }
    setLoading(false)
  }, [id, notify])

  useEffect(() => {
    loadRide()

    // Pusher: subscribe to real-time ride events
    const pusher = getPusherClient()
    let channel: any = null

    if (pusher) {
      channel = pusher.subscribe(`ride-${id}`)

      // Driver location update → update driver coords on map without full reload
      channel.bind("driver-location", (data: { lat: number; lng: number }) => {
        setRide(prev => {
          if (!prev || !prev.driver) return prev
          return {
            ...prev,
            driver: { ...prev.driver, current_latitude: data.lat, current_longitude: data.lng }
          }
        })
      })

      // Status change → reload ride details to get full driver info
      channel.bind("ride-status", () => {
        loadRide()
      })

      // Also fired on ride accepted event
      channel.bind("ride-accepted", () => {
        loadRide()
      })
    }

    // Lightweight fallback poll every 15s (resilience if Pusher not configured)
    const interval = setInterval(loadRide, 15000)

    return () => {
      clearInterval(interval)
      if (pusher && channel) {
        pusher.unsubscribe(`ride-${id}`)
      }
    }
  }, [loadRide, id])

  const handleCancelRide = async () => {
    await cancelRide(id)
    router.push("/client/book")
  }

  const handleRatingSubmit = async (rating: number, comment: string) => {
    await rateRide(id, rating, comment)
    setShowRating(false)
    router.push("/client/book")
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="animate-pulse">
          <SenebaLogoIcon className="h-16 w-16" />
        </div>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
        <p className="text-muted-foreground mb-4">Course introuvable</p>
        <Button onClick={() => router.push("/client/book")}>Retour</Button>
      </div>
    )
  }

  const statusConfig = {
    requested: {
      title: "Recherche d'un chauffeur...",
      subtitle: "Veuillez patienter, nous cherchons un chauffeur disponible",
      color: "text-primary",
      showCancel: true,
    },
    accepted: {
      title: "Chauffeur trouvé !",
      subtitle: "Votre chauffeur se prépare",
      color: "text-green-600",
      showCancel: true,
    },
    arriving: {
      title: "Chauffeur en route",
      subtitle: "Votre chauffeur arrive bientôt",
      color: "text-accent",
      showCancel: false,
    },
    in_progress: {
      title: "Course en cours",
      subtitle: "Profitez de votre trajet",
      color: "text-primary",
      showCancel: false,
    },
    completed: {
      title: "Course terminée",
      subtitle: "Merci d'avoir voyagé avec SENEBA",
      color: "text-green-600",
      showCancel: false,
    },
    cancelled: {
      title: "Course annulée",
      subtitle: "Cette course a été annulée",
      color: "text-destructive",
      showCancel: false,
    },
  }

  const status = statusConfig[ride.status as keyof typeof statusConfig] || statusConfig.requested

  let distanceText = ""
  let etaText = ""

  if (ride.driver && ride.driver.current_latitude && ride.driver.current_longitude) {
    let targetLat = ride.pickup_latitude
    let targetLng = ride.pickup_longitude

    if (ride.status === "in_progress") {
      targetLat = ride.destination_latitude
      targetLng = ride.destination_longitude
    }

    const distKm = getDistanceFromLatLonInKm(
      ride.driver.current_latitude, ride.driver.current_longitude,
      Number(targetLat), Number(targetLng)
    )
    
    // avg speed 30km/h => 0.5 km/min => minutes = distKm * 2
    const mins = Math.max(1, Math.round(distKm * 2))
    
    distanceText = distKm < 1 ? `À ${Math.round(distKm * 1000)} m` : `À ${distKm.toFixed(1)} km`
    etaText = `⏳ ~${mins} min`
  }

  return (
    <div className="flex h-svh flex-col bg-background overflow-hidden">
      {/* Map area */}
      <div className="relative flex-1 min-h-0 bg-muted/50 z-0 overflow-hidden">
        <RideMap
          pickupLat={Number(ride.pickup_latitude)}
          pickupLng={Number(ride.pickup_longitude)}
          destLat={Number(ride.destination_latitude)}
          destLng={Number(ride.destination_longitude)}
          driverLat={ride.driver?.current_latitude}
          driverLng={ride.driver?.current_longitude}
          status={ride.status}
          className="absolute inset-0"
        />

        {/* Status indicator */}
        <div className="absolute top-4 left-4 right-4 bg-card rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            {ride.status === "requested" ? (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className={`h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ${status.color}`}>
                <Car className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className={`font-semibold ${status.color}`}>{status.title}</p>
              <p className="text-sm text-muted-foreground">{status.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride details panel */}
      <div className="bg-card border-t shadow-lg rounded-t-3xl -mt-6 relative z-10 safe-area-bottom overflow-y-auto max-h-[55vh]">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-4" />

        <div className="px-4 pb-6">
          {/* Driver info (if assigned) */}
          {ride.driver && (
            <Card className="mb-4 overflow-hidden border border-slate-100 shadow-sm">
              {/* Header: avatar + name + rating + contact buttons */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#0066CC]/5 to-transparent border-b border-slate-100">
                <div className="h-14 w-14 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0 ring-2 ring-[#0066CC]/20">
                  <span className="text-2xl font-bold text-[#0066CC]">{ride.driver.full_name?.charAt(0) || "C"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base truncate">{ride.driver.full_name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(Number(ride.driver?.average_rating ?? 0)) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {ride.driver.average_rating ? Number(ride.driver.average_rating).toFixed(1) : "Nouveau"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-[#0066CC]/30 text-[#0066CC]" asChild>
                    <a href={`tel:${ride.driver.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-green-500/30 text-green-600" asChild>
                    <a href={`https://wa.me/${ride.driver.phone?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Vehicle details */}
              <div className="p-4 space-y-3">
                {/* Plate badge + vehicle color */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Colored circle for vehicle color */}
                    {ride.driver.vehicle_color && (
                      <div
                        className="h-5 w-5 rounded-full border-2 border-white shadow-sm shrink-0"
                        style={{ backgroundColor: ride.driver.vehicle_color.toLowerCase() === "blanc" ? "#f1f5f9"
                          : ride.driver.vehicle_color.toLowerCase() === "noir" ? "#1e293b"
                          : ride.driver.vehicle_color.toLowerCase() === "gris" ? "#94a3b8"
                          : ride.driver.vehicle_color.toLowerCase() === "rouge" ? "#ef4444"
                          : ride.driver.vehicle_color.toLowerCase() === "bleu" ? "#3b82f6"
                          : ride.driver.vehicle_color.toLowerCase() === "vert" ? "#22c55e"
                          : ride.driver.vehicle_color.toLowerCase() === "jaune" ? "#eab308"
                          : "#cbd5e1"
                        }}
                        title={ride.driver.vehicle_color}
                      />
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {ride.driver.vehicle_color && <span className="text-muted-foreground mr-1">{ride.driver.vehicle_color}</span>}
                      {ride.driver.vehicle_make} {ride.driver.vehicle_model}
                      {ride.driver.vehicle_year && <span className="text-muted-foreground ml-1">({ride.driver.vehicle_year})</span>}
                    </span>
                  </div>
                  {/* Vehicle type badge */}
                  {ride.driver.vehicle_type && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {ride.driver.vehicle_type === "berline" ? "Berline"
                        : ride.driver.vehicle_type === "7_places" ? "7 Places"
                        : ride.driver.vehicle_type === "suv" ? "SUV"
                        : ride.driver.vehicle_type === "van" ? "Van"
                        : ride.driver.vehicle_type}
                    </span>
                  )}
                </div>

                {/* License plate */}
                {ride.driver.license_plate && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Plaque :</span>
                    <span className="font-mono font-bold text-sm tracking-widest bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1 rounded-lg">
                      {ride.driver.license_plate}
                    </span>
                  </div>
                )}

                {/* Distance & ETA */}
                {distanceText && (ride.status === "accepted" || ride.status === "arriving" || ride.status === "in_progress") && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-[#0066CC] font-semibold text-sm">
                    <span>📍 {distanceText}</span>
                    <span className="text-slate-300">|</span>
                    <span>{etaText}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Route info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="h-3 w-3 rounded-full bg-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Départ</p>
                <p className="font-medium">{ride.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-medium">{ride.destination_address}</p>
              </div>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center justify-between py-3 border-t border-b">
            <span className="text-muted-foreground">Tarif estimé</span>
            <span className="text-xl font-bold">{ride.total_fare} FCFA</span>
          </div>

          {/* Actions */}
          {status.showCancel && (
            <Button
              variant="outline"
              onClick={handleCancelRide}
              className="w-full mt-4 h-12 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <X className="h-5 w-5 mr-2" />
              Annuler la course
            </Button>
          )}

          {ride.status === "completed" && (
            <Button onClick={() => router.push("/client/book")} className="w-full mt-4 h-12">
              Réserver une nouvelle course
            </Button>
          )}
        </div>
      </div>

      {/* Rating modal */}
      {showRating && ride.driver && (
        <RatingModal
          driverName={ride.driver.full_name || "Chauffeur"}
          onSubmit={handleRatingSubmit}
          onClose={() => {
            setShowRating(false)
            router.push("/client/book")
          }}
        />
      )}
    </div>
  )
}
