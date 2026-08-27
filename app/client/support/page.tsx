"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, MessageCircle, List, Folder } from "lucide-react"
import Link from "next/link"
import { Car, Package } from "lucide-react"

export default function ClientSupportPage() {
  const router = useRouter()

  // Fausses données pour correspondre à la capture d'écran de l'utilisateur
  const recentRides = [
    { id: 1, type: "vehicle", name: "Vehicle Éco", date: "28 juil. à 15:54", price: "1600F", address: "Sénégal, 55, Rue P, Dakar, Eglise..." },
    { id: 2, type: "delivery", name: "Livraison", date: "24 juil. à 17:02", price: "", address: "Cite Avion → Rue OKM-99, 338" },
    { id: 3, type: "vehicle", name: "Vehicle Éco", date: "19 juil. à 03:04", price: "1100F", address: "Route de l'Aeroport Yum-Yum O..." },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA] pb-10">
      {/* ─── Header ─── */}
      <header className="flex flex-col px-4 pt-4 pb-2 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 mb-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight pr-4">
          Sur quel sujet avez-vous besoin d'aide ?
        </h1>
      </header>

      <main className="px-4 mt-6">
        
        {/* ─── Section: Courses et commandes ─── */}
        <h2 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 pl-2">Courses et commandes</h2>
        
        <div className="space-y-4 mb-8">
          {recentRides.map((ride, idx) => {
            const isVehicle = ride.type === "vehicle"
            
            return (
              <button key={idx} className="w-full bg-white rounded-[24px] p-4 flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,102,204,0.08)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all text-left border border-slate-100/50 group">
                <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] rounded-2xl flex items-center justify-center border border-white shadow-inner">
                  {isVehicle ? (
                    <Car className="w-6 h-6 text-[#0066CC]" />
                  ) : (
                    <Package className="w-6 h-6 text-orange-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-[15px] truncate">
                    {ride.name} {ride.date}
                  </h3>
                  <p className="text-[12px] text-slate-500 truncate font-medium">
                    {ride.price ? <span className="text-[#0066CC] font-bold">{ride.price}</span> : ""}{ride.price ? " · " : ""}{ride.address}
                  </p>
                </div>
                
                <div className="w-10 h-10 flex-shrink-0 bg-[#F0F7FF] rounded-full flex items-center justify-center shadow-sm border border-[#E6F0FF] group-hover:bg-[#0066CC] group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#0066CC] group-hover:text-white" />
                </div>
              </button>
            )
          })}
          
          <Link href="/client/history" className="w-full bg-white rounded-[24px] p-4 flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,102,204,0.08)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all text-left border border-slate-100/50 group">
            <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <List className="w-5 h-5 text-slate-700 group-hover:text-[#0066CC]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-[15px]">
                Toutes les courses et commandes
              </h3>
            </div>
            <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] rotate-180 transition-colors" />
          </Link>
        </div>

        {/* ─── Section: Autres ─── */}
        <h2 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 pl-2">Autres</h2>
        
        <button 
          onClick={() => alert("La messagerie sera bientôt disponible !")}
          className="w-full bg-white rounded-[24px] p-4 flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,102,204,0.08)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all text-left border border-slate-100/50 group"
        >
          <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <Folder className="w-5 h-5 text-slate-700 group-hover:text-[#0066CC]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-[15px]">
              Toutes les conversations
            </h3>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] rotate-180 transition-colors" />
        </button>

      </main>
    </div>
  )
}

