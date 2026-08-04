"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, Briefcase } from "lucide-react"

export default function Page() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Compte Entreprise</h1>
      </header>
      <main className="px-4 py-6 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-white rounded-[24px] shadow-sm flex items-center justify-center mb-6 border border-slate-100">
          <Briefcase className="w-10 h-10 text-[#0066CC]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Compte Entreprise</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm whitespace-pre-line">Séparez vos courses professionnelles et personnelles.</p>
        <button onClick={() => { alert('Action réussie ! (Simulation)'); router.back() }} className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-[#0066CC] transition-colors">
          Créer un profil pro
        </button>
      </main>
    </div>
  )
}
