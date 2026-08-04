"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/actions/auth"

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const startTime = Date.now()
      let session = null
      
      try {
        session = await getSession()
      } catch (err) {
        console.error("Erreur lors de la récupération de la session :", err)
      }

      const elapsedTime = Date.now() - startTime
      // Durée minimale du Splash Screen : 1,5 seconde (1500ms)
      const delay = Math.max(0, 1500 - elapsedTime)

      setTimeout(() => {
        if (session?.user) {
          if (session.user.role === "client") {
            router.push("/client/book")
          } else if (session.user.role === "driver") {
            router.push("/dashboard")
          } else {
            router.push("/home")
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
