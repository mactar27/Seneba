"use client"

import { useEffect, useRef, useState } from "react"
import type { Ride } from "@/lib/types"
import { Volume2, VolumeX, Navigation, LocateFixed } from "lucide-react"

interface MapViewProps {
  driverLat?: number | null
  driverLng?: number | null
  activeRide?: Ride | null
  className?: string
}

// French voice instructions from OSRM maneuver type
function buildVoiceInstruction(step: any): string {
  const dist = step.distance < 1000
    ? `${Math.round(step.distance)} mètres`
    : `${(step.distance / 1000).toFixed(1)} kilomètres`
  const maneuver = step.maneuver?.type || ""
  const modifier = step.maneuver?.modifier || ""
  const street = step.name || ""

  const dir: Record<string, string> = {
    "turn left": "Tournez à gauche",
    "turn right": "Tournez à droite",
    "turn slight left": "Légèrement à gauche",
    "turn slight right": "Légèrement à droite",
    "turn sharp left": "Tournez fortement à gauche",
    "turn sharp right": "Tournez fortement à droite",
    "straight": "Continuez tout droit",
    "roundabout": "Prenez le rond-point",
    "arrive": "Vous êtes arrivé à destination",
    "depart": "Démarrez",
  }

  const key = modifier ? `${maneuver} ${modifier}` : maneuver
  const action = dir[key] || dir[maneuver] || "Continuez"
  const on = street ? ` sur ${street}` : ""

  if (maneuver === "arrive") return dir["arrive"]!
  return `Dans ${dist}, ${action}${on}.`
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = "fr-FR"
  utt.rate = 1.0
  utt.pitch = 1.0
  window.speechSynthesis.speak(utt)
}

