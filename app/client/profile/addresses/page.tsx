"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, Home, Briefcase, Plus, MoreVertical } from "lucide-react"

export default function Addresses() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Mes Adresses</h1>
      </header>
      <main className="px-4 py-2 flex-1">
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><Home className="w-5 h-5 text-[#0066CC]" /></div>
              <div><h3 className="font-bold text-slate-900">Domicile</h3><p className="text-xs text-slate-500">Ajouter une adresse</p></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><Briefcase className="w-5 h-5 text-[#0066CC]" /></div>
              <div><h3 className="font-bold text-slate-900">Travail</h3><p className="text-xs text-slate-500">Ajouter une adresse</p></div>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 bg-white border border-[#0066CC]/20 text-[#0066CC] py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
          <Plus className="w-5 h-5" /> Ajouter un autre lieu
        </button>
      </main>
    </div>
  )
}
