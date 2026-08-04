"use client"

import { useEffect, useRef } from "react"
import { LocateFixed } from "lucide-react"

interface RideMapProps {
  className?: string
  pickupLat: number
  pickupLng: number
  destLat: number
  destLng: number
  driverLat?: number
  driverLng?: number
  status: string
}
export function RideMap({ className = "", pickupLat, pickupLng, destLat, destLng, driverLat, driverLng, status }: RideMapProps) {


  const pLat = Number(pickupLat);
  const pLng = Number(pickupLng);
  const dLat = Number(destLat);
  const dLng = Number(destLng);
  const drLat = driverLat !== undefined ? Number(driverLat) : undefined;
  const drLng = driverLng !== undefined ? Number(driverLng) : undefined;
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const markersRef = useRef<{ pickup?: any; dest?: any; driver?: any }>({})
  const routeLineRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return

    let observer: ResizeObserver | null = null;

    import("leaflet").then((L) => {
      if (mapRef.current) return
      LRef.current = L

      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const midLat = (pLat + dLat) / 2;
      const midLng = (pLng + dLng) / 2;

      const map = L.map(containerRef.current!, {
        center: [midLat, midLng],
        zoom: 10,
        zoomControl: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
        className: 'blue-tinted-map'
      }).addTo(map)

      L.control.zoom({ position: "bottomright" }).addTo(map)

      mapRef.current = map

      // Force redraw after container is fully rendered
      setTimeout(() => {
        map.invalidateSize()
        const bounds = L.latLngBounds([pLat, pLng], [dLat, dLng])
        map.fitBounds(bounds, { padding: [60, 60], animate: false })
      }, 100)

      observer = new ResizeObserver(() => {
        if (mapRef.current) mapRef.current.invalidateSize()
      })
      observer.observe(containerRef.current!)

      // Create static markers
      const pickupIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const destIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;background:#10b981;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      markersRef.current.pickup = L.marker([pLat, pLng], { icon: pickupIcon }).addTo(map).bindPopup("Point de départ")
      markersRef.current.dest = L.marker([dLat, dLng], { icon: destIcon }).addTo(map).bindPopup("Destination")

      // Fetch actual route from OSRM
      fetch(`https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            routeLineRef.current = L.geoJSON(data.routes[0].geometry, {
              style: { color: '#0066CC', weight: 5, opacity: 0.8 }
            }).addTo(map)
            
            // Fit bounds to the route
            map.fitBounds(routeLineRef.current.getBounds(), { padding: [50, 50], animate: false })
          } else {
            // Fallback to straight line
            routeLineRef.current = L.polyline([
              [pLat, pLng],
              [dLat, dLng]
            ], { color: '#0066CC', weight: 5, dashArray: '5, 10', opacity: 0.8 }).addTo(map)
            map.fitBounds(L.latLngBounds([pLat, pLng], [dLat, dLng]), { padding: [50, 50], animate: false })
          }
        })
        .catch(() => {
          // Fallback on error
          routeLineRef.current = L.polyline([
            [pLat, pLng],
            [dLat, dLng]
          ], { color: '#0066CC', weight: 5, dashArray: '5, 10', opacity: 0.8 }).addTo(map)
          map.fitBounds(L.latLngBounds([pLat, pLng], [dLat, dLng]), { padding: [50, 50], animate: false })
        })
    })

    return () => {
      if (observer) observer.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [pickupLat, pickupLng, destLat, destLng])

  // Update Driver Marker on Live Location
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map || drLat === undefined || drLng === undefined || status === "requested") return

    if (markersRef.current.driver) {
      // Smoothly update existing marker
      markersRef.current.driver.setLatLng([drLat, drLng])
    } else {
      // Create new driver car marker
      const driverIconHtml = `
        <div style="transition: transform 0.5s ease-out;">
          <div style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        </div>
      `
      const driverIcon = L.divIcon({
        className: 'driver-live-marker',
        html: driverIconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      markersRef.current.driver = L.marker([drLat, drLng], { icon: driverIcon }).addTo(map)
    }

  }, [drLat, drLng, status, pLat, pLng, dLat, dLng])

  const centerMap = () => {
    const map = mapRef.current
    if (!map) return
    // If driver location is known and ride is in progress states, focus accordingly
    if (drLat !== undefined && drLng !== undefined) {
      if (status === "arriving" || status === "accepted") {
        const bounds = LRef.current.latLngBounds([drLat, drLng], [pLat, pLng])
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true })
        return
      } else if (status === "in_progress") {
        const bounds = LRef.current.latLngBounds([drLat, drLng], [dLat, dLng])
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true })
        return
      }
    }
    // Default: fit pickup and destination
    const bounds = LRef.current.latLngBounds([pLat, pLng], [dLat, dLng])
    map.fitBounds(bounds, { padding: [50, 50], animate: true })
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className={`relative w-full h-full min-h-[300px] ${className}`}>
        <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 0 }} />
        
        {/* Control buttons */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={centerMap}
            className="h-10 w-10 bg-background border rounded-full shadow-md flex items-center justify-center hover:bg-muted transition-colors"
            title="Centrer la carte"
          >
            <LocateFixed className="h-5 w-5 text-primary" />
          </button>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .leaflet-marker-icon.driver-live-marker {
            transition: transform 2.5s linear;
          }
        `}} />
      </div>
    </>
  )
}
