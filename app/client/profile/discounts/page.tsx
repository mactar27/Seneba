"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, Ticket } from "lucide-react"

export default function Discounts() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Réductions</h1>
      </header>
      <main className="px-4 py-4 flex-1">
        <div className="bg-white rounded-[24px] p-2 flex gap-2 shadow-sm border border-slate-100">
          <input type="text" placeholder="Entrez le code promo" className="flex-1 bg-transparent px-4 font-bold text-slate-900 outline-none uppercase" />
          <button onClick={() => alert('Code invalide')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0066CC] transition-colors">Appliquer</button>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Ticket className="w-8 h-8 text-slate-300" /></div>
          <h3 className="font-bold text-slate-900 mb-1">Aucune réduction active</h3>
          <p className="text-xs text-slate-500">Vos prochains codes promos apparaîtront ici.</p>
        </div>
      </main>
    </div>
  )
}
