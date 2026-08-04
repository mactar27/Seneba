"use client"

import { useEffect, useRef, useState } from "react"
import { LocateFixed } from "lucide-react"
import { getAvailableDrivers } from "@/lib/actions/driver"

interface OnlineDriver {
  id: string | number
  lat: number
  lng: number
  rotation: number
}

interface ClientMapProps {
  className?: string
}

export function ClientMap({ className = "" }: ClientMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const markersRef = useRef<Map<string | number, any>>(new Map())
  const userMarkerRef = useRef<any>(null)
  const isInitialCenterDoneRef = useRef(false)
  const [drivers, setDrivers] = useState<OnlineDriver[]>([])
  const [userPosition, setUserPosition] = useState<{lat: number, lng: number} | null>(null)

  const defaultLat = 14.6928 // Dakar
  const defaultLng = -17.4467

  // Initialize map and mock drivers
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    let observer: ResizeObserver | null = null;

    import("leaflet").then((L) => {
      if (mapRef.current) return
      LRef.current = L

      // Fix default icon path issues
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current!, {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: false,
      })

      // Use a clean light map style (CartoDB Positron) 
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
        className: 'map-tiles-blue' // Custom class for CSS filter
      }).addTo(map)

      // Add zoom control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map)

      mapRef.current = map

      // Fix map size on container resize
      observer = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize()
        }
      })
      observer.observe(containerRef.current!)

      // Adds a subtle marker for the user's location
      const userIcon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:16px;height:16px;">
          <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;border:2px solid white;box-shadow:0 0 0 0 rgba(59,130,246,0.7);animation:pulse-blue 2s infinite;"></div>
        </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
      userMarkerRef.current = L.marker([defaultLat, defaultLng], { icon: userIcon }).addTo(map).bindPopup("<b>📍 Votre position</b>")
    })

    return () => {
      if (observer) observer.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch real drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const onlineDrivers = await getAvailableDrivers()
        setDrivers(onlineDrivers)
      } catch (err) {
        console.error("Failed to fetch drivers", err)
      }
    }

    fetchDrivers()
    const interval = setInterval(fetchDrivers, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update marker positions exactly when state updates
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    drivers.forEach(driver => {
      const iconHtml = `
        <div style="transform: rotate(${driver.rotation}deg); transition: transform 0.5s ease-out;">
          <div style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        </div>
      `

      const icon = L.divIcon({
        className: 'driver-marker',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const existingMarker = markersRef.current.get(driver.id)
      if (existingMarker) {
        existingMarker.setLatLng([driver.lat, driver.lng])
        existingMarker.setIcon(icon) // To update rotation graphic
      } else {
        const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(map)
        markersRef.current.set(driver.id, marker)
      }
    })
  }, [drivers])

  // Get user's live location
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setUserPosition({ lat: defaultLat, lng: defaultLng })
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setUserPosition({ lat: latitude, lng: longitude })
      },
      (err) => {
        console.warn("Géolocalisation non disponible ou refusée. Utilisation de la position par défaut.")
        setUserPosition({ lat: defaultLat, lng: defaultLng })
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [defaultLat, defaultLng])

  // Update user marker position and center map if available
  useEffect(() => {
    const map = mapRef.current
    if (!map || !userPosition) return

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng])
    }

    if (!isInitialCenterDoneRef.current) {
      map.setView([userPosition.lat, userPosition.lng], 14, { animate: true })
      isInitialCenterDoneRef.current = true
    }
  }, [userPosition])

  const centerOnUser = () => {
    const map = mapRef.current
    if (!map) return
    const lat = userPosition?.lat ?? defaultLat
    const lng = userPosition?.lng ?? defaultLng
    map.setView([lat, lng], 14, { animate: true })
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className={`relative w-full h-full min-h-[300px] ${className}`}>
        <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 0 }} />

        {/* Control buttons */}
        <div className="absolute bottom-[440px] right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={centerOnUser}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-[#0066CC] hover:bg-slate-50 transition-colors"
            title="Centrer sur ma position"
          >
            <LocateFixed className="h-5 w-5" />
          </button>
        </div>

        {/* Smooth marker transition for position changes and blue map style */}
        <style dangerouslySetInnerHTML={{ __html: `
          .leaflet-marker-icon.driver-marker {
            transition: transform 2.5s linear;
          }
          .map-tiles-blue {
            filter: sepia(0.2) hue-rotate(190deg) saturate(1.2) contrast(1.05) opacity(0.9);
          }
          @keyframes pulse-blue {
            0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.6); }
            70% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
            100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
          }
        `}} />
      </div>
    </>
  )
}
