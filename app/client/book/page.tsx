"use client"

import { getClientProfilee, createRide } from "@/lib/actions/client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Client } from "@/lib/types"
import dynamic from "next/dynamic"
import { Menu, MapPin, Car, CarFront, Building2, Utensils, Navigation, Package, Truck, Shield, ChevronRight, ChevronLeft, Briefcase, Plane, Bell, Star, ArrowRight, Compass, X, Search, Mic, LogOut, Settings, HelpCircle, Heart, Tag } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const ClientMap = dynamic(() => import("@/components/client/client-map").then(mod => mod.ClientMap), { ssr: false })

// --- Premium Vehicle SVGs ---
function StandardCarSVG() {
  return <img src="/images/standard_car.png" alt="Standard" className="w-20 h-10 object-contain" />
}

function ComfortCarSVG() {
  return <img src="/images/confort_car.png" alt="Comfort" className="w-20 h-10 object-contain" />
}

function IntercityVanSVG() {
  return <img src="/images/interurbain_van.png" alt="Intercity" className="w-20 h-10 object-contain" />
}

export default function BookRidePage() {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  
  // UI States
  const [isMapMode, setIsMapMode] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [pickup, setPickup] = useState("Ma position actuelle")
  const [destination, setDestination] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [selectedService, setSelectedService] = useState<"standard" | "confort" | "interurbain">("standard")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wave" | "orange_money">("cash")

  const loadClient = useCallback(async () => {
    const clientData = await getClientProfilee()
    if (clientData) {
      setClient(clientData as Client)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadClient()
  }, [loadClient])

  const handleSoon = (feature: string) => {
    alert(`${feature} sera bientôt disponible ! (Simulation)`)
  }

  const openSearch = () => {
    setIsSearchMode(true)
  }

  const selectDestination = (dest: string) => {
    setDestination(dest)
    setIsSearchMode(false)
    setIsMapMode(true)
  }

  const openBooking = (dest: string = "") => {
    if (dest) setDestination(dest)
    setIsMapMode(true)
  }

  const handleBookRide = async () => {
    if (!client || !pickup || !destination) return
    setIsBooking(true)

    const SENEGAL_CITIES: Record<string, { lat: number, lng: number }> = {
      "Dakar": { lat: 14.6928, lng: -17.4467 },
      "Thiès": { lat: 14.791, lng: -16.926 },
      "Saint-Louis": { lat: 16.029, lng: -16.496 },
      "Ziguinchor": { lat: 12.571, lng: -16.271 },
      "Ma position actuelle": { lat: 14.6928, lng: -17.4467 },
    }

    const getCoords = (location: string) => {
      const key = Object.keys(SENEGAL_CITIES).find(c => location.toLowerCase().includes(c.toLowerCase()))
      if (key) return SENEGAL_CITIES[key]
      return { lat: 14.6928 + Math.random() * 0.05, lng: -17.4467 + Math.random() * 0.05 }
    }

    const pickupCoords = getCoords(pickup)
    const destCoords = getCoords(destination)
    
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
      <div className="flex min-h-svh items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
      </div>
    )
  }

  // --- Common Sidebar Component (Screen 8) ---
  const SidebarContent = () => (
    <div className="flex flex-col h-full pointer-events-auto bg-white">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/seneba.png" alt="Seneba" className="h-8 object-contain" />
        </div>
        <span className="text-[10px] font-black text-slate-400">Partenaire</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        <button onClick={() => { setIsMapMode(false); setIsSearchMode(false) }} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-blue-50/50 text-[#0066CC] font-bold text-sm text-left">
          <Compass className="w-5 h-5 text-[#0066CC]" /> Accueil
        </button>
        <button onClick={() => openBooking()} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Car className="w-5 h-5 text-slate-400" /> Courses
        </button>
        <Link href="/client/delivery" className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Package className="w-5 h-5 text-slate-400" /> Livraison
        </Link>
        <button onClick={() => handleSoon("Food")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Utensils className="w-5 h-5 text-slate-400" /> Food
        </button>
        <button onClick={() => handleSoon("Cargo")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Truck className="w-5 h-5 text-slate-400" /> Cargo
        </button>
        <button onClick={() => handleSoon("Navigateur")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm text-left">
          <Compass className="w-5 h-5 text-slate-400" /> Navigateur
        </button>
        <hr className="my-2 border-slate-50" />
        <button onClick={() => handleSoon("Favoris")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left">
          <Heart className="w-5 h-5 text-slate-400" /> Favoris
        </button>
        <button onClick={() => handleSoon("Promotions")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left">
          <Tag className="w-5 h-5 text-slate-400" /> Promotions
        </button>
        <button onClick={() => handleSoon("Notifications")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left relative">
          <Bell className="w-5 h-5 text-slate-400" /> Notifications
          <span className="absolute right-4 w-2.5 h-2.5 bg-blue-600 rounded-full" />
        </button>
        <Link href="/client/profile" className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left">
          <Settings className="w-5 h-5 text-slate-400" /> Settings
        </Link>
        <button onClick={() => handleSoon("Aide")} className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 font-semibold text-sm text-left">
          <HelpCircle className="w-5 h-5 text-slate-400" /> Aide & support
        </button>
      </nav>
      <div className="p-6 border-t border-slate-50 bg-white">
        <span className="text-xs text-slate-400 font-semibold">Version 1.0.0</span>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-svh flex-col relative bg-[#F8FAFC] overflow-x-hidden pb-16">
      
      {/* ─── SCREEN 3: DESTINATION SEARCH FULLSCREEN (SCREEN 3) ─── */}
      <AnimatePresence>
        {isSearchMode && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 15 }}
            className="fixed inset-0 z-50 bg-white flex flex-col p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-900">Where to?</h2>
              <button 
                onClick={() => setIsSearchMode(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Search Container */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher une destination"
                className="w-full bg-[#F4F8FA] rounded-2xl h-14 pl-12 pr-12 outline-none font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium text-sm"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') selectDestination(destination) }}
                autoFocus
              />
              <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer" />
            </div>

            {/* Quick Actions */}
            <div className="space-y-1 mb-6">
              {/* Position Actuelle */}
              <button 
                onClick={() => { setPickup("Ma position actuelle") }}
                className="w-full flex items-center gap-4 py-3 border-b border-slate-50 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0066CC] flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ma position actuelle</h4>
                  <p className="text-xs text-slate-400 font-medium">Utiliser ma position</p>
                </div>
              </button>

              {/* Home */}
              <button 
                onClick={() => selectDestination("Hann Bel-Air")}
                className="w-full flex items-center gap-4 py-3 border-b border-slate-50 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Home</h4>
                  <p className="text-xs text-[#0066CC] font-bold">Set an address</p>
                </div>
              </button>

              {/* Office */}
              <button 
                onClick={() => selectDestination("Plateau, Gambia")}
                className="w-full flex items-center gap-4 py-3 border-b border-slate-50 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Office</h4>
                  <p className="text-xs text-[#0066CC] font-bold">Set an address</p>
                </div>
              </button>
            </div>

            {/* Recent destinations */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="font-black text-slate-900 text-sm mb-3">Recent destinations</h3>
              <div className="space-y-4">
                {[
                  { title: "Aéroport AIBD", sub: "Diass, Sénégal", icon: Plane },
                  { title: "Cité Elisabeth Diouf", sub: "Rue HB-335, Hann-Bel-Air", icon: Building2 },
                  { title: "Yum-Yum Ouakam", sub: "Rue OKM-99, 338", icon: Utensils },
                  { title: "Place de l'Indépendance", sub: "Gambia", icon: Compass },
                ].map((place, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => selectDestination(place.title)} 
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#0066CC] transition-colors">
                        <place.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-[14px]">{place.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{place.sub}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer search link */}
            <button onClick={() => handleSoon("History complet")} className="text-center font-bold text-sm text-[#0066CC] py-3 hover:underline">
              Voir plus d'historique
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── STATE 1: HUB VIEW (HOME / SUPER APP) ─── */}
      {!isMapMode && !isSearchMode && (
        <main className="flex-1 px-5 pt-4 pb-20 animate-in fade-in duration-200">
          
          {/* Header (No circular boxes around icons, matching Screen 1 header) */}
          <Sheet>
            <header className="flex items-center justify-between py-3 mb-6">
              <div className="flex items-center gap-2">
                <img src="/images/seneba.png" alt="Seneba" className="h-8 object-contain" />
              </div>
              <div className="flex items-center gap-4 text-slate-700">
                <button onClick={() => handleSoon("Notifications")} className="relative active:scale-95 transition-transform">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-600 rounded-full" />
                </button>
                <SheetTrigger asChild>
                  <button className="active:scale-95 transition-transform">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
              </div>
            </header>
            <SheetContent side="left" className="w-80 pointer-events-auto p-0 z-[200]">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* Greet & Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              Bonjour {client?.full_name?.split(" ")[0] || "Client"} 👋
            </h2>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Où allez-vous aujourd'hui ?</h1>
          </div>

          {/* Rapid Address Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-col gap-4 relative">
              {/* Pickup Input representation */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{pickup}</span>
                </div>
                <button className="text-[#0066CC] hover:opacity-80">
                  <Compass className="w-5 h-5" />
                </button>
              </div>

              {/* Destination Input representation */}
              <div 
                onClick={openSearch}
                className="flex items-center gap-3.5 pt-1 cursor-pointer hover:opacity-80"
              >
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center" />
                <span className="text-slate-400 font-medium text-sm">Where to?</span>
              </div>
            </div>
          </div>


          {/* Medium Banner */}
          <button 
            onClick={() => openBooking()} 
            className="w-full bg-[#EBF3FF] rounded-[24px] p-5 text-left flex items-center justify-between mb-8 active:scale-95 transition-transform relative overflow-hidden group border border-blue-100"
          >
            <div className="z-10 w-2/3">
              <h3 className="text-slate-900 font-black text-base mb-1 tracking-tight">Move around easily</h3>
              <p className="text-slate-500 text-xs font-semibold">Fast and secure rides anytime</p>
            </div>
            <div className="w-20 h-12 relative z-10 flex items-center justify-center">
              <img src="/images/real_vehicle.png" alt="Car" className="w-full h-full object-contain" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0066CC] shadow-sm ml-2">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Recent Destinations */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base">Recent destinations</h3>
              <button onClick={openSearch} className="text-xs font-black text-[#0066CC] hover:underline">See all</button>
            </div>

            <div className="space-y-3">
              {[
                { title: "Aéroport AIBD", sub: "Diass, Sénégal", icon: Plane },
                { title: "Cité Elisabeth Diouf", sub: "Rue HB-335, Hann-Bel-Air", icon: Building2 },
                { title: "Yum-Yum Ouakam", sub: "Rue OKM-99, 338", icon: Utensils },
              ].map((place, idx) => (
                <button key={idx} onClick={() => selectDestination(place.title)} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between text-left shadow-sm border border-slate-50 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-50/50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#0066CC] transition-colors">
                      <place.icon className="w-5 h-5 text-[#0066CC]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[14px]">{place.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{place.sub}</p>
                    </div>
                  </div>
                  <Star className="w-4 h-4 text-slate-300 hover:text-amber-400 cursor-pointer transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="w-[calc(100%+2.5rem)] -mx-5 mt-6 cursor-pointer" onClick={() => handleSoon("Infos de sécurité")}>
            <img 
              src="/images/real_vehicle.png" 
              alt="SUV" 
              className="w-full h-auto" 
            />
          </div>
        </main>
      )}

      {/* ─── STATE 2: MAP BOOKING VIEW (ACTIVE) ─── */}
      {isMapMode && !isSearchMode && (
        <div className="absolute inset-0 z-40 bg-white animate-in slide-in-from-right duration-300 flex flex-col">
          {/* Floating Header (Clean round buttons, matching Screen 2) */}
          <header className="absolute top-4 left-0 right-0 z-50 flex items-center justify-between px-4 pointer-events-none">
            <button 
              onClick={() => setIsMapMode(false)} 
              className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 pointer-events-auto active:scale-90 transition-transform text-slate-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 pointer-events-auto active:scale-90 transition-transform text-slate-800">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 pointer-events-auto p-0 z-[200]">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </header>
          
          {/* Full Screen Map */}
          <div className="absolute inset-0 z-0 h-[60vh]">
            <ClientMap className="w-full h-full" />
          </div>

          {/* Floating Current Location Info */}
          <div className="absolute top-[42vh] left-0 right-0 z-10 flex justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-slate-100 flex items-center gap-2 pointer-events-auto">
              <Compass className="w-4 h-4 text-[#0066CC]" />
              <span className="text-xs font-bold text-slate-800">Ma position actuelle</span>
            </div>
          </div>

          {/* Floating GPS Target button */}
          <div className="absolute top-[48vh] right-4 z-10 pointer-events-auto">
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

          {/* Sliding Booking Drawer / Sheet */}
          <div className="mt-auto bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-slate-100 z-40 relative flex flex-col max-h-[58vh] overflow-y-auto pb-safe">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

            <div className="px-5 pb-6 pt-1 flex-1 flex flex-col">
              {/* Double Address Input Card */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mb-4 relative">
                <div className="flex flex-col gap-3 relative">
                  
                  {/* Start Point */}
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <input 
                        type="text" 
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold text-sm"
                        placeholder="Lieu de départ"
                      />
                    </div>
                    <Compass className="w-4 h-4 text-blue-600 flex-shrink-0 cursor-pointer" />
                  </div>

                  {/* Vertical dotted connector line */}
                  <div className="absolute left-[7px] top-[18px] bottom-[18px] w-0.5 border-l-2 border-dashed border-slate-300" />

                  {/* Destination */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0" />
                    <input 
                      type="text" 
                      value={destination}
                      onClick={openSearch}
                      readOnly
                      className="flex-1 bg-transparent border-none outline-none text-slate-800 font-bold text-sm placeholder:text-slate-400 placeholder:font-normal cursor-pointer"
                      placeholder="Where to?"
                    />
                  </div>
                </div>
              </div>

              {/* Service Categories Options */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Type de course</span>
                <button onClick={() => handleSoon("Types")} className="text-[11px] font-black text-[#0066CC] hover:underline">See all</button>
              </div>

              <div className="flex gap-2.5 mb-4">
                {/* Standard */}
                <button 
                  onClick={() => setSelectedService("standard")}
                  className={`flex-1 bg-white rounded-2xl p-3 flex flex-col items-center gap-2 border transition-all ${
                    selectedService === "standard" 
                      ? "border-[#0066CC] bg-blue-50/10 shadow-sm" 
                      : "border-slate-100 opacity-60 hover:opacity-100"
                  }`}
                >
                  <StandardCarSVG />
                  <div className="text-center">
                    <span className="block font-black text-slate-800 text-[13px]">Standard</span>
                    <span className="block text-[9px] text-slate-400 font-medium">Rapide & abordable</span>
                  </div>
                </button>

                {/* Comfort */}
                <button 
                  onClick={() => setSelectedService("confort")}
                  className={`flex-1 bg-white rounded-2xl p-3 flex flex-col items-center gap-2 border transition-all ${
                    selectedService === "confort" 
                      ? "border-[#0066CC] bg-blue-50/10 shadow-sm" 
                      : "border-slate-100 opacity-60 hover:opacity-100"
                  }`}
                >
                  <ComfortCarSVG />
                  <div className="text-center">
                    <span className="block font-black text-slate-800 text-[13px]">Comfort</span>
                    <span className="block text-[9px] text-slate-400 font-medium">Plus d'espace</span>
                  </div>
                </button>

                {/* Intercity */}
                <button 
                  onClick={() => setSelectedService("interurbain")}
                  className={`flex-1 bg-white rounded-2xl p-3 flex flex-col items-center gap-2 border transition-all ${
                    selectedService === "interurbain" 
                      ? "border-[#0066CC] bg-blue-50/10 shadow-sm" 
                      : "border-slate-100 opacity-60 hover:opacity-100"
                  }`}
                >
                  <IntercityVanSVG />
                  <div className="text-center">
                    <span className="block font-black text-slate-800 text-[13px]">Intercity</span>
                    <span className="block text-[9px] text-slate-400 font-medium">Voyagez loin</span>
                  </div>
                </button>
              </div>

              {/* Payment Methods buttons */}
              <div className="mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Payment method</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {/* Cash */}
                <button 
                  onClick={() => setPaymentMethod("cash")}
                  className={`py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === "cash" 
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                      : "bg-white text-slate-600 border-slate-150 hover:bg-slate-50"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <circle cx="7" cy="15" r="1" />
                    <circle cx="17" cy="15" r="1" />
                  </svg>
                  Cash
                </button>

                {/* Wave */}
                <button 
                  onClick={() => setPaymentMethod("wave")}
                  className={`py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === "wave" 
                      ? "bg-[#1cc6ff] text-white border-[#1cc6ff] shadow-sm" 
                      : "bg-white text-slate-600 border-slate-150 hover:bg-slate-50"
                  }`}
                >
                  <img src="/images/wave_logo.png" alt="Wave" className="w-6 h-6 flex-shrink-0 object-contain rounded-full" />
                  Wave
                </button>

                {/* Orange Money */}
                <button 
                  onClick={() => setPaymentMethod("orange_money")}
                  className={`py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === "orange_money" 
                      ? "bg-[#ff6600] text-white border-[#ff6600] shadow-sm" 
                      : "bg-white text-slate-600 border-slate-150 hover:bg-slate-50"
                  }`}
                >
                  <img src="/images/orange_money_logo.png" alt="Orange Money" className="w-5 h-5 flex-shrink-0 object-contain rounded-xl" />
                  Orange
                </button>
              </div>

              {/* Order Seneba trigger button */}
              <Button 
                onClick={handleBookRide} 
                disabled={!destination || isBooking} 
                className="w-full h-13 text-sm font-bold rounded-2xl bg-[#0066CC] hover:bg-[#0052A3] text-white flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
              >
                {isBooking ? "Création du trajet..." : "Commander Seneba"} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── BOTTOM NAVIGATION BAR ─── */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-area-bottom h-16"
      >
        <div className="flex items-center justify-around h-full px-2">
          {/* Tab 1: Book */}
          <button 
            onClick={() => { setIsMapMode(false); setIsSearchMode(false) }}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
              !isMapMode && !isSearchMode ? "text-[#0066CC]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-bold">Book</span>
          </button>

          {/* Tab 2: History */}
          <Link 
            href="/client/history"
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
          </Link>

          {/* Tab 3: Profile */}
          <Link 
            href="/client/profile"
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>

    </div>
  )
}
