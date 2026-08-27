"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, Bell, Map, Moon } from "lucide-react"

export default function Settings() {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">Settings</h1>
      </header>
      <main className="px-4 py-2 flex-1 space-y-6">
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><Bell className="w-5 h-5 text-slate-700" /></div>
              <div><h3 className="font-bold text-slate-900 text-sm">Notifications Push</h3><p className="text-xs text-slate-500">Promos et courses</p></div>
            </div>
            <div className="w-11 h-6 bg-[#0066CC] rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><Map className="w-5 h-5 text-slate-700" /></div>
              <div><h3 className="font-bold text-slate-900 text-sm">Localisation</h3><p className="text-xs text-slate-500">Pendant l'utilisation</p></div>
            </div>
            <div className="w-11 h-6 bg-[#0066CC] rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div>
          </div>
          <div className="p-4 flex items-center justify-between opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><Moon className="w-5 h-5 text-slate-700" /></div>
              <div><h3 className="font-bold text-slate-900 text-sm">Mode Sombre</h3><p className="text-xs text-slate-500">Coming soon</p></div>
            </div>
            <div className="w-11 h-6 bg-slate-200 rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div></div>
          </div>
        </div>
      </main>
    </div>
  )
}
