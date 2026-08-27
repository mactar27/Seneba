"use client"

import { getClientProfilee } from "@/lib/actions/client"
import { logout } from "@/lib/actions/auth"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Client } from "@/lib/types"
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  CreditCard,
  MapPin,
  Heart,
  Settings,
  HelpCircle,
  Info,
  Edit2,
  Car,
  Compass
} from "lucide-react"
import Link from "next/link"

export default function ClientProfileePage() {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfilee = useCallback(async () => {
    const data = await getClientProfilee()
    if (!data) {
      router.push("/client/auth/login")
      return
    }
    setClient(data as Client)
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadProfilee()
  }, [loadProfilee])

  const handleLogout = async () => {
    await logout()
  }

  const handleSoon = (feature: string) => {
    alert(`${feature} sera bientôt disponible !`)
  }

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col bg-[#F8FAFC]">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066CC] border-t-transparent" />
        </div>
      </div>
    )
  }

  const initial = client?.full_name ? client.full_name.charAt(0).toUpperCase() : "👤"

  return (
    <div className="flex min-h-svh flex-col bg-[#F8FAFC] pb-24">
      {/* Header Profilee Info Card */}
      <header className="px-5 pt-8 pb-6 safe-area-top sticky top-0 z-20 bg-[#F8FAFC]">
        <div className="flex items-center justify-between bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img src="/images/mactar-profile.png" alt="Profilee" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                {client?.full_name || "Mamadou Fall"}
              </h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {client?.phone || "+221 77 123 45 67"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleSoon("Edit le profil")}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Menu List */}
      <main className="px-5 flex-1">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-2 space-y-1">
          {/* Item 1: Informations personnelles */}
          <button 
            onClick={() => handleSoon("Informations personnelles")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">Informations personnelles</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Item 2: Payment methods */}
          <button 
            onClick={() => handleSoon("Payment methods")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">Payment methods</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Item 3: Saved addresses */}
          <button 
            onClick={() => handleSoon("Saved addresses")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">Saved addresses</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Item 4: Mes favoris */}
          <button 
            onClick={() => handleSoon("Mes favoris")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Heart className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">Mes favoris</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Item 5: Settings */}
          <button 
            onClick={() => handleSoon("Settings")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Item 6: Aide & support */}
          <button 
            onClick={() => handleSoon("Aide & support")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">Aide & support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Item 7: À propos de Seneba */}
          <button 
            onClick={() => handleSoon("À propos de Seneba")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Info className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-800 text-sm">About Seneba</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-bold h-13 rounded-2xl mt-6 active:scale-95 transition-all text-sm flex items-center justify-center hover:bg-red-100/50"
        >
          Log out
        </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-area-bottom h-16">
        <div className="flex items-center justify-around h-full px-2">
          <Link href="/client/book" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-medium">Book</span>
          </Link>
          <Link href="/client/history" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
          </Link>
          <button className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[#0066CC] transition-all">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
