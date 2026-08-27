"use client"

import { useEffect, useState } from "react"
import { Car } from "lucide-react"

interface MockDriver {
  id: number
  x: number
  y: number
  rotation: number
}

export function NearbyDrivers() {
  const [drivers, setDrivers] = useState<MockDriver[]>([])

  useEffect(() => {
    // Generate mock nearby drivers
    const mockDrivers = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
    }))
    setDrivers(mockDrivers)

    // Simulate driver movement
    const interval = setInterval(() => {
      setDrivers((prev) =>
        prev.map((d) => ({
          ...d,
          x: Math.max(10, Math.min(90, d.x + (Math.random() - 0.5) * 2)),
          y: Math.max(10, Math.min(60, d.y + (Math.random() - 0.5) * 2)),
          rotation: d.rotation + (Math.random() - 0.5) * 30,
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="absolute transition-all duration-1000 ease-in-out"
          style={{
            left: `${driver.x}%`,
            top: `${driver.y}%`,
            transform: `rotate(${driver.rotation}deg)`,
          }}
        >
          <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg">
            <Car className="h-4 w-4" />
          </div>
        </div>
      ))}

      {/* Driver count badge */}
      <div className="absolute top-4 left-4 bg-card px-3 py-2 rounded-full shadow-md flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium">{drivers.length} drivers nearby</span>
      </div>
    </>
  )
}
