"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Camera, Image as ImageIcon, UserCircle2 } from "lucide-react"
import { useState } from "react"

export default function PhotoProfilePage() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleFakeUpload = () => {
    // Simulate an upload then go back
    alert("Photo mise à jour avec succès ! (Simulation)")
    router.back()
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F4F8FA]">
      <header className="flex items-center gap-3 px-4 py-4 safe-area-top sticky top-0 z-20 bg-[#F4F8FA]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft className="h-6 w-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 leading-none">
          Photo de profil
        </h1>
      </header>

      <main className="px-4 py-6 flex-1 flex flex-col items-center">
        <p className="text-slate-500 text-sm text-center mb-10 px-4 font-medium">
          Ajoutez une photo claire de votre visage pour que les conducteurs puissent vous reconnaître facilement.
        </p>

        <div className="relative mb-12">
          <div className="w-40 h-40 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-4 border-white flex items-center justify-center overflow-hidden">
            {selectedImage ? (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-[#0066CC]">M</span>
              </div>
            ) : (
              <UserCircle2 className="w-24 h-24 text-slate-300" strokeWidth={1} />
            )}
          </div>
          <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#0066CC] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F4F8FA] hover:scale-110 transition-transform active:scale-95">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="w-full space-y-4 max-w-sm mt-auto">
          <button 
            onClick={handleFakeUpload}
            className="w-full bg-white text-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-[#0066CC]/30 hover:shadow-[0_4px_20px_rgb(0,102,204,0.1)] transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#0066CC]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-[15px]">Prendre une photo</h3>
              <p className="text-xs text-slate-500">Utiliser l'appareil photo</p>
            </div>
          </button>

          <button 
            onClick={handleFakeUpload}
            className="w-full bg-white text-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-[#0066CC]/30 hover:shadow-[0_4px_20px_rgb(0,102,204,0.1)] transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#0066CC]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-[15px]">Choisir dans la galerie</h3>
              <p className="text-xs text-slate-500">Parcourir vos photos</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  )
}

