"use client"

import { getClientProfilee, createRide, getClientRideHistory } from "@/lib/actions/client"
import { getClientNotifications, markClientNotificationsAsRead, type Notification } from "@/lib/actions/notifications"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Client } from "@/lib/types"
import dynamic from "next/dynamic"
import { 
  Menu, MapPin, Car, Building2, Utensils, Package, Truck, 
  ChevronRight, ChevronLeft, Plane, Bell, Star, ArrowRight, 
  Compass, X, Search, Mic, Settings, HelpCircle, Heart, Tag, 
  Clock, User, CheckCircle2, ShieldCheck, Sparkles, CheckCheck
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const ClientMap = dynamic(() => import("@/components/client/client-map").then(mod => mod.ClientMap), { ssr: false })

// --- Premium Vehicle Images ---
function StandardCarSVG() {
  return <img src="/images/standard_car.png" alt="Standard Car" className="w-12 h-12 object-contain my-1" />
}

function ComfortCarSVG() {
  return <img src="/images/confort_car.png" alt="Comfort Car" className="w-12 h-12 object-contain my-1" />
}

function IntercityVanSVG() {
  return <img src="/images/interurbain_van.png" alt="Intercity Van" className="w-12 h-12 object-contain my-1" />
}

export default function BookRidePage() {
  const router = useRouter()
  const { notify } = usePushNotifications()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentDestinations, setRecentDestinations] = useState<{title: string, sub: string, icon: any}[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pushEnabled, setPushEnabled] = useState(false)
  
  // UI States
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [pickup, setPickup] = useState("My current location")
  const [destination, setDestination] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [selectedService, setSelectedService] = useState<"standard" | "confort" | "interurbain">("standard")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wave" | "orange_money">("cash")

  const loadNotifications = useCallback(async () => {
    try {
      const notifs = await getClientNotifications()
      setNotifications(notifs)
    } catch (e) {
      console.error("Error loading notifications:", e)
    }
  }, [])

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    await markClientNotificationsAsRead()
  }

  const handleEnablePush = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          setPushEnabled(true)
          notify("SENEBA 🇬🇲", "Push notifications are now active on this device!")
        }
      })
    }
  }

  const loadClient = useCallback(async () => {
    const clientData = await getClientProfilee()
    if (clientData) {
      setClient(clientData as Client)
      const history = await getClientRideHistory()
      if (history.rides) {
        const uniqueDestinations = new Map<string, {title: string, sub: string, icon: any}>()
        history.rides.forEach((ride: any) => {
          const dest = ride.destination_address || ""
          if (dest && !uniqueDestinations.has(dest)) {
            uniqueDestinations.set(dest, {
              title: dest.split(',')[0],
              sub: dest.split(',').slice(1).join(',').trim() || "Gambia",
              icon: MapPin
            })
          }
        })
        setRecentDestinations(Array.from(uniqueDestinations.values()).slice(0, 3))
      }
    }
    await loadNotifications()
    setLoading(false)
  }, [loadNotifications])

  useEffect(() => {
    loadClient()
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushEnabled(Notification.permission === "granted")
    }
  }, [loadClient])

  const openSearch = () => {
    setIsSearchMode(true)
  }

  const selectDestination = (dest: string) => {
    setDestination(dest)
    setIsSearchMode(false)
  }

  const handleBookRide = async () => {
    if (!client || !pickup || !destination) return
    setIsBooking(true)

    const GAMBIA_CITIES: Record<string, { lat: number, lng: number }> = {
      "Banjul": { lat: 13.4549, lng: -16.5790 },
      "Serrekunda": { lat: 13.4392, lng: -16.6789 },
      "Brikama": { lat: 13.2667, lng: -16.6500 },
      "Basse": { lat: 13.3105, lng: -14.2147 },
      "My current location": { lat: 13.4549, lng: -16.5790 },
    }

    const getCoords = async (location: string) => {
      const key = Object.keys(GAMBIA_CITIES).find(c => location.toLowerCase().includes(c.toLowerCase()))
      if (key) return GAMBIA_CITIES[key]
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&countrycodes=gm&limit=1`)
        const data = await res.json()
        if (data && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        }
      } catch (err) {
        console.error("Geocoding failed", err)
      }
      
      return { lat: 13.4549 + Math.random() * 0.05, lng: -16.5790 + Math.random() * 0.05 }
    }

    const pickupCoords = await getCoords(pickup)
    const destCoords = await getCoords(destination)
    
    const isComfort = selectedService === "confort"
    const isIntercity = selectedService === "interurbain"
    const baseFare = isComfort ? 1000 : isIntercity ? 500 : 500
    
    const distanceKm = Math.sqrt(Math.pow(destCoords.lat - pickupCoords.lat, 2) + Math.pow(destCoords.lng - pickupCoords.lng, 2)) * 111 || 5
    const distanceFare = distanceKm * (isComfort ? 500 : isIntercity ? 200 : 300)
    const totalFare = Math.round(baseFare + distanceFare)

    const result = await createRide({
      client_id: client.id,
      client_name: client.full_name,
      client_phone: client.phone,
      pickup_address: pickup,
      pickup_latitude: pickupCoords.lat,
      pickup_longitude: pickupCoords.lng,
      destination_address: destination,
      destination_latitude: destCoords.lat,
      destination_longitude: destCoords.lng,
      distance_km: distanceKm,
      base_fare: baseFare,
      distance_fare: distanceFare,
      total_fare: totalFare,
      payment_method: paymentMethod,
    })

    if (result.error) {
      console.error("Error creating ride:", result.error)
      setIsBooking(false)
      return
    }

    router.push(`/client/ride/${result.id}`)
  }

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
      </div>
    )
  }

  // --- Sidebar Component ---
  const SidebarContent = () => (
    <div className="flex flex-col h-full pointer-events-auto bg-white">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/seneba.png" alt="Seneba" className="h-8 object-contain" />
        </div>
        <span className="text-[10px] font-black text-slate-400">Partner</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        <button onClick={() => { setDestination(""); setIsSearchMode(false) }} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-blue-50/50 text-[#0066CC] font-bold text-sm text-left">
          <Compass className="w-5 h-5 text-[#0066CC]" /> Home
        </button>
        <Link href="/client/delivery" className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Package className="w-5 h-5 text-slate-400" /> Delivery
        </Link>
        <Link href="/client/history" className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Clock className="w-5 h-5 text-slate-400" /> History
        </Link>
        <Link href="/client/profile" className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left">
          <Settings className="w-5 h-5 text-slate-400" /> Settings
        </Link>
        <Link href="/client/support" className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left">
          <HelpCircle className="w-5 h-5 text-slate-400" /> Help & Support
        </Link>
      </nav>
      <div className="p-6 border-t border-slate-50 bg-white">
        <span className="text-xs text-slate-400 font-semibold">Version 1.0.0</span>
      </div>
    </div>
  )

  return (
    <div className="h-[100dvh] w-full flex flex-col relative bg-[#F8FAFC] overflow-hidden select-none">
      
      {/* ─── FULLSCREEN INTERACTIVE MAP (DEFAULT VIEW) ─── */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <ClientMap className="w-full h-full" />
      </div>

      {/* ─── FLOATING TOP HEADER ─── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-4 safe-area-top pointer-events-none">
        {/* Left: Sidebar Menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-slate-100/80 pointer-events-auto active:scale-90 transition-transform text-slate-800">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 pointer-events-auto p-0 z-[200]">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Center: Brand Pill */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-100 flex items-center gap-2 pointer-events-auto">
          <img src="/images/seneba.png" alt="Seneba" className="h-5 object-contain" />
          <span className="text-xs font-bold text-slate-800">
            {client?.full_name?.split(" ")[0] || "Client"}
          </span>
        </div>

        {/* Right: Notifications Bell */}
        <button 
          onClick={() => {
            setIsNotifOpen(true)
            if (notifications.some(n => !n.is_read)) {
              handleMarkAllRead()
            }
          }}
          className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-slate-100/80 pointer-events-auto active:scale-90 transition-transform text-slate-800 relative"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {notifications.some(n => !n.is_read) && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0066CC]"></span>
            </span>
          )}
        </button>
      </header>

      {/* ─── REAL NOTIFICATION SHEET ─── */}
      <Sheet open={isNotifOpen} onOpenChange={setIsNotifOpen}>
        <SheetContent side="top" className="rounded-b-[28px] max-h-[82vh] p-5 z-[250] flex flex-col overflow-hidden">
          <SheetHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <SheetTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0066CC]" /> Notifications
            </SheetTitle>
            {notifications.some(n => !n.is_read) && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </SheetHeader>

          {/* Native Device Push Prompt Card */}
          <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0066CC] flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h5 className="font-bold text-slate-900 text-xs">Push alerts on this phone</h5>
                <p className="text-[11px] text-slate-500 font-medium">Instant updates when driver arrives</p>
              </div>
            </div>
            {pushEnabled ? (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Active ✓
              </span>
            ) : (
              <button 
                onClick={handleEnablePush}
                className="text-xs font-bold bg-[#0066CC] hover:bg-[#0052A3] text-white px-3 py-1.5 rounded-xl shadow-sm active:scale-95 transition-transform"
              >
                Enable
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const isPromo = notif.type === "payment"
                const isSafety = notif.type === "rating"
                const isRide = notif.type === "ride_request"

                return (
                  <div 
                    key={notif.id}
                    className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 relative ${
                      notif.is_read 
                        ? "bg-white border-slate-100" 
                        : "bg-blue-50/30 border-blue-200 shadow-sm"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isPromo ? "bg-emerald-50 text-emerald-600" :
                      isSafety ? "bg-amber-50 text-amber-600" :
                      isRide ? "bg-blue-50 text-[#0066CC]" :
                      "bg-indigo-50 text-indigo-600"
                    }`}>
                      {isPromo ? <Tag className="w-5 h-5" /> :
                       isSafety ? <ShieldCheck className="w-5 h-5" /> :
                       isRide ? <Car className="w-5 h-5" /> :
                       <Sparkles className="w-5 h-5" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{notif.title}</h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#0066CC] flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{notif.body}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium">No notifications yet.</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ─── FLOATING GPS RECENTER BUTTON ─── */}
      <div className="absolute right-4 z-20 pointer-events-auto bottom-[340px]">
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

      {/* ─── NATIVE BOTTOM SHEET (UBER / BOLT STYLE) ─── */}
      <div className="mt-auto z-30 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-slate-100 flex flex-col mb-16 max-h-[55vh] overflow-hidden">
        {/* Grab handle */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

        {/* STATE A: NO DESTINATION CHOSEN YET */}
        {!destination ? (
          <div className="px-5 pt-1 pb-4 flex flex-col">
            <h3 className="text-base font-black text-slate-900 mb-3 tracking-tight">
              Where are you going today?
            </h3>

            {/* Tap to Search Bar */}
            <button 
              onClick={openSearch}
              className="w-full bg-slate-50 hover:bg-slate-100 rounded-2xl h-13 px-4 flex items-center justify-between border border-slate-150 transition-colors mb-4 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex-shrink-0" />
                <span className="text-slate-400 font-medium text-sm">Where to?</span>
              </div>
              <Search className="w-4 h-4 text-slate-400" />
            </button>

            {/* Quick Destinations Shortcuts */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Quick access
              </span>
              {(recentDestinations.length > 0 ? recentDestinations : [
                { title: "Aéroport Banjul", sub: "Yundum, Gambie", icon: Plane },
                { title: "Marché Albert", sub: "Banjul", icon: Building2 },
                { title: "Yum-Yum", sub: "Serrekunda", icon: Utensils },
              ]).map((place, idx) => (
                <button 
                  key={idx} 
                  onClick={() => selectDestination(place.title)} 
                  className="w-full bg-white rounded-xl p-2.5 flex items-center justify-between text-left border border-slate-100 hover:bg-blue-50/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-[#0066CC] flex-shrink-0">
                      <place.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{place.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{place.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0066CC] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* STATE B: DESTINATION SELECTED - RIDE OPTIONS & BOOKING */
          <div className="px-5 pt-1 pb-4 flex flex-col overflow-y-auto">
            {/* Route Summary */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-3 relative">
              <div className="flex flex-col gap-2 relative">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 text-xs truncate flex-1">{pickup}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="font-bold text-slate-900 text-xs truncate flex-1">{destination}</span>
                  <button 
                    onClick={() => setDestination("")} 
                    className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Options */}
            <div className="flex gap-2 mb-3">
              {/* Standard */}
              <button 
                onClick={() => setSelectedService("standard")}
                className={`flex-1 rounded-2xl p-2.5 flex flex-col items-center gap-1 border transition-all ${
                  selectedService === "standard" 
                    ? "border-[#0066CC] bg-blue-50/20 shadow-sm" 
                    : "border-slate-100 bg-white opacity-60 hover:opacity-100"
                }`}
              >
                <StandardCarSVG />
                <span className="font-black text-slate-800 text-xs">Standard</span>
                <span className="text-[10px] text-slate-500 font-semibold">~500 GMD</span>
              </button>

              {/* Comfort */}
              <button 
                onClick={() => setSelectedService("confort")}
                className={`flex-1 rounded-2xl p-2.5 flex flex-col items-center gap-1 border transition-all ${
                  selectedService === "confort" 
                    ? "border-[#0066CC] bg-blue-50/20 shadow-sm" 
                    : "border-slate-100 bg-white opacity-60 hover:opacity-100"
                }`}
              >
                <ComfortCarSVG />
                <span className="font-black text-slate-800 text-xs">Comfort</span>
                <span className="text-[10px] text-slate-500 font-semibold">~1000 GMD</span>
              </button>

              {/* Intercity */}
              <button 
                onClick={() => setSelectedService("interurbain")}
                className={`flex-1 rounded-2xl p-2.5 flex flex-col items-center gap-1 border transition-all ${
                  selectedService === "interurbain" 
                    ? "border-[#0066CC] bg-blue-50/20 shadow-sm" 
                    : "border-slate-100 bg-white opacity-60 hover:opacity-100"
                }`}
              >
                <IntercityVanSVG />
                <span className="font-black text-slate-800 text-xs">Intercity</span>
                <span className="text-[10px] text-slate-500 font-semibold">~500 GMD</span>
              </button>
            </div>

            {/* Payment Method Pills */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button 
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === "cash" 
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                💵 Cash
              </button>
              <button 
                onClick={() => setPaymentMethod("wave")}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === "wave" 
                    ? "bg-[#1cc6ff] text-white border-[#1cc6ff] shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <img src="/images/wave_logo.png" alt="Wave" className="w-3.5 h-3.5 rounded-full" />
                Wave
              </button>
              <button 
                onClick={() => setPaymentMethod("orange_money")}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === "orange_money" 
                    ? "bg-[#ff6600] text-white border-[#ff6600] shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <img src="/images/orange_money_logo.png" alt="Orange" className="w-3.5 h-3.5 rounded" />
                Orange
              </button>
            </div>

            {/* Book CTA Button */}
            <Button 
              onClick={handleBookRide} 
              disabled={!destination || isBooking} 
              className="w-full h-12 text-sm font-black rounded-xl bg-[#0066CC] hover:bg-[#0052A3] text-white flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform shadow-md"
            >
              {isBooking ? "Booking..." : "Order Seneba"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ─── FULLSCREEN SEARCH MODAL (SLIDES IN) ─── */}
      <AnimatePresence>
        {isSearchMode && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-50 bg-white flex flex-col p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900">Where to?</h2>
              <button 
                onClick={() => setIsSearchMode(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Search Container */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search destination"
                className="w-full bg-[#F4F8FA] rounded-2xl h-13 pl-12 pr-12 outline-none font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium text-sm"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') selectDestination(destination) }}
                autoFocus
              />
            </div>

            {/* Suggestions */}
            <div className="flex-1 overflow-y-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                Popular in Gambia
              </span>
              <div className="space-y-3">
                {(recentDestinations.length > 0 ? recentDestinations : [
                  { title: "Aéroport Banjul", sub: "Yundum, Gambie", icon: Plane },
                  { title: "Marché Albert", sub: "Banjul", icon: Building2 },
                  { title: "Yum-Yum", sub: "Serrekunda", icon: Utensils },
                  { title: "Place de l'Indépendance", sub: "Banjul", icon: Compass },
                ]).map((place, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => selectDestination(place.title)} 
                    className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-[#0066CC] flex-shrink-0">
                        <place.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{place.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{place.sub}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FIXED BOTTOM NAVIGATION BAR ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 safe-area-bottom h-16 shadow-lg">
        <div className="flex items-center justify-around h-full px-2">
          {/* Tab 1: Book (Active) */}
          <button 
            onClick={() => { setDestination(""); setIsSearchMode(false) }}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[#0066CC] transition-all"
          >
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-bold">Book</span>
          </button>

          {/* Tab 2: History */}
          <Link 
            href="/client/history"
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
          </Link>

          {/* Tab 3: Profile */}
          <Link 
            href="/client/profile"
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>

    </div>
  )
}
