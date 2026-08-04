"use client"

import { useEffect, useRef } from "react"

/**
 * Demande la permission de notification et enregistre le service worker.
 * Expose une fonction pour déclencher des notifs locales quand l'app est au premier plan.
 */
export function usePushNotifications() {
  const permissionRef = useRef<NotificationPermission>("default")

  useEffect(() => {
    if (typeof window === "undefined") return

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }

    // Request permission on first load
    if ("Notification" in window) {
      permissionRef.current = Notification.permission
      if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
          permissionRef.current = perm
        })
      }
    }
  }, [])

  /**
   * Envoie une notification locale (quand l'app est en premier plan)
   */
  const notify = (title: string, body: string, url?: string) => {
    if (typeof window === "undefined") return
    if (!("Notification" in window)) return
    if (Notification.permission !== "granted") return

    // Use service worker notification for better support
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "seneba-notif",
          vibrate: [200, 100, 200],
          data: url ? { url } : {},
        } as NotificationOptions)
      }).catch(() => {
        // Fallback to basic Notification
        new Notification(title, { body, icon: "/icon-192.png" })
      })
    } else {
      new Notification(title, { body, icon: "/icon-192.png" })
    }
  }

  return { notify }
}
