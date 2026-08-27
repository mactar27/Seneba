"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, Star, ThumbsUp, MapPin } from "lucide-react"

export default function Stats() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Mes Statistiques</h1>
      </header>
      <main className="px-4 py-4 flex-1 space-y-4">
        <div className="bg-gradient-to-br from-[#0066CC] to-blue-800 rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
          <Star className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white/10" />
          <p className="text-blue-100 font-medium mb-1">Votre note moyenne</p>
          <div className="flex items-end gap-2"><h2 className="text-5xl font-black">4.9</h2><span className="text-xl mb-1 text-yellow-400">★</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-2"><ThumbsUp className="w-5 h-5 text-emerald-500" /></div>
            <h3 className="text-2xl font-bold text-slate-900">98%</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Completed rides</p>
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2"><MapPin className="w-5 h-5 text-[#0066CC]" /></div>
            <h3 className="text-2xl font-bold text-slate-900">42</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Trips taken</p>
          </div>
        </div>
      </main>
    </div>
  )
}
