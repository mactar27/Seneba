"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, CreditCard, Banknote } from "lucide-react"

export default function Payments() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Modes de paiement</h1>
      </header>
      <main className="px-4 py-4 flex-1 space-y-6">
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center"><Banknote className="w-5 h-5 text-emerald-600" /></div>
              <h3 className="font-bold text-slate-900">Espèces (Cash)</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-4 border-[#0066CC] bg-white"></div>
          </div>
        </div>
        <button className="w-full bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
          <Plus className="w-5 h-5" /> Ajouter une carte bancaire
        </button>
        <p className="text-[10px] text-center text-slate-400">Vos paiements sont sécurisés et cryptés de bout en bout.</p>
      </main>
    </div>
  )
}
