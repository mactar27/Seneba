"use client"

import { getClientRideHistory } from "@/lib/actions/client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Ride } from "@/lib/types"
import { ChevronLeft, Headphones, Wrench, Package, Car } from "lucide-react"
import Link from "next/link"

export default function ClientHistoryPage() {
  const router = useRouter()
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<"all" | "vehicle" | "delivery">("all")

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
      <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
        </div>
      </div>
    )
  }

  // Si on n'a pas de courses, on génère des fausses données pour correspondre à la capture d'écran de l'utilisateur
  // (à retirer en prod pour n'utiliser que `rides`)
  const mockRides = rides.length > 0 ? rides : [
    { id: 1, type: "vehicle", name: "Véhicule Éco", time: "15:54", price: "1600F", address: "Sénégal, 55, Rue P, Dakar, Eglise Ciel S...", dateGroup: "Mardi 28 juillet" },
    { id: 2, type: "delivery", name: "Livraison", time: "17:02", price: "", address: "Cite Avion → Rue OKM-99, 338", dateGroup: "Vendredi 24 juillet" },
    { id: 3, type: "vehicle", name: "Véhicule Éco", time: "03:04", price: "1100F", address: "Route de l'Aeroport Yum-Yum Ouakam", dateGroup: "Dimanche 19 juillet" },
    { id: 4, type: "vehicle", name: "Véhicule Éco", time: "13:39", price: "2500F", address: "Rue HB-339 Rue OKM-246", dateGroup: "Samedi 28 mars" },
  ]

  // Filter rides based on active filter
  const filteredRides = mockRides.filter((ride) => {
    if (activeFilter === "all") return true
    return (ride as any).type === activeFilter
  })

  // Group by date
  const groupedRides = filteredRides.reduce((acc, ride) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const group = (ride as any).dateGroup || "Aujourd'hui"
    if (!acc[group]) acc[group] = []
    acc[group].push(ride)
    return acc
  }, {} as Record<string, typeof mockRides>)

  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA] pb-10">
      {/* ─── Header ─── */}
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">
          Mes courses
        </h1>
      </header>

      <main className="px-4">
        
        {/* ─── Filters ─── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide pt-1">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all active:scale-95 ${
              activeFilter === "all" 
                ? "bg-[#0066CC] shadow-[0_4px_12px_rgba(0,102,204,0.25)] text-white border border-[#0066CC]" 
                : "bg-white text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50"
            }`}
          >
            Tout
          </button>
          
          <button 
            onClick={() => setActiveFilter("vehicle")}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full font-semibold text-[13px] shadow-sm border flex items-center gap-2 transition-all active:scale-95 ${
              activeFilter === "vehicle"
                ? "bg-[#0066CC] border-[#0066CC] shadow-[0_4px_12px_rgba(0,102,204,0.25)] text-white"
                : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeFilter === "vehicle" ? "bg-white/20" : "bg-blue-50"}`}>
              <Car className={`w-3 h-3 ${activeFilter === "vehicle" ? "text-white" : "text-[#0066CC]"}`} />
            </div>
            Véhicule
          </button>
          
          <button 
            onClick={() => setActiveFilter("delivery")}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full font-semibold text-[13px] shadow-sm border flex items-center gap-2 transition-all active:scale-95 ${
              activeFilter === "delivery"
                ? "bg-[#0066CC] border-[#0066CC] shadow-[0_4px_12px_rgba(0,102,204,0.25)] text-white"
                : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeFilter === "delivery" ? "bg-white/20" : "bg-orange-50"}`}>
              <Package className={`w-3 h-3 ${activeFilter === "delivery" ? "text-white" : "text-orange-500"}`} />
            </div>
            Livraison
          </button>
        </div>

        {/* ─── Notice Banner ─── */}
        <div className="relative bg-gradient-to-r from-blue-50/80 to-white rounded-3xl p-5 mb-6 shadow-sm border border-blue-100/50 flex gap-4 items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex-1 relative z-10">
            <h3 className="font-semibold text-slate-900 text-[14px] leading-snug mb-1.5">
              Achat & Vente : certaines courses sont temporairement manquantes
            </h3>
            <p className="text-[11px] text-[#0066CC] font-medium">Ce problème sera réglé sous peu</p>
          </div>
          <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center text-[#0066CC] shadow-sm border border-slate-100 relative z-10">
            <Wrench className="w-5 h-5" strokeWidth={2} />
          </div>
        </div>

        {/* ─── History List ─── */}
        <div className="space-y-8">
          {Object.keys(groupedRides).length === 0 ? (
             <div className="text-center py-10 text-slate-500 text-sm">
               Aucune course trouvée pour ce filtre.
             </div>
          ) : (
            Object.entries(groupedRides).map(([dateLabel, groupRides], groupIdx) => (
              <div key={groupIdx}>
                <h2 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 pl-2">{dateLabel}</h2>
                
                <div className="space-y-4">
                  {groupRides.map((ride, idx) => {
                    const isVehicle = (ride as any).type === "vehicle"
                    
                    return (
                      <div key={idx} className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,102,204,0.08)] transition-shadow">
                        
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] rounded-2xl flex items-center justify-center border border-white shadow-inner">
                            {isVehicle ? (
                              <Car className="w-6 h-6 text-[#0066CC]" />
                            ) : (
                              <Package className="w-6 h-6 text-orange-500" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-slate-900 text-[15px] truncate mr-2">
                                {(ride as any).name}, {(ride as any).time}
                              </h3>
                              <span className="font-black text-[#0066CC] whitespace-nowrap bg-blue-50/50 px-2 py-0.5 rounded-lg text-sm">
                                {(ride as any).price}
                              </span>
                            </div>
                            <p className="text-[12px] text-slate-500 truncate font-medium">
                              {(ride as any).address}
                            </p>
                          </div>
                        </div>

                        {/* Premium Aide Button */}
                        {idx === 0 && groupIdx === 0 && (
                          <Link href="/client/support" className="flex flex-col items-center justify-center bg-[#F0F7FF] border border-[#E6F0FF] rounded-2xl py-3 hover:bg-[#E6F0FF] transition-colors mt-2">
                            <Headphones className="w-5 h-5 text-[#0066CC] mb-1" />
                            <span className="text-[11px] font-bold text-[#0066CC]">Besoin d'aide ?</span>
                          </Link>
                        )}

                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}
