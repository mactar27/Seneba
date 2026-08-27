"use client"

import { BottomNavClient } from "@/components/client/bottom-nav"
import { ArrowLeft, Phone, Mail, ExternalLink, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA] pb-20 relative">
      {/* ─── Header ─── */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-4 safe-area-top">
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors">
          <Link href="/client/book">
            <ArrowLeft className="h-6 w-6 text-slate-800" />
          </Link>
        </button>
        <h1 className="text-xl font-bold text-slate-800">Aide et support</h1>
      </header>

      {/* ─── Hero Section with Agent & Monuments ─── */}
      <div className="relative pt-24 pb-8 px-5 bg-gradient-to-b from-[#E6F0FF] to-[#F4F8FA] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/support_hero.png" 
            alt="Support Seneba" 
            className="w-full h-full object-cover object-right-bottom opacity-90"
          />
        </div>
        
        {/* We would place the agent image here. Using a placeholder or CSS for now to match structure. */}
        <div className="relative z-10 max-w-[200px]">
          <h2 className="text-[28px] font-extrabold text-[#0B1A2D] leading-[1.1] mb-3">
            Comment pouvons-nous vous aider ?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Notre équipe est là pour vous accompagner 24h/24 et 7j/7.
          </p>
        </div>

      </div>

      <main className="flex-1 px-5 space-y-4 relative z-10 -mt-2">
        {/* ─── Contact Cards ─── */}
        
        {/* Appelez-nous */}
        <a href="tel:+221775034404" className="block">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-[#E6F0FF] flex items-center justify-center flex-shrink-0">
              <Phone className="h-6 w-6 text-[#0066CC] fill-[#0066CC]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-[15px]">Appelez-nous</h3>
              <p className="text-[13px] text-slate-500 mb-1 leading-tight">Contact our team<br/>by phone</p>
              <p className="text-[14px] font-semibold text-[#0066CC]">+221 77 503 44 04</p>
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch justify-center">
              <ExternalLink className="h-[18px] w-[18px] text-[#0066CC]" />
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </a>

        {/* WhatsApp */}
        <a href="https://wa.me/221775034404" target="_blank" rel="noopener noreferrer" className="block">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-[#E6F0FF] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-7 w-7 text-[#0066CC]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-[15px]">WhatsApp</h3>
              <p className="text-[13px] text-slate-500 leading-tight">Discutez avec un agent<br/>Fast response</p>
              <div className="mt-2 inline-block px-3 py-1 bg-[#E6F0FF] text-[#0066CC] text-[11px] font-semibold rounded-md">
                Réponse en quelques minutes
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch justify-center">
              <ExternalLink className="h-[18px] w-[18px] text-[#0066CC]" />
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </a>

        {/* Email */}
        <a href="mailto:boubsy27@gmail.com" className="block">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-[#E6F0FF] flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-[#0066CC]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-[15px]">Envoyez un email</h3>
              <p className="text-[13px] text-slate-500 mb-1 leading-tight">Write us by email<br/>We will reply quickly</p>
              <p className="text-[14px] font-semibold text-[#0066CC]">boubsy27@gmail.com</p>
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch justify-center">
              <ExternalLink className="h-[18px] w-[18px] text-[#0066CC]" />
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </a>

        {/* ─── Bottom Satisfaction Banner ─── */}
        <div className="mt-6 relative bg-gradient-to-r from-[#E6F0FF] to-[#F0F7FF] rounded-2xl p-4 flex items-center overflow-hidden border border-blue-50">
          <div className="flex-1 relative z-10 pr-[100px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-[#0066CC] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Your satisfaction is our priority</h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Nous sommes disponibles 24h/24 et 7j/7 pour vous offrir la meilleure expérience.
            </p>
          </div>
          <img 
            src="/images/real_vehicle.png" 
            alt="Vehicle Seneba" 
            className="absolute right-[-20px] bottom-[-10px] w-[140px] object-contain pointer-events-none"
            style={{ mixBlendMode: "multiply", filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.15))" }}
          />
        </div>
      </main>

      <BottomNavClient active="support" />
    </div>
  )
}
