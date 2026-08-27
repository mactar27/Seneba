import Link from "next/link"
import { SenebaLogo } from "@/components/seneba-logo"
import { Car, ArrowRight, MapPin, Building2, ShoppingBag } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA] overflow-hidden relative">
      
      {/* ─── Header Background (Seneba Blue) ─── */}
      <div 
        className="absolute top-0 left-0 right-0 h-[45vh] z-0"
        style={{ background: "linear-gradient(180deg, #0066CC 0%, #0052A3 100%)" }}
      >
        <div className="pt-14 px-6 text-center">
          <div className="flex justify-center mb-4">
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-xs font-bold tracking-wider uppercase">
              Seneba Courses
            </span>
          </div>
          <h1 className="text-white font-black text-2xl leading-tight">
            Votre chauffeur privé<br/>à Dakar en un clic
          </h1>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 flex flex-col px-4 pt-36 pb-8 h-full flex-1">
        
        {/* Real Vehicle Banner Card */}
        <div className="bg-white rounded-[24px] shadow-lg overflow-hidden mb-4 flex flex-col">
          <div className="p-5 flex justify-between items-center border-b border-slate-50">
            <SenebaLogo className="h-7" />
            <span className="text-xs font-extrabold text-[#0066CC] bg-blue-50 px-2.5 py-1 rounded-lg">Disponible 24h/7</span>
          </div>
          <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
            <img 
              src="/images/real_vehicle.png" 
              alt="Seneba Vehicle" 
              className="w-full h-full object-cover opacity-90 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
              <span className="text-white font-black text-lg">Commandez votre trajet</span>
              <span className="text-slate-300 text-xs font-medium">Standard • Confort • Interurbain</span>
            </div>
          </div>
        </div>

        {/* Where to / Quick Destinations */}
        <div className="bg-white rounded-[24px] shadow-lg p-5">
          {/* Search Input */}
          <Link href="/client/auth/login" className="flex items-center gap-3 bg-[#F4F8FA] rounded-2xl h-14 px-4 mb-4 hover:bg-slate-100 transition-colors border border-slate-100/50">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-[#0066CC] rounded-full">
              <Car className="w-4 h-4" />
            </div>
            <span className="flex-1 font-bold text-base text-slate-800">Où allez-vous ?</span>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>

          {/* Saved Destinations */}
          <div className="flex flex-col gap-1">
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-100 hover:bg-slate-50 rounded-xl px-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-slate-700">Domicile</span>
              </div>
              <span className="text-xs font-bold text-slate-400">12 min</span>
            </Link>

            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-100 hover:bg-slate-50 rounded-xl px-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-slate-700">Bureau</span>
              </div>
              <span className="text-xs font-bold text-slate-400">44 min</span>
            </Link>

            <Link href="/client/auth/login" className="flex items-center justify-between py-3 hover:bg-slate-50 rounded-xl px-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-slate-700">Centre commercial</span>
              </div>
              <span className="text-xs font-bold text-slate-400">18 min</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
