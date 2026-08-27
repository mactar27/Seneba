import Link from "next/link"
import { SenebaLogo } from "@/components/seneba-logo"
import { Car, ArrowRight, MapPin, Building2, ShoppingBag, Bell, ShieldCheck, ChevronRight, Home, Clock, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F7F9FC] overflow-x-hidden pb-20 relative">
      
      {/* ─── Header Background (Seneba Blue Gradient) ─── */}
      <div 
        className="absolute top-0 left-0 right-0 h-[56vh] z-0 flex flex-col justify-start pt-12 px-6"
        style={{ background: "linear-gradient(180deg, #0050C8 0%, #0066EE 100%)" }}
      >
        {/* Status Area & Logo Row */}
        <div className="flex items-center justify-between mb-6">
          <SenebaLogo className="h-7 text-white brightness-0 invert" />
          <button className="relative w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0050C8]" />
          </button>
        </div>

        {/* Title Tag, Heading and Subtitle */}
        <div className="flex flex-col items-start">
          <span className="inline-block bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[10px] font-black tracking-wider uppercase mb-3">
            Seneba Rides
          </span>
          <h1 className="text-white font-extrabold text-[28px] leading-tight mb-2 tracking-tight text-left">
            Your private driver<br/>in Dakar, in one click
          </h1>
          <p className="text-white/80 text-xs font-semibold leading-relaxed text-left">
            Fast, secure, and comfortable rides at any time.
          </p>
        </div>
      </div>

      {/* ─── Main Scrollable Area ─── */}
      <div className="relative z-10 flex flex-col px-4 pt-[290px] gap-4">
        
        {/* ── Featured Card — image fidèle à la maquette ── */}
        <Link href="/client/auth/login"
          className="w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block border border-slate-100"
        >
          <img
            src="/images/real_vehicle.png"
            alt="Book your ride — Standard • Comfort • Intercity"
            className="w-full h-auto block"
          />
        </Link>

        {/* Where to / Search Destination Box */}
        <Link href="/client/auth/login" className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-100/50">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-[#0066CC] rounded-2xl flex-shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <span className="font-extrabold text-base text-slate-800 leading-tight">Where to?</span>
            <span className="text-xs font-semibold text-slate-400">Enter your destination</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#0066CC] mr-1" />
        </Link>

        {/* Quick Access Section */}
        <div className="flex flex-col bg-white rounded-3xl p-4 shadow-sm border border-slate-100/50">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-black text-slate-800">Quick access</span>
            <button className="text-xs font-extrabold text-[#0066CC] hover:underline">See all</button>
          </div>

          <div className="flex flex-col">
            {/* Home */}
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-50 hover:bg-slate-50/50 rounded-xl px-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-extrabold text-sm text-slate-700 leading-tight">Home</span>
                  <span className="text-[10px] font-semibold text-slate-400">Your saved address</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-50 text-[#0066CC] text-[10px] font-black px-2.5 py-1 rounded-lg">12 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>

            {/* Office */}
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-50 hover:bg-slate-50/50 rounded-xl px-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-extrabold text-sm text-slate-700 leading-tight">Office</span>
                  <span className="text-[10px] font-semibold text-slate-400">Your workplace</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-50 text-[#0066CC] text-[10px] font-black px-2.5 py-1 rounded-lg">44 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>

            {/* Shopping mall */}
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 hover:bg-slate-50/50 rounded-xl px-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-extrabold text-sm text-slate-700 leading-tight">Shopping mall</span>
                  <span className="text-[10px] font-semibold text-slate-400">Almadies</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-50 text-[#0066CC] text-[10px] font-black px-2.5 py-1 rounded-lg">18 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          </div>
        </div>

        {/* Security Info Card */}
        <Link href="/client/auth/login" className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl p-4 border border-slate-150/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-extrabold text-xs text-slate-700 leading-tight">Safety first</span>
              <span className="text-[10px] font-semibold text-slate-400">Verified drivers • Real-time tracking</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>
      </div>

      {/* ─── Bottom Navigation Bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-area-bottom h-16 shadow-lg">
        <div className="flex items-center justify-around h-full px-2">
          {/* Tab 1: Book */}
          <Link href="/client/auth/login" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[#0066CC]">
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-bold">Book</span>
          </Link>

          {/* Tab 2: History */}
          <Link href="/client/auth/login" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
          </Link>

          {/* Tab 3: Profilee */}
          <Link href="/client/auth/login" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profilee</span>
          </Link>
        </div>
      </nav>

    </div>
  )
}
