"use client"

import { getClientRideHistory } from "@/lib/actions/client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Ride } from "@/lib/types"
import { ChevronLeft, Compass, Car, Package, Utensils, Check } from "lucide-react"
import Link from "next/link"

export default function ClientHistoryPage() {
  const router = useRouter()
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<"all" | "vehicle" | "delivery" | "food">("all")

  const loadData = useCallback(async () => {
    const historyResult = await getClientRideHistory()

    if (historyResult.error === "Non autorisé") {
      router.push("/client/auth/login")
      return
    }

    if (historyResult.rides) {
      setRides(historyResult.rides as unknown as Ride[])
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col bg-[#F8FAFC]">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
        </div>
      </div>
    )
  }

  // Fallback to mock data to match mockup Screen 5 exactly
  const mockRides = [
    { id: 1, type: "vehicle", name: "Aéroport AIBD", sub: "Diass, Sénégal", time: "08:42", price: "3 500 FCFA", dateGroup: "Aujourd'hui", status: "Payé" },
    { id: 2, type: "vehicle", name: "Cité Elisabeth Diouf", sub: "Hann-Bel-Air", time: "07:15", price: "1 800 FCFA", dateGroup: "Aujourd'hui", status: "Payé" },
    { id: 3, type: "food", name: "Yum-Yum Ouakam", sub: "Ouakam", time: "20:30", price: "2 200 FCFA", dateGroup: "Hier", status: "Payé" },
    { id: 4, type: "vehicle", name: "Point E → Almadies", sub: "Dakar", time: "18:10", price: "3 000 FCFA", dateGroup: "Hier", status: "Payé" },
    { id: 5, type: "vehicle", name: "Place de l'Indépendance", sub: "Dakar", time: "09:30", price: "1 500 FCFA", dateGroup: "22 Mai 2024", status: "Payé" },
  ]

  // Filter rides
  const filteredRides = mockRides.filter((ride) => {
    if (activeFilter === "all") return true
    return ride.type === activeFilter
  })

  // Group by date
  const groupedRides = filteredRides.reduce((acc, ride) => {
    const group = ride.dateGroup
    if (!acc[group]) acc[group] = []
    acc[group].push(ride)
    return acc
  }, {} as Record<string, typeof mockRides>)

  return (
    <div className="flex min-h-svh flex-col bg-[#F8FAFC] pb-20">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 safe-area-top sticky top-0 z-20 bg-[#F8FAFC]">
        <button onClick={() => router.push("/client/book")} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-800" />
        </button>
        <h1 className="text-xl font-black text-slate-900 leading-none">
          Historique
        </h1>
      </header>

      <main className="px-5">
        {/* Filter Pills */}
        <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-none pt-1">
          {[
            { id: "all", label: "Tous" },
            { id: "vehicle", label: "Courses" },
            { id: "delivery", label: "Livraisons" },
            { id: "food", label: "Food" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === filter.id
                  ? "bg-[#0066CC] text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* List grouped by date */}
        <div className="space-y-6">
          {Object.keys(groupedRides).map((date) => (
            <div key={date} className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{date}</h3>
              <div className="space-y-3">
                {groupedRides[date].map((ride) => {
                  const Icon = ride.type === "delivery" ? Package : ride.type === "food" ? Utensils : Car
                  return (
                    <div 
                      key={ride.id} 
                      className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-50 shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-50/50 flex items-center justify-center text-[#0066CC]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[14px] leading-tight">{ride.name}</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{ride.sub}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="block font-black text-slate-900 text-sm leading-tight">{ride.price}</span>
                        <div className="flex items-center justify-end gap-1.5 mt-1 leading-none">
                          <span className="text-[10px] text-slate-400 font-bold">{ride.time}</span>
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Payé</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-area-bottom h-16">
        <div className="flex items-center justify-around h-full px-2">
          <Link href="/client/book" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-medium">Réserver</span>
          </Link>
          <button className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[#0066CC] transition-all">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold">Historique</span>
          </button>
          <Link href="/client/profile" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
