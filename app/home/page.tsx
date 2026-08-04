import Link from "next/link"
import { SenebaLogo } from "@/components/seneba-logo"
import { Car, Utensils, Package, ArrowRight, MapPin, Building2, ShoppingBag } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA] overflow-hidden relative">
      
      {/* ─── Header Background (Seneba Blue) ─── */}
      <div 
        className="absolute top-0 left-0 right-0 h-[40vh] z-0"
        style={{ background: "linear-gradient(180deg, #0066CC 0%, #0052A3 100%)" }}
      >
        <div className="pt-14 px-6 text-center">
          <h1 className="text-white font-medium text-lg leading-snug">
            Nourriture, livraison, courses<br/>et bien plus
          </h1>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 flex flex-col px-4 pt-32 pb-8 h-full flex-1">
        
        {/* Super-App Card */}
        <div className="bg-white rounded-[24px] shadow-lg p-6 mb-4">
          <div className="flex justify-center mb-6">
            <SenebaLogo className="h-8" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Restaurants */}
            <Link href="/client/auth/login" className="bg-[#F8F9FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-1">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">Restaurants</span>
            </Link>

            {/* Delivery */}
            <Link href="/client/auth/login" className="bg-[#F8F9FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-1">
                <Package className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">Livraison</span>
            </Link>

            {/* Rides (Takes 2 columns like Yango) */}
            <Link href="/client/auth/login" className="col-span-2 bg-[#F8F9FA] rounded-[20px] p-4 flex items-center justify-between hover:bg-slate-100 transition-colors relative overflow-hidden group">
              <div className="relative z-10">
                <span className="block font-bold text-lg text-slate-800 mb-1">Courses</span>
                <span className="text-xs font-medium text-slate-500">à partir de 5 min</span>
              </div>
              <div className="relative z-10 w-24 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0066CC] group-hover:scale-105 transition-transform">
                <Car className="w-10 h-10" />
              </div>
            </Link>
          </div>
        </div>

        {/* Where to / Quick Destinations */}
        <div className="bg-white rounded-[24px] shadow-lg p-5">
          {/* Search Input */}
          <Link href="/client/auth/login" className="flex items-center gap-3 bg-[#F4F8FA] rounded-2xl h-14 px-4 mb-4 hover:bg-slate-100 transition-colors">
            <div className="w-6 h-6 flex items-center justify-center">
              <Car className="w-5 h-5 text-slate-700" />
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
                <span className="font-medium text-slate-700">Domicile</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">12 min</span>
            </Link>

            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-100 hover:bg-slate-50 rounded-xl px-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-700">Bureau</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">44 min</span>
            </Link>

            <Link href="/client/auth/login" className="flex items-center justify-between py-3 hover:bg-slate-50 rounded-xl px-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-700">Centre commercial</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">18 min</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
