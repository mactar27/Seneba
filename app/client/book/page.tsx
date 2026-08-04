"use client"

import { getClientProfile, createRide } from "@/lib/actions/client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SenebaLogoIcon } from "@/components/seneba-logo"
import type { Client } from "@/lib/types"
import dynamic from "next/dynamic"
import { BottomNavClient } from "@/components/client/bottom-nav"
import { Menu, MapPin, Car, CarFront, Building2, Trees, Waves, Bus, Navigation, Package, Utensils, Truck, Shield, ChevronRight, Briefcase, Plane } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { motion } from "framer-motion"

const ClientMap = dynamic(() => import("@/components/client/client-map").then(mod => mod.ClientMap), { ssr: false })

export default function BookRidePage() {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  
  // UI State
  const [isMapMode, setIsMapMode] = useState(false)
  const [showPickupSheet, setShowPickupSheet] = useState(false)
  const [pickup, setPickup] = useState("Ma position actuelle")
  const [destination, setDestination] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [selectedService, setSelectedService] = useState<"standard" | "confort" | "interurbain">("standard")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wave" | "orange_money">("cash")
  const [panelY, setPanelY] = useState(0)

  const loadClient = useCallback(async () => {
    const clientData = await getClientProfile()
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
    
    const isConfort = selectedService === "confort"
    const isInterurbain = selectedService === "interurbain"
    const baseFare = isConfort ? 1000 : isInterurbain ? 500 : 500
    
    const distanceKm = Math.sqrt(Math.pow(destCoords.lat - pickupCoords.lat, 2) + Math.pow(destCoords.lng - pickupCoords.lng, 2)) * 111 || 5
    const distanceFare = distanceKm * (isConfort ? 500 : isInterurbain ? 200 : 300)
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
      <div className="flex min-h-svh flex-col bg-white relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
        </div>
        <BottomNavClient active="book" />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col relative bg-white pb-24">
      {/* ─── APP HEADER ─── */}
      <header className="flex items-center justify-between px-4 py-4 safe-area-top sticky top-0 z-30 bg-white">
        <div className="flex items-center gap-2">
          <SenebaLogoIcon className="h-6 w-auto" />
          <button onClick={() => setShowPickupSheet(true)} className="flex items-center gap-1 text-slate-800 hover:text-[#0066CC] transition-colors ml-2 group">
            <Navigation className="w-3.5 h-3.5 text-[#0066CC] flex-shrink-0" />
            <span className="font-bold text-[15px] max-w-[150px] truncate group-hover:text-[#0066CC] transition-colors">{pickup}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 pointer-events-auto z-[200]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#E6F0FF] to-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-xl font-bold text-[#0066CC]">{client?.full_name?.charAt(0) || "U"}</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">{client?.full_name || "Utilisateur"}</p>
                  <p className="text-sm text-slate-500 font-medium">{client?.phone}</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">
              <Link href="/client/book" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-[#0066CC] font-bold">
                <MapPin className="h-5 w-5" /> Réserver une course
              </Link>
              <Link href="/client/history" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-colors">
                <ClockIcon className="h-5 w-5 text-slate-400" /> Historique
              </Link>
              <Link href="/client/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-colors">
                <UserIcon className="h-5 w-5 text-slate-400" /> Mon profil
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* ─── PICKUP LOCATION SHEET ─── */}
      {showPickupSheet && (
        <div className="fixed inset-0 z-[100] flex flex-col" onClick={(e) => { if (e.target === e.currentTarget) setShowPickupSheet(false) }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPickupSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-10 pb-safe">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-4" />
            <div className="px-5 pb-6">
              <h2 className="text-lg font-black text-slate-900 mb-4">Votre position de départ</h2>
              <div className="flex items-center gap-3 bg-[#F4F8FA] rounded-full h-12 px-4 mb-6">
                <Navigation className="w-4 h-4 text-[#0066CC] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher un lieu de départ..."
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400 text-sm"
                />
              </div>
              <div className="space-y-1">
                {[
                  { label: "Ma position actuelle", sub: "GPS activé", icon: "📍" },
                  { label: "Hann Bel-Air", sub: "Rue HB-335, Dakar", icon: "🏠" },
                  { label: "Plateau", sub: "Centre-ville, Dakar", icon: "🏢" },
                  { label: "Aéroport AIBD", sub: "Diass, Sénégal", icon: "✈️" },
                  { label: "Université UCAD", sub: "Fann, Dakar", icon: "🎓" },
                ].map((place, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setPickup(place.label); setShowPickupSheet(false) }}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl text-left transition-colors hover:bg-slate-50 active:bg-blue-50 ${
                      pickup === place.label ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {place.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-[15px] ${pickup === place.label ? 'text-[#0066CC]' : 'text-slate-900'}`}>{place.label}</h4>
                      <p className="text-xs text-slate-400 font-medium">{place.sub}</p>
                    </div>
                    {pickup === place.label && (
                      <div className="w-5 h-5 rounded-full bg-[#0066CC] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── HUB VIEW (SUPER APP) ─── */}
      {!isMapMode && (
        <main className="px-4 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Services Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="space-y-3">
              <button onClick={() => handleSoon("Livraison")} className="w-full bg-[#F4F8FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 aspect-[2/1] active:scale-95 transition-transform hover:shadow-md border border-slate-100/50">
                <Package className="w-8 h-8 text-orange-500" />
                <span className="font-bold text-slate-900 text-sm">Livraison</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleSoon("Navigateur")} className="bg-[#F4F8FA] rounded-[20px] p-3 flex flex-col items-center justify-center gap-1 aspect-square active:scale-95 transition-transform hover:shadow-md border border-slate-100/50">
                  <Navigation className="w-7 h-7 text-emerald-500" />
                  <span className="font-bold text-slate-900 text-[11px]">Navigateur</span>
                </button>
                <button onClick={() => handleSoon("Cargo")} className="bg-[#F4F8FA] rounded-[20px] p-3 flex flex-col items-center justify-center gap-1 aspect-square active:scale-95 transition-transform hover:shadow-md border border-slate-100/50">
                  <Truck className="w-7 h-7 text-blue-500" />
                  <span className="font-bold text-slate-900 text-[11px]">Cargo</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleSoon("Food")} className="w-full bg-[#F4F8FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 aspect-[2/1] active:scale-95 transition-transform hover:shadow-md border border-slate-100/50">
                <Utensils className="w-8 h-8 text-red-500" />
                <span className="font-bold text-slate-900 text-sm">Food</span>
              </button>
              <button onClick={() => openBooking()} className="w-full bg-gradient-to-br from-[#E6F0FF] to-blue-50 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 h-[calc(100%-4.5rem)] active:scale-95 transition-transform hover:shadow-md border border-[#0066CC]/10 relative overflow-hidden group">
                <Car className="w-12 h-12 text-[#0066CC] z-10 group-hover:scale-110 transition-transform" />
                <div className="z-10 text-center">
                  <span className="font-black text-slate-900 text-lg block">Courses</span>
                  <span className="text-[10px] font-bold text-slate-500">à partir de 4 min</span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Destination Button */}
          <button onClick={() => openBooking()} className="w-full bg-[#F4F8FA] rounded-2xl h-14 flex items-center justify-between px-5 mb-6 active:scale-95 transition-transform hover:shadow-sm">
            <div className="flex items-center gap-3">
              <CarFront className="w-6 h-6 text-[#0066CC]" />
              <span className="font-bold text-slate-900 text-[15px]">Où allons-nous ?</span>
            </div>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* Recent Destinations */}
          <div className="space-y-4 mb-8">
            {[
              { title: "Aéroport AIBD", sub: "Diass, Sénégal", icon: Plane },
              { title: "Cité Elisabeth Diouf", sub: "Rue HB-335, Hann-Bel-Air", icon: Building2 },
              { title: "Yum-Yum Ouakam", sub: "Rue OKM-99, 338", icon: Utensils },
            ].map((place, idx) => (
              <button key={idx} onClick={() => openBooking(place.title)} className="w-full flex items-center gap-4 text-left group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <place.icon className="w-5 h-5 text-slate-400 group-hover:text-[#0066CC] transition-colors" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-4 group-last:border-0">
                  <h4 className="font-bold text-slate-900 text-[15px]">{place.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{place.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Banners */}
          <div className="space-y-4">
            <button onClick={() => handleSoon("Courses d'entreprise")} className="w-full bg-slate-900 rounded-[24px] p-6 text-left relative overflow-hidden active:scale-95 transition-transform shadow-lg">
              <div className="relative z-10 w-2/3">
                <h2 className="text-white font-black text-2xl leading-tight mb-2 uppercase tracking-tighter">Courses d'entreprise</h2>
                <p className="text-slate-300 text-sm font-medium">Voyages d'affaires simplifiés</p>
              </div>
              <Briefcase className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white opacity-10" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSoon("Outils de sécurité")} className="bg-gradient-to-br from-blue-900 to-[#0066CC] rounded-[24px] p-5 text-left relative overflow-hidden active:scale-95 transition-transform shadow-lg">
                <h3 className="text-white font-black text-lg leading-tight mb-2 uppercase">Outils de sécurité</h3>
                <p className="text-blue-100 text-[11px] font-medium leading-relaxed max-w-[80%]">Restez en sécurité avec nous</p>
                <Shield className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white opacity-20" />
              </button>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => handleSoon("Revenus passifs")} className="flex-1 bg-gradient-to-br from-[#8c52ff] to-[#5ce1e6] rounded-[24px] p-4 text-left relative overflow-hidden active:scale-95 transition-transform shadow-lg">
                  <h3 className="text-white font-black text-sm leading-tight uppercase">Confiez votre voiture</h3>
                  <p className="text-white/80 text-[10px] font-bold mt-1">Gagnez des revenus</p>
                </button>
                <button onClick={() => handleSoon("Seneba Pro")} className="flex-1 bg-gradient-to-br from-[#ff914d] to-[#ff5757] rounded-[24px] p-4 text-left relative overflow-hidden active:scale-95 transition-transform shadow-lg">
                  <h3 className="text-white font-black text-sm leading-tight uppercase">Débute ta course</h3>
                  <p className="text-white/80 text-[10px] font-bold mt-1">En quelques secondes</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ─── MAP BOOKING VIEW ─── */}
      {isMapMode && (
        <div className="absolute inset-0 z-40 bg-white animate-in slide-in-from-right duration-300">
          <button onClick={() => setIsMapMode(false)} className="absolute top-4 left-4 z-50 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
            <ChevronLeftIcon className="w-6 h-6 text-slate-900" />
          </button>
          
          <div className="absolute inset-0 z-0">
            <ClientMap className="w-full h-full" />
          </div>

          <motion.div 
            drag="y"
            dragConstraints={{ top: 0, bottom: 250 }}
            dragElastic={0.1}
            animate={{ y: panelY }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 50 || info.velocity.y > 300) setPanelY(250)
              else if (info.offset.y < -50 || info.velocity.y < -300) setPanelY(0)
              else setPanelY(info.offset.y > 125 ? 250 : 0)
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] pb-safe"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-3" />

            <div className="px-5 pb-6">
              {/* Search Bar */}
              <div className="flex items-center gap-3 bg-[#F4F8FA] rounded-full h-14 px-5 mb-5 focus-within:ring-2 focus-within:ring-[#0066CC] transition-all">
                <div className="w-4 h-4 rounded-full bg-[#0066CC] flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <input 
                  type="text" 
                  placeholder="Où allez-vous ?" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-slate-900 font-bold text-base placeholder:text-slate-400 placeholder:font-normal"
                />
                {destination && (
                  <button onClick={() => setDestination("")}>
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              {/* Service Tiers */}
              <div className="flex gap-2 mb-5">
                <button onClick={() => setSelectedService("standard")} className={`flex-1 bg-white border rounded-[20px] p-3 flex flex-col items-start gap-2 shadow-sm transition-all ${selectedService === "standard" ? "border-[#0066CC] ring-1 ring-[#0066CC]/20" : "border-slate-100 opacity-60"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${selectedService === "standard" ? "bg-blue-50 text-[#0066CC]" : "bg-slate-50 text-slate-400"}`}>
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="text-left w-full">
                    <div className={`text-sm font-bold ${selectedService === "standard" ? "text-[#0066CC]" : "text-slate-700"}`}>Standard</div>
                    <div className="text-[10px] text-slate-400 font-medium">Rapide & abordable</div>
                  </div>
                </button>
                
                <button onClick={() => setSelectedService("confort")} className={`flex-1 bg-white border rounded-[20px] p-3 flex flex-col items-start gap-2 shadow-sm transition-all ${selectedService === "confort" ? "border-[#0066CC] ring-1 ring-[#0066CC]/20" : "border-slate-100 opacity-60"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${selectedService === "confort" ? "bg-blue-50 text-[#0066CC]" : "bg-slate-50 text-slate-400"}`}>
                    <CarFront className="w-5 h-5" />
                  </div>
                  <div className="text-left w-full">
                    <div className={`text-sm font-bold ${selectedService === "confort" ? "text-[#0066CC]" : "text-slate-700"}`}>Confort</div>
                    <div className="text-[10px] text-slate-400 font-medium">Plus d'espace</div>
                  </div>
                </button>

                <button onClick={() => setSelectedService("interurbain")} className={`flex-1 bg-white border rounded-[20px] p-3 flex flex-col items-start gap-2 shadow-sm transition-all ${selectedService === "interurbain" ? "border-[#0066CC] ring-1 ring-[#0066CC]/20" : "border-slate-100 opacity-60"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${selectedService === "interurbain" ? "bg-blue-50 text-[#0066CC]" : "bg-slate-50 text-slate-400"}`}>
                    <Bus className="w-5 h-5" />
                  </div>
                  <div className="text-left w-full">
                    <div className={`text-sm font-bold ${selectedService === "interurbain" ? "text-[#0066CC]" : "text-slate-700"}`}>Interurbain</div>
                    <div className="text-[10px] text-slate-400 font-medium">Voyagez loin</div>
                  </div>
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <button onClick={() => setPaymentMethod("cash")} className={`flex-1 flex items-center justify-center py-3 rounded-xl border text-xs font-bold transition-all ${paymentMethod === "cash" ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                    Cash
                  </button>
                  <button onClick={() => setPaymentMethod("wave")} className={`flex-1 flex items-center justify-center py-3 rounded-xl border text-xs font-bold transition-all ${paymentMethod === "wave" ? "bg-[#1cc6ff] text-white border-[#1cc6ff] shadow-md shadow-[#1cc6ff]/30" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                    Wave
                  </button>
                  <button onClick={() => setPaymentMethod("orange_money")} className={`flex-1 flex items-center justify-center py-3 rounded-xl border text-xs font-bold transition-all ${paymentMethod === "orange_money" ? "bg-[#ff6600] text-white border-[#ff6600] shadow-md shadow-[#ff6600]/30" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                    Orange Money
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <Button onClick={handleBookRide} disabled={!destination || isBooking} className="w-full h-14 text-base font-bold rounded-full shadow-[0_8px_20px_rgb(0,102,204,0.3)] bg-[#0066CC] hover:bg-[#0052A3] text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-transform">
                {isBooking ? "Création du trajet..." : "Commander Seneba"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {!isMapMode && <BottomNavClient active="book" />}
    </div>
  )
}

function ClockIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function UserIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
}
function ChevronLeftIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
}