async function fetchOSRMRoute(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number
): Promise<{ coords: [number, number][], steps: any[] } | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`
    const res = await fetch(url)
    const data = await res.json()
    if (data.code !== "Ok") return null

    const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    )
    const steps: any[] = data.routes[0].legs[0].steps || []
    return { coords, steps }
  } catch {
    return null
  }
}

export function MapView({ driverLat, driverLng, activeRide, className = "" }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const routeLayerRef = useRef<any>(null)
  const stepsRef = useRef<any[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [nextInstruction, setNextInstruction] = useState<string>("")
  const voiceRef = useRef(true)

  const defaultLat = 14.6928 // Dakar
  const defaultLng = -17.4467

  // Initialize map once
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      if (mapRef.current) return
      LRef.current = L

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current!, {
        center: [driverLat ?? defaultLat, driverLng ?? defaultLng],
        zoom: 14,
        zoomControl: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      // Custom zoom control position
      L.control.zoom({ position: "bottomright" }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        window.speechSynthesis?.cancel()
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // eslint-disable-line

  // Update markers + route when state changes
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    // Clear markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Remove old route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove()
      routeLayerRef.current = null
    }

    const lat = driverLat ?? defaultLat
    const lng = driverLng ?? defaultLng

    // --- Driver marker (pulsing blue dot) ---
    const driverIcon = L.divIcon({
      className: "",
      html: `<div style="position:relative;width:22px;height:22px;">
        <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 0 rgba(59,130,246,0.7);animation:pulse-blue 2s infinite;"></div>
        <style>
          @keyframes pulse-blue {
            0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.6); }
            70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
            100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
          }
        </style>
      </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    })
    const driverM = L.marker([lat, lng], { icon: driverIcon })
      .addTo(map)
      .bindPopup("<b>📍 Votre position</b>")
    markersRef.current.push(driverM)

    if (!activeRide?.pickup_latitude || !activeRide?.pickup_longitude) {
      map.setView([lat, lng], 14, { animate: true })
      return
    }

    // --- Pickup marker (Client position) ---
    const pickupIcon = L.divIcon({
      className: "",
      html: `<div style="background:#22c55e;color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(34,197,94,0.4);border:2px solid white;">
        📍 Client
      </div>`,
      iconSize: [80, 28],
      iconAnchor: [40, 14],
    })
    const pickupM = L.marker([activeRide.pickup_latitude, activeRide.pickup_longitude], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(`<b>📍 Départ client</b><br/>${activeRide.pickup_address}`)
    markersRef.current.push(pickupM)

    // --- Destination marker ---
    if (activeRide.destination_latitude && activeRide.destination_longitude) {
      const destIcon = L.divIcon({
        className: "",
        html: `<div style="background:#ef4444;color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(239,68,68,0.4);border:2px solid white;">
          🏁 Destination
        </div>`,
        iconSize: [110, 28],
        iconAnchor: [55, 14],
      })
      const destM = L.marker([activeRide.destination_latitude, activeRide.destination_longitude], { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>🏁 Destination</b><br/>${activeRide.destination_address}`)
      markersRef.current.push(destM)
    }

    // --- Fetch & draw route ---
    const drawRoute = async () => {
      const route = await fetchOSRMRoute(lat, lng, activeRide.pickup_latitude!, activeRide.pickup_longitude!)
      if (!route) return

      stepsRef.current = route.steps

      // Draw polyline: driver → pickup
      const polyline = L.polyline(route.coords, {
        color: "#6366f1",
        weight: 5,
        opacity: 0.8,
        dashArray: "8, 4",
      }).addTo(map)
      routeLayerRef.current = polyline

      const allPoints: [number, number][] = [[lat, lng], [activeRide.pickup_latitude!, activeRide.pickup_longitude!]]
      if (activeRide.destination_latitude && activeRide.destination_longitude)
        allPoints.push([activeRide.destination_latitude, activeRide.destination_longitude])

      map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50], animate: true })

      // Announce first step
      if (route.steps.length > 0 && voiceRef.current) {
        const instruction = buildVoiceInstruction(route.steps[0])
        setNextInstruction(instruction)
        speak(instruction)
      }
    }

    drawRoute()
  }, [driverLat, driverLng, activeRide])

  // Sync voice ref with state
  useEffect(() => {
    voiceRef.current = voiceEnabled
    if (!voiceEnabled) window.speechSynthesis?.cancel()
  }, [voiceEnabled])

  const centerOnDriver = () => {
    const map = mapRef.current
    if (!map) return
    const lat = driverLat ?? defaultLat
    const lng = driverLng ?? defaultLng
    map.setView([lat, lng], 16, { animate: true })
  }

  const repeatInstruction = () => {
    if (nextInstruction) speak(nextInstruction)
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className={`relative w-full rounded-xl overflow-hidden border shadow-md ${className}`} style={{ height: "260px" }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />

        {/* Voice instruction banner */}
        {activeRide && nextInstruction && (
          <div className="absolute top-2 left-2 right-14 z-[1000] bg-background/95 backdrop-blur border rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary shrink-0" />
            <p className="text-xs font-medium leading-tight line-clamp-2">{nextInstruction}</p>
          </div>
        )}

        {/* Control buttons */}
        <div className="absolute bottom-10 right-2 z-[1000] flex flex-col gap-2">
          {/* Center on driver */}
          <button
            onClick={centerOnDriver}
            className="h-9 w-9 bg-background border rounded-lg shadow-md flex items-center justify-center hover:bg-muted transition-colors"
            title="Centrer sur ma position"
          >
            <LocateFixed className="h-4 w-4 text-primary" />
          </button>

          {/* Voice toggle */}
          <button
            onClick={() => {
              setVoiceEnabled(v => !v)
              if (!voiceEnabled && nextInstruction) speak(nextInstruction)
            }}
            className={`h-9 w-9 border rounded-lg shadow-md flex items-center justify-center transition-colors ${voiceEnabled ? "bg-primary text-white" : "bg-background"}`}
            title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
          >
            {voiceEnabled
              ? <Volume2 className="h-4 w-4" />
              : <VolumeX className="h-4 w-4 text-muted-foreground" />
            }
          </button>

          {/* Repeat instruction */}
          {activeRide && nextInstruction && voiceEnabled && (
            <button
              onClick={repeatInstruction}
              className="h-9 w-9 bg-background border rounded-lg shadow-md flex items-center justify-center hover:bg-muted transition-colors"
              title="Répéter l'instruction"
            >
              <Navigation className="h-4 w-4 text-accent" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
