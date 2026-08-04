"use client"

import { getClientProfile } from "@/lib/actions/client"
import { logout } from "@/lib/actions/auth"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Client } from "@/lib/types"
import { BottomNavClient } from "@/components/client/bottom-nav"
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Gift, 
  CreditCard,
  MapPin,
  Briefcase,
  ShieldCheck,
  Info,
  Clock,
  Headphones,
  Settings,
  PieChart
} from "lucide-react"
import Link from "next/link"

export default function ClientProfilePage() {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    const data = await getClientProfile()
    if (!data) {
      router.push("/client/auth/login")
      return
    }
    setClient(data as Client)
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
        </div>
        <BottomNavClient active="profile" />
      </div>
    )
  }

  const initial = client?.full_name ? client.full_name.charAt(0).toUpperCase() : "👤"

  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA] pb-24">
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-800" />
        </button>
        <div className="flex flex-col items-center">
          {/* Dynamique Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#E6F0FF] to-blue-100 rounded-full flex items-center justify-center mb-2 overflow-hidden shadow-sm border-2 border-white">
             <span className="text-3xl font-bold text-[#0066CC]">{initial}</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer group" onClick={() => router.push("/client/profile/edit")}>
            <h1 className="text-lg font-bold text-slate-900 leading-none group-hover:text-[#0066CC] transition-colors">
              {client?.full_name?.split(' ')[0] || "Client"}
            </h1>
            <div className="bg-slate-800 text-white rounded-full p-0.5 group-hover:bg-[#0066CC] transition-colors">
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {client?.phone || "+221 000000000"}
          </p>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </header>

      {/* ─── Quick Actions ─── */}
      <div className="flex justify-between px-6 py-4 mb-2">
        <Link href="/client/history" className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center border border-slate-100 group-hover:border-[#0066CC]/20 group-hover:shadow-[0_4px_15px_rgba(0,102,204,0.1)] transition-all">
            <Clock className="w-5 h-5 text-slate-700 group-hover:text-[#0066CC]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">Historique</span>
        </Link>
        <Link href="/client/support" className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center border border-slate-100 group-hover:border-[#0066CC]/20 group-hover:shadow-[0_4px_15px_rgba(0,102,204,0.1)] transition-all">
            <Headphones className="w-5 h-5 text-slate-700 group-hover:text-[#0066CC]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">Assistance</span>
        </Link>
        <button onClick={() => router.push("/client/profile/addresses")} className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center border border-slate-100 group-hover:border-[#0066CC]/20 group-hover:shadow-[0_4px_15px_rgba(0,102,204,0.1)] transition-all">
            <MapPin className="w-5 h-5 text-slate-700 group-hover:text-[#0066CC]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">Adresses</span>
        </button>
        <button onClick={() => router.push("/client/profile/settings")} className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center border border-slate-100 group-hover:border-[#0066CC]/20 group-hover:shadow-[0_4px_15px_rgba(0,102,204,0.1)] transition-all">
            <Settings className="w-5 h-5 text-slate-700 group-hover:text-[#0066CC]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">Paramètres</span>
        </button>
      </div>

      <main className="flex-1 px-4 space-y-5">
        
        {/* ─── Compléter le profil (Banner) ─── */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden">
          {/* Seneba Premium blue shape */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] z-0" />
          
          <div className="relative z-10 flex justify-between items-end mb-4 pt-1">
            <div>
              <h2 className="text-[#0066CC] font-black text-xl leading-none italic uppercase tracking-tighter">Compléter le profil</h2>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-1.5 w-20 bg-[#0066CC] rounded-full shadow-[0_0_8px_rgba(0,102,204,0.4)]"></div>
                <div className="h-1.5 w-24 bg-white/60 rounded-full border border-blue-100"></div>
              </div>
            </div>
            <button onClick={() => router.push("/client/profile/info")} className="flex items-center text-[10px] text-[#0066CC] font-bold gap-0.5 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm">
              Pourquoi ?
              <div className="bg-[#0066CC] text-white rounded-full p-0.5 ml-0.5">
                <ChevronRight className="w-2.5 h-2.5" />
              </div>
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-4 relative z-10 font-bold tracking-wide">ÉTAPE 1 SUR 2</p>

          <div onClick={() => router.push("/client/profile/photo")} className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-[0_4px_20px_rgba(0,102,204,0.06)] border border-blue-50/50 group cursor-pointer hover:border-blue-100 transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 text-[#0066CC]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-0.5">Ajouter une photo</h3>
              <p className="text-[10px] text-slate-500 leading-tight">Rassurez les conducteurs lors de vos courses</p>
            </div>
          </div>
        </div>

        {/* ─── Menu Group 1 ─── */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/50 overflow-hidden divide-y divide-slate-50/80">
          
          <button onClick={() => router.push("/client/profile/discounts")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Gift className="w-4 h-4 text-slate-700 group-hover:text-[#0066CC]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-[15px]">Réductions</h3>
                <p className="text-[11px] text-slate-400 font-medium">Saisir un code promotionnel</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] transition-colors" />
          </button>

          <button onClick={() => router.push("/client/profile/payments")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <CreditCard className="w-4 h-4 text-slate-700 group-hover:text-[#0066CC]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-[15px]">Modes de paiement</h3>
                <p className="text-[11px] text-slate-400 font-medium">Espèces</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 text-emerald-600 rounded-md px-2 py-0.5 shadow-sm text-[10px] font-black italic border border-emerald-100">
                CASH
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] transition-colors" />
            </div>
          </button>
        </div>

        {/* ─── Premium Driver Button ─── */}
        <button onClick={() => router.push("/onboarding")} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.25)] active:scale-95 transition-all border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-inner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A1A1A">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-wide">Travaillez comme conducteur</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* ─── Menu Group 2 ─── */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/50 overflow-hidden divide-y divide-slate-50/80">
          
          <button onClick={() => router.push("/client/profile/map-feedback")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4 opacity-0">
               <div className="w-8 h-8"></div>
            </div>
            <div className="flex-1 text-left -ml-10">
              <h3 className="font-semibold text-slate-900 text-[15px]">Améliorer les cartes</h3>
              <p className="text-[11px] text-slate-400 font-medium">Ajouter des lieux, corriger des erreurs</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] transition-colors" />
          </button>

          <button onClick={() => router.push("/client/profile/business")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Briefcase className="w-4 h-4 text-slate-700 group-hover:text-[#0066CC]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-[15px]">Compte entreprise</h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] transition-colors" />
          </button>

          <button onClick={() => router.push("/client/profile/security")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <ShieldCheck className="w-4 h-4 text-slate-700 group-hover:text-[#0066CC]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-[15px]">Sécurité</h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066CC] transition-colors" />
          </button>

          <button onClick={() => router.push("/client/profile/stats")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <PieChart className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-[15px]">Top ! Peu d'annulations</h3>
                <p className="text-[11px] text-slate-400 font-medium">Impacte la vitesse de recherche</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>

        {/* ─── Menu Group 3 ─── */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/50 overflow-hidden">
          <button onClick={() => router.push("/client/profile/info")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors text-slate-700">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-[15px]">Informations</h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        </div>
        
        <div className="pt-4 pb-6">
           <button onClick={handleLogout} className="w-full text-center text-red-500 font-bold text-sm hover:text-red-600 bg-red-50 py-3 rounded-2xl transition-colors">
             Se déconnecter
           </button>
        </div>

      </main>

      <BottomNavClient active="profile" />
    </div>
  )
}


