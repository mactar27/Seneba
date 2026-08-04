"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, User, Mail, Phone, MapPin } from "lucide-react"

export default function EditProfile() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Modifier le profil</h1>
      </header>
      <main className="px-4 py-6 flex-1 flex flex-col">
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom complet</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" defaultValue="Mactar" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#0066CC]/20 text-slate-900 font-medium" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" defaultValue="mactar@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#0066CC]/20 text-slate-900 font-medium" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="tel" defaultValue="773519128" disabled className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-100 text-slate-500 border-none outline-none font-medium" />
            </div>
            <p className="text-[10px] text-slate-400 ml-1">Le numéro de téléphone ne peut être modifié.</p>
          </div>
        </div>
        <div className="mt-auto pt-6">
          <button onClick={() => { alert('Profil mis à jour ! (Simulation)'); router.back() }} className="w-full bg-[#0066CC] text-white py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(0,102,204,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
            Enregistrer les modifications
          </button>
        </div>
      </main>
    </div>
  )
}
