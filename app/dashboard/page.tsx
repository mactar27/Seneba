"use client"

import { 
  getDriverProfile, 
  updateDriverAvailability, 
  getActiveRide, 
  getTodayEarnings, 
  acceptRide as acceptRideAction, 
  updateRideStatus as updateRideStatusAction,
  getPendingRides,
  updateDriverLocation,
  seedDemoData
} from "@/lib/actions/driver"
import { createNotification } from "@/lib/actions/notifications"
import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Driver, Ride } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatusToggle } from "@/components/dashboard/status-toggle"
import { EarningsCard } from "@/components/dashboard/earnings-card"
import { RideRequestCard } from "@/components/dashboard/ride-request-card"
import { ActiveRideCard } from "@/components/dashboard/active-ride-card"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import dynamic from "next/dynamic"
import { usePushNotifications } from "@/hooks/use-push-notifications"

const MapView = dynamic(
  () => import("@/components/dashboard/map-view").then(m => m.MapView),
  { ssr: false, loading: () => <div className="h-[220px] w-full rounded-xl bg-muted animate-pulse" /> }
)

const POLL_INTERVAL_MS = 5000 // 5 seconds - unified polling

export default function DashboardPage() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [activeRide, setActiveRide] = useState<Ride | null>(null)
  const [pendingRide, setPendingRide] = useState<Ride | null>(null)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [driverLat, setDriverLat] = useState<number | null>(null)
  const [driverLng, setDriverLng] = useState<number | null>(null)
  const router = useRouter()
  const { notify } = usePushNotifications()
  const notifyRef = useRef(notify)

  // Use refs to access latest state inside intervals without stale closures
  const driverRef = useRef<Driver | null>(null)
  const activeRideRef = useRef<Ride | null>(null)
  const pendingRideRef = useRef<Ride | null>(null)
  const seenRideIds = useRef<Set<string>>(new Set())

  useEffect(() => { notifyRef.current = notify }, [notify])

  useEffect(() => { driverRef.current = driver }, [driver])
  useEffect(() => { activeRideRef.current = activeRide }, [activeRide])
  useEffect(() => { pendingRideRef.current = pendingRide }, [pendingRide])

  /** Refresh all data in one shot */
  const refreshAll = useCallback(async (forceDriver = false) => {
    const currentDriver = driverRef.current

    // Always refresh driver stats (rides count + rating come from DB aggregation)
    if (forceDriver || currentDriver) {
      const driverData = await getDriverProfile()
      if (!driverData) {
        router.push("/auth/login")
        return
      }
      setDriver(prev => ({
        ...driverData,
        // keep local is_available state so toggle doesn't flicker
        is_available: prev ? prev.is_available : driverData.is_available
      }))
      driverRef.current = driverData

      const [activeRideData, earnings] = await Promise.all([
        getActiveRide(driverData.id),
        getTodayEarnings(driverData.id)
      ])

      setActiveRide(activeRideData || null)
      setTodayEarnings(Number(earnings) || 0)
    }
  }, [router])

  /** Initial load + GPS watch */
  useEffect(() => {
    const init = async () => {
      await refreshAll(true)
      setIsLoading(false)
    }
    init()

    // Watch driver GPS position
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setDriverLat(lat)
          setDriverLng(lng)

          // Sync with database if the driver is online
          const currentDriver = driverRef.current
          if (currentDriver?.is_available) {
            updateDriverLocation(lat, lng).catch(console.error)
          }
        },
        () => {
          // fallback to Banjul city center if permission denied
          setDriverLat(14.6928)
          setDriverLng(-17.4467)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      setDriverLat(14.6928)
      setDriverLng(-17.4467)
    }
  }, [refreshAll])

  /** Unified polling: ride requests + live stats */
  useEffect(() => {
    const poll = async () => {
      const currentDriver = driverRef.current
      if (!currentDriver) return

      // --- Poll for ride stats refresh every tick ---
      const [earnings, updatedActiveRide] = await Promise.all([
        getTodayEarnings(currentDriver.id),
        activeRideRef.current ? getActiveRide(currentDriver.id) : Promise.resolve(null)
      ])
      setTodayEarnings(Number(earnings) || 0)
      if (updatedActiveRide) setActiveRide(updatedActiveRide)

      // --- Poll for new ride requests only if driver is online and idle ---
      if (currentDriver.is_available && !activeRideRef.current && !pendingRideRef.current) {
        const newRide = await getPendingRides()
        if (newRide && !seenRideIds.current.has(newRide.id)) {
          seenRideIds.current.add(newRide.id)
          setPendingRide(newRide)
          // Real push notification for new ride
          notifyRef.current(
            "🚗 Nouvelle course !",
            `${newRide.pickup_address} → ${newRide.destination_address}`,
            "/dashboard"
          )
          // Also save in DB notifications
          await createNotification(
            currentDriver.id,
            "ride_request",
            "Nouvelle course !",
            `Course de ${newRide.pickup_address} vers ${newRide.destination_address}.`
          )
        }
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, []) // empty deps — uses refs to avoid stale closures

  const toggleAvailability = async () => {
    if (!driver) return
    const newStatus = !driver.is_available
    const result = await updateDriverAvailability(newStatus)
    if (result.success) {
      setDriver(prev => prev ? { ...prev, is_available: newStatus } : null)
      if (newStatus) {
        // Real push notification + DB notification
        notifyRef.current("✅ Vous êtes en ligne", "Vous pouvez maintenant recevoir des courses.", "/dashboard")
        await createNotification(driver.id, "system", "Vous êtes en ligne", "Vous pouvez maintenant recevoir des courses.")
      }
    } else {
      alert("Erreur: " + (result.error || "Impossible de changer le statut"))
    }
  }

  const handleSeedData = async () => {
    setIsLoading(true)
    const result = await seedDemoData()
    if (result.success) {
      window.location.reload()
    } else {
      alert("Erreur lors de la génération des données")
      setIsLoading(false)
    }
  }

  const acceptRide = async (ride: Ride) => {
    if (!driver) return
    const result = await acceptRideAction(ride.id, driver.id)
    if (result.success) {
      const accepted = { ...ride, status: "accepted" as Ride["status"], driver_id: driver.id }
      setActiveRide(accepted)
      setPendingRide(null)
    }
  }

  const declineRide = async () => {
    if (!driver || !pendingRide) return
    await createNotification(driver.id, "ride_cancelled", "Course refusée", `Vous avez refusé la course depuis ${pendingRide.pickup_address}.`)
    setPendingRide(null)
  }

  const updateRideStatus = async (newStatus: Ride["status"]) => {
    if (!activeRide || !driver) return
    const result = await updateRideStatusAction(activeRide.id, newStatus, driver.id, activeRide.total_fare)
    if (result.success) {
      if (newStatus === "completed") {
        setActiveRide(null)
        // Refresh all stats after completion
        const [newEarnings, updatedDriver] = await Promise.all([
          getTodayEarnings(driver.id),
          getDriverProfile()
        ])
        setTodayEarnings(Number(newEarnings) || 0)
        if (updatedDriver) setDriver(prev => prev ? { ...updatedDriver, is_available: prev.is_available } : null)
      } else {
        const updatedRide = await getActiveRide(driver.id)
        if (updatedRide) setActiveRide(updatedRide)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!driver) return null

  return (
    <div className="flex min-h-svh flex-col bg-background pb-20 safe-area-top safe-area-bottom">
      <DashboardHeader driver={driver} />

      <main className="flex-1 px-4 py-4 space-y-4">
        <StatusToggle isOnline={driver.is_available} onToggle={toggleAvailability} />

        {/* Live Map */}
        <MapView
          driverLat={driverLat}
          driverLng={driverLng}
          activeRide={activeRide}
          className=""
        />

        {pendingRide && !activeRide && (
          <RideRequestCard ride={pendingRide} onAccept={() => acceptRide(pendingRide)} onDecline={declineRide} />
        )}

        {activeRide && <ActiveRideCard ride={activeRide} onStatusUpdate={updateRideStatus} />}

        <EarningsCard amount={todayEarnings} />

        <QuickStats totalRides={driver.total_rides} rating={driver.average_rating} />

        <Button 
          variant="outline" 
          className="w-full border-dashed gap-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={handleSeedData}
        >
          <Database className="h-4 w-4" />
          Générer des données de test
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
