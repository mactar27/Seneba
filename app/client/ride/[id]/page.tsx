"use client"

import { getRideDetails, cancelRide, rateRide } from "@/lib/actions/client"
import { useEffect, useState, use, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Ride } from "@/lib/types"
import { Phone, MessageCircle, X, Star, Car, Compass, Share2, Menu, ChevronLeft, MapPin } from "lucide-react"
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

      if (prevStatus && prevStatus !== newStatus) {
        if (newStatus === "accepted") {
          notify("🚗 Chauffeur trouvé !", `${data.driver?.full_name || "Votre chauffeur"} accepte votre course.`, `/client/ride/${id}`)
        } else if (newStatus === "arriving") {
          notify("📍 Chauffeur en route", `${data.driver?.full_name || "Votre chauffeur"} arrive bientôt !`, `/client/ride/${id}`)
        } else if (newStatus === "in_progress") {
          notify("🚀 Course en cours", `Destination : ${data.destination_address}`, `/client/ride/${id}`)
        } else if (newStatus === "completed") {
          notify("✅ Course terminée", `Merci d'avoir voyagé avec SENEBA ! Tarif : ${data.total_fare} FCFA`, `/client/ride/${id}`)
        } else if (newStatus === "cancelled") {
          notify("❌ Course annulée", "Votre course a été annulée.", "/client/book")
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

    const pusher = getPusherClient()
    let channel: any = null

    if (pusher) {
      channel = pusher.subscribe(`ride-${id}`)

      channel.bind("driver-location", (data: { lat: number; lng: number }) => {
        setRide(prev => {
          if (!prev || !prev.driver) return prev
          return {
            ...prev,
            driver: { ...prev.driver, current_latitude: data.lat, current_longitude: data.lng }
          }
        })
      })

      channel.bind("ride-status", () => {
        loadRide()
      })

      channel.bind("ride-accepted", () => {
        loadRide()
      })
    }

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

  const handleSoon = (feature: string) => {
    alert(`${feature} sera bientôt disponible !`)
  }

  const handleRatingSubmit = async (rating: number, comment: string) => {
    await rateRide(id, rating, comment)
    setShowRating(false)
    router.push("/client/book")
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
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

  // Distance / ETA logic
  let mins = 3
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
    mins = Math.max(1, Math.round(distKm * 2))
  }

  return (
    <div className="flex h-svh flex-col bg-[#F8FAFC] overflow-hidden relative">
      
      {/* Map Background */}
      <div className="absolute inset-0 z-0 h-[62vh]">
        <RideMap
          pickupLat={Number(ride.pickup_latitude)}
          pickupLng={Number(ride.pickup_longitude)}
          destLat={Number(ride.destination_latitude)}
          destLng={Number(ride.destination_longitude)}
          driverLat={ride.driver?.current_latitude}
          driverLng={ride.driver?.current_longitude}
          status={ride.status}
          className="w-full h-full"
        />
      </div>

      {/* Floating Header on Map */}
      <header className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4 pointer-events-none">
        <button 
          onClick={() => router.push("/client/book")}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <button 
          onClick={() => handleSoon("Menu")}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 pointer-events-auto active:scale-90 transition-transform"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>
      </header>

      {/* Floating GPS button */}
      <div className="absolute top-[50vh] right-4 z-10 pointer-events-auto">
        <button 
          onClick={() => {
            const btn = document.querySelector('[title="Centrer sur ma position"]') as HTMLButtonElement
            if (btn) btn.click()
          }}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg text-[#0066CC] border border-slate-100 active:scale-90 transition-transform"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Top Floating Box: Status & Time (Screen 4 Layout) */}
      <div className="absolute top-20 left-4 right-4 z-20 bg-white rounded-3xl p-5 shadow-lg border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">En cours</span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mt-1">
            Arrivée dans <span className="text-[#0066CC]">{mins} min</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Votre chauffeur est en route</p>
        </div>
        {/* White vehicle illustration SVG */}
        <div className="w-16 h-12 flex items-center justify-center">
          <svg viewBox="0 0 100 40" className="w-16 h-10 object-contain">
            <path d="M5 25 L10 18 L25 16 L38 8 L68 8 L80 16 L92 18 L95 25 L92 28 L85 28 C85 23, 75 23, 75 28 L25 28 C25 23, 15 23, 15 28 L5 28 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="20" cy="28" r="5" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1.5" />
            <circle cx="80" cy="28" r="5" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1.5" />
            <path d="M30 16 L42 10 L50 10 L50 16 Z" fill="#475569" />
            <path d="M53 16 L53 10 L64 10 L72 16 Z" fill="#475569" />
          </svg>
        </div>
      </div>

      {/* Slide-Up Info Sheet */}
      <div className="mt-auto bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-slate-100 z-40 relative flex flex-col max-h-[48vh] overflow-y-auto pb-safe">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-4 flex-shrink-0" />

        <div className="px-5 pb-6 pt-1 flex-1 flex flex-col">
          {/* Driver details Card */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-800 text-lg border-2 border-white shadow-sm shrink-0">
                {ride.driver?.full_name?.charAt(0) || "D"}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px]">{ride.driver?.full_name || "Mamadou Fall"}</h4>
                <p className="text-xs text-slate-500 font-semibold">{ride.driver?.vehicle_model || "Toyota RAV4 • AA-123-CD"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-blue-50/50 px-2.5 py-1 rounded-xl">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700">{ride.driver?.average_rating ? Number(ride.driver.average_rating).toFixed(1) : "4.8"}</span>
            </div>
          </div>

          {/* Action Button Grid */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <button 
              onClick={() => handleSoon("Message")}
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-600">Message</span>
            </button>

            <a 
              href={`tel:${ride.driver?.phone || "771234567"}`}
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-600">Appeler</span>
            </a>

            <button 
              onClick={() => handleSoon("Partager")}
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-600">Partager</span>
            </button>

            <button 
              onClick={handleCancelRide}
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100/80 active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm">
                <X className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-red-600">Annuler</span>
            </button>
          </div>

          {/* Start and Destination Address Block */}
          <div className="bg-[#F8FAFC] rounded-3xl p-4 border border-slate-100">
            <div className="flex flex-col gap-3 relative">
              {/* Pickup */}
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0066CC]" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Départ</span>
                  <span className="text-slate-800 font-bold text-xs block mt-0.5 truncate">{ride.pickup_address || "Ma position actuelle"}</span>
                </div>
              </div>

              {/* Vertical line */}
              <div className="absolute left-[7px] top-[18px] bottom-[18px] w-0.5 border-l-2 border-dashed border-slate-300" />

              {/* Destination */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Arrivée</span>
                  <span className="text-slate-800 font-bold text-xs block mt-0.5 truncate">{ride.destination_address || "Aéroport AIBD"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showRating && (
        <RatingModal
          onClose={() => setShowRating(false)}
          onSubmit={handleRatingSubmit}
          driverName={ride.driver?.full_name || "Votre chauffeur"}
        />
      )}
    </div>
  )
}
