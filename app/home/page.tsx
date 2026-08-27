import Link from "next/link"
import { SenebaLogo } from "@/components/seneba-logo"
import { Car, ArrowRight, MapPin, Building2, ShoppingBag, Bell, ShieldCheck, ChevronRight, Home, Clock, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F7F9FC] overflow-x-hidden pb-20 relative">
      
      {/* ─── Header Background (Seneba Blue Gradient) ─── */}
      <div 
        className="absolute top-0 left-0 right-0 h-[48vh] z-0 flex flex-col justify-start pt-12 px-6"
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
            Seneba Courses
          </span>
          <h1 className="text-white font-extrabold text-[28px] leading-tight mb-2 tracking-tight text-left">
            Votre chauffeur privé<br/>à Dakar, en un clic
          </h1>
          <p className="text-white/80 text-xs font-semibold leading-relaxed text-left">
            Trajets rapides, sécurisés et confortables à tout moment.
          </p>
        </div>
      </div>

      {/* ─── Main Scrollable Area ─── */}
      <div className="relative z-10 flex flex-col px-4 pt-[240px] gap-4">
        
        {/* ── Featured Card — reconstruit en HTML/CSS pour être net ── */}
        <Link href="/client/auth/login"
          className="w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block border border-slate-100 bg-white"
          style={{ minHeight: 160 }}
        >
          <div className="flex" style={{ minHeight: 160 }}>

            {/* LEFT — fond blanc, texte */}
            <div className="flex flex-col justify-between p-5 gap-3" style={{ flex: '0 0 48%' }}>
              {/* Badge vert */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-[11px] font-extrabold text-green-600 leading-none">Disponible 24h/7</span>
              </div>
              {/* Texte principal */}
              <div>
                <p className="font-black text-slate-900 leading-tight" style={{ fontSize: 18 }}>
                  Commandez<br />votre trajet
                </p>
                <p className="text-slate-400 font-semibold mt-1.5" style={{ fontSize: 10 }}>
                  Standard • Confort • Interurbain
                </p>
              </div>
            </div>

            {/* RIGHT — fond bleu clair + voiture */}
            <div className="relative flex-1 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)' }}
            >
              {/* Illustration Dakar en SVG (Monument de la Renaissance + bâtiments + arbres) */}
              <svg
                viewBox="0 0 220 160"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ciel - nuages */}
                <circle cx="40" cy="22" r="12" fill="#bfdbfe" opacity="0.7"/>
                <circle cx="55" cy="18" r="16" fill="#bfdbfe" opacity="0.6"/>
                <circle cx="70" cy="22" r="11" fill="#bfdbfe" opacity="0.7"/>
                <circle cx="150" cy="18" r="10" fill="#bfdbfe" opacity="0.5"/>
                <circle cx="163" cy="14" r="13" fill="#bfdbfe" opacity="0.6"/>
                <circle cx="176" cy="19" r="9" fill="#bfdbfe" opacity="0.5"/>
                {/* Oiseaux */}
                <path d="M30 10 Q32 7 34 10" stroke="#93c5fd" strokeWidth="1.2" fill="none"/>
                <path d="M37 8 Q39 5 41 8" stroke="#93c5fd" strokeWidth="1.2" fill="none"/>
                <path d="M190 12 Q192 9 194 12" stroke="#93c5fd" strokeWidth="1.2" fill="none"/>
                {/* Monument de la Renaissance africaine (centre) */}
                {/* Socle */}
                <rect x="100" y="85" width="20" height="75" rx="1" fill="#60a5fa" opacity="0.5"/>
                {/* Colonne */}
                <rect x="106" y="40" width="8" height="50" rx="2" fill="#3b82f6" opacity="0.6"/>
                {/* Flèche */}
                <polygon points="106,40 110,28 114,40" fill="#2563eb" opacity="0.7"/>
                {/* Figure homme (bras levé) */}
                <circle cx="110" cy="26" r="3" fill="#1d4ed8" opacity="0.8"/>
                <rect cx="108" cy="29" width="5" height="8" rx="1" fill="#1d4ed8" opacity="0.7"/>
                <line x1="108" y1="31" x2="103" y2="26" stroke="#1d4ed8" strokeWidth="1.5" opacity="0.8"/>
                <line x1="112" y1="31" x2="116" y2="28" stroke="#1d4ed8" strokeWidth="1.5" opacity="0.8"/>
                {/* Bâtiments gauche */}
                <rect x="10" y="70" width="14" height="90" rx="2" fill="#93c5fd" opacity="0.5"/>
                <rect x="26" y="80" width="10" height="80" rx="2" fill="#bfdbfe" opacity="0.5"/>
                <rect x="38" y="60" width="16" height="100" rx="2" fill="#60a5fa" opacity="0.4"/>
                <rect x="56" y="75" width="12" height="85" rx="1" fill="#93c5fd" opacity="0.45"/>
                <rect x="70" y="65" width="14" height="95" rx="2" fill="#60a5fa" opacity="0.35"/>
                {/* Fenêtres gauche */}
                <rect x="14" y="78" width="3" height="4" rx="0.5" fill="#1d4ed8" opacity="0.3"/>
                <rect x="19" y="78" width="3" height="4" rx="0.5" fill="#1d4ed8" opacity="0.3"/>
                <rect x="14" y="88" width="3" height="4" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                <rect x="42" y="68" width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                <rect x="48" y="68" width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                {/* Bâtiments droite */}
                <rect x="132" y="65" width="16" height="95" rx="2" fill="#93c5fd" opacity="0.5"/>
                <rect x="150" y="72" width="12" height="88" rx="2" fill="#bfdbfe" opacity="0.5"/>
                <rect x="164" y="58" width="18" height="102" rx="2" fill="#60a5fa" opacity="0.4"/>
                <rect x="184" y="68" width="14" height="92" rx="2" fill="#93c5fd" opacity="0.45"/>
                <rect x="200" y="75" width="20" height="85" rx="1" fill="#60a5fa" opacity="0.35"/>
                {/* Fenêtres droite */}
                <rect x="136" y="73" width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                <rect x="142" y="73" width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                <rect x="168" y="66" width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                <rect x="174" y="66" width="4" height="5" rx="0.5" fill="#1d4ed8" opacity="0.25"/>
                {/* Arbres */}
                <ellipse cx="87" cy="100" rx="10" ry="13" fill="#60a5fa" opacity="0.45"/>
                <rect x="85" y="108" width="4" height="12" fill="#3b82f6" opacity="0.4"/>
                <ellipse cx="127" cy="98" rx="11" ry="14" fill="#60a5fa" opacity="0.45"/>
                <rect x="125" y="106" width="4" height="14" fill="#3b82f6" opacity="0.4"/>
                {/* Ligne sol / mer */}
                <rect x="0" y="120" width="220" height="40" fill="#bfdbfe" opacity="0.35"/>
              </svg>

              {/* Image voiture (découpée depuis la maquette) */}
              <img
                src="/images/seneba_car.png"
                alt="Sénéba car"
                className="absolute bottom-0 right-0 h-auto object-contain"
                style={{ width: '105%', maxWidth: 'none', right: '-2%', bottom: '-8%' }}
              />
            </div>
          </div>
        </Link>

        {/* Where to / Search Destination Box */}
        <Link href="/client/auth/login" className="flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-100/50">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-[#0066CC] rounded-2xl flex-shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <span className="font-extrabold text-base text-slate-800 leading-tight">Où allez-vous ?</span>
            <span className="text-xs font-semibold text-slate-400">Entrez votre destination</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#0066CC] mr-1" />
        </Link>

        {/* Quick Access Section */}
        <div className="flex flex-col bg-white rounded-3xl p-4 shadow-sm border border-slate-100/50">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-black text-slate-800">Accès rapides</span>
            <button className="text-xs font-extrabold text-[#0066CC] hover:underline">Voir tout</button>
          </div>

          <div className="flex flex-col">
            {/* Domicile */}
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-50 hover:bg-slate-50/50 rounded-xl px-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-extrabold text-sm text-slate-700 leading-tight">Domicile</span>
                  <span className="text-[10px] font-semibold text-slate-400">Votre adresse enregistrée</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-50 text-[#0066CC] text-[10px] font-black px-2.5 py-1 rounded-lg">12 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>

            {/* Bureau */}
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 border-b border-slate-50 hover:bg-slate-50/50 rounded-xl px-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-extrabold text-sm text-slate-700 leading-tight">Bureau</span>
                  <span className="text-[10px] font-semibold text-slate-400">Votre lieu de travail</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-50 text-[#0066CC] text-[10px] font-black px-2.5 py-1 rounded-lg">44 min</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>

            {/* Centre commercial */}
            <Link href="/client/auth/login" className="flex items-center justify-between py-3 hover:bg-slate-50/50 rounded-xl px-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-extrabold text-sm text-slate-700 leading-tight">Centre commercial</span>
                  <span className="text-[10px] font-semibold text-slate-400">Les Almadies</span>
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
              <span className="font-extrabold text-xs text-slate-700 leading-tight">Sécurité avant tout</span>
              <span className="text-[10px] font-semibold text-slate-400">Chauffeurs vérifiés • Trajets suivis en temps réel</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>
      </div>

      {/* ─── Bottom Navigation Bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 safe-area-bottom h-16 shadow-lg">
        <div className="flex items-center justify-around h-full px-2">
          {/* Tab 1: Réserver */}
          <Link href="/client/auth/login" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[#0066CC]">
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-bold">Réserver</span>
          </Link>

          {/* Tab 2: Historique */}
          <Link href="/client/auth/login" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium">Historique</span>
          </Link>

          {/* Tab 3: Profil */}
          <Link href="/client/auth/login" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 hover:text-slate-600">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>

    </div>
  )
}
