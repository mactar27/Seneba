"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession, restoreSessionFromStorage } from "@/lib/actions/auth"

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const startTime = Date.now()
      let session = null
      
      try {
        session = await getSession()

        // Fallback résilient : si le cookie a été effacé par iOS Safari mais que localStorage contient la session
        if (!session?.user && typeof window !== "undefined") {
          const stored = localStorage.getItem("seneba_session")
          if (stored) {
            try {
              const { userId, phone } = JSON.parse(stored)
              if (userId || phone) {
                const restored = await restoreSessionFromStorage(userId, phone)
                if (restored.success) {
                  session = { user: { id: userId, role: restored.role || "client" } }
                }
              }
            } catch (storageErr) {
              console.error("Erreur lecture storage:", storageErr)
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la session :", err)
      }

      const elapsedTime = Date.now() - startTime
      // Durée minimale du Splash Screen : 1,5 seconde (1500ms) pour voir l'animation du logo
      const delay = Math.max(0, 1500 - elapsedTime)

      setTimeout(() => {
        if (session?.user) {
          if (session.user.role === "driver") {
            router.push("/dashboard")
          } else {
            router.push("/client/book")
          }
        } else {
          router.push("/home")
        }
      }, delay)
    }

    checkSessionAndRedirect()
  }, [router])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-white select-none">
      <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
        <img src="/images/seneba.png" alt="SENEBA" className="h-20 object-contain animate-pulse" />
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-[#0066CC] animate-ping" />
          <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">Seneba Rides</span>
        </div>
      </div>
    </div>
  )
}
