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
      // Durée minimale du Splash Screen : 0.8 seconde
      const delay = Math.max(0, 800 - elapsedTime)

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
    <div className="flex min-h-svh flex-col items-center justify-center bg-background">
      <img src="/images/seneba.png" alt="SENEBA" className="h-24 animate-pulse" />
    </div>
  )
}
