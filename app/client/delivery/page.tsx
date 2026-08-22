"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Package, Check, Compass, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DeliveryPage() {
  const router = useRouter()
  const [option, setOption] = useState<"express" | "standard" | "scheduled">("express")

  const handleContinue = () => {
    alert("Option de livraison enregistrée. (Simulation)")
    router.push("/client/book")
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F8FAFC] pb-20">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 safe-area-top sticky top-0 z-25 bg-[#F8FAFC]">
        <button onClick={() => router.push("/client/book")} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-800" />
        </button>
        <h1 className="text-xl font-black text-slate-900 leading-none">
          Livraison
        </h1>
      </header>

      <main className="px-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Main Title & Promo */}
          <div className="mb-6 mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Envoyez<br />vos colis facilement
            </h2>
          </div>

          {/* SVG Illustration Package Target Pin */}
          <div className="w-full h-48 bg-white rounded-3xl border border-slate-100/50 shadow-sm flex items-center justify-center relative overflow-hidden mb-6">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-50/40 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-blue-50/80 rounded-full" />
            
            {/* Package & Target Map Pin illustration */}
            <div className="relative flex flex-col items-center gap-3 z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-[#0066CC] shadow-md border-2 border-white">
                <Package className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-1.5 bg-[#0066CC] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                <span>Colis en transit</span>
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-8">
            {/* Option 1: Express */}
            <button
              onClick={() => setOption("express")}
              className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between text-left shadow-sm border transition-all ${
                option === "express" ? "border-[#0066CC] bg-blue-50/5" : "border-slate-50"
              }`}
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Livraison express</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Rapide et sécurisée</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                option === "express" ? "border-[#0066CC] bg-[#0066CC]" : "border-slate-200"
              }`}>
                {option === "express" && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>

            {/* Option 2: Standard */}
            <button
              onClick={() => setOption("standard")}
              className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between text-left shadow-sm border transition-all ${
                option === "standard" ? "border-[#0066CC] bg-blue-50/5" : "border-slate-50"
              }`}
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Livraison standard</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Économique</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                option === "standard" ? "border-[#0066CC] bg-[#0066CC]" : "border-slate-200"
              }`}>
                {option === "standard" && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>

            {/* Option 3: Programmée */}
            <button
              onClick={() => setOption("scheduled")}
              className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between text-left shadow-sm border transition-all ${
                option === "scheduled" ? "border-[#0066CC] bg-blue-50/5" : "border-slate-50"
              }`}
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Livraison programmée</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Choisissez l'horaire</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                option === "scheduled" ? "border-[#0066CC] bg-[#0066CC]" : "border-slate-200"
              }`}>
                {option === "scheduled" && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleContinue}
          className="w-full h-13 text-sm font-bold rounded-2xl bg-[#0066CC] hover:bg-[#0052A3] text-white flex items-center justify-center"
        >
          Continuer
        </Button>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-area-bottom h-16">
        <div className="flex items-center justify-around h-full px-2">
          <Link href="/client/book" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-medium">Réserver</span>
          </Link>
          <Link href="/client/history" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Historique</span>
          </Link>
          <Link href="/client/profile" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600 transition-all">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
