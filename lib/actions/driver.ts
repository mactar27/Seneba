"use server"

import pool from "@/lib/db"
import { getSession } from "@/lib/auth"
import { RowDataPacket, ResultSetHeader } from "mysql2"
import { Driver, Ride } from "@/lib/types"
import { pusherServer } from "@/lib/pusher"

export async function getDriverProfile() {
  const session = await getSession()
  if (!session?.user?.id) return null

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM drivers WHERE user_id = ?",
      [session.user.id]
    )
    if (!rows[0]) return null
    
    const driver = rows[0] as Driver
    
    // Calculate real stats from rides table
    const [stats] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total, AVG(rating) as rating FROM rides WHERE driver_id = ? AND status = 'completed'",
      [driver.id]
    )
    
    const realTotal = stats[0]?.total || 0
    const realRating = stats[0]?.rating || 4.5 // Default to 4.5 if no ratings yet

    return {
      ...driver,
      total_rides: realTotal,
      average_rating: realRating,
      is_available: !!driver.is_available,
      is_verified: !!driver.is_verified
    }
  } catch (error) {
    console.error("Error fetching driver profile:", error)
    return null
  }
}

export async function updateDriverAvailability(isAvailable: boolean) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    await pool.execute(
      "UPDATE drivers SET is_available = ? WHERE user_id = ?",
      [isAvailable, session.user.id]
    )
    return { success: true }
  } catch (error) {
    console.error("Error updating availability:", error)
    return { error: "Erreur lors de la mise à jour" }
  }
}

export async function updateDriverLocation(lat: number, lng: number) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    // 1. Save to DB
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM drivers WHERE user_id = ?",
      [session.user.id]
    )
    const driverId = rows[0]?.id

    await pool.execute(
      "UPDATE drivers SET current_latitude = ?, current_longitude = ? WHERE user_id = ?",
      [lat, lng, session.user.id]
    )

    // 2. Find active ride for this driver and push location to client
    if (driverId) {
      const [rideRows] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM rides WHERE driver_id = ? AND status IN ('accepted', 'arriving', 'in_progress') LIMIT 1",
        [driverId]
      )
      if (rideRows[0]) {
        // Pusher: push driver coordinates to the client watching this ride
        try {
          await pusherServer.trigger(`ride-${rideRows[0].id}`, "driver-location", { lat, lng })
        } catch {
          // Pusher not configured, skip silently
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating location:", error)
    return { error: "Erreur de mise à jour" }
  }
}

export async function getAvailableDrivers(
  clientLat?: number,
  clientLng?: number,
  radiusKm: number = 15
) {
  try {
    // Si les coordonnées du client ne sont pas fournies → fallback sans filtre
    if (clientLat == null || clientLng == null) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, current_latitude AS lat, current_longitude AS lng
         FROM drivers
         WHERE is_available = TRUE
           AND current_latitude  IS NOT NULL
           AND current_longitude IS NOT NULL
         LIMIT 50`
      )
      return rows.map(r => ({
        id: r.id,
        lat: Number(r.lat),
        lng: Number(r.lng),
        rotation: Math.floor(Math.random() * 360),
        distance_km: null as number | null,
      }))
    }

    // ⚡ Bounding box + index composite idx_drivers_available_location
    // TiDB utilise l'index sur (is_available, lat, lng) pour
    // filtrer rapidement sans parcourir toute la table.
    const delta = radiusKm / 111.0 // 1° lat ≈ 111 km
    const latMin = clientLat - delta
    const latMax = clientLat + delta
    const lngMin = clientLng - delta
    const lngMax = clientLng + delta

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT
         id,
         current_latitude  AS lat,
         current_longitude AS lng,
         ROUND(
           ST_Distance_Sphere(
             POINT(current_longitude, current_latitude),
             POINT(?, ?)
           ) / 1000,
           2
         ) AS distance_km
       FROM drivers
       WHERE is_available = TRUE
         AND current_latitude  BETWEEN ? AND ?
         AND current_longitude BETWEEN ? AND ?
       ORDER BY distance_km
       LIMIT 20`,
      [clientLng, clientLat, latMin, latMax, lngMin, lngMax]
    )

    return rows.map(r => ({
      id: r.id,
      lat: Number(r.lat),
      lng: Number(r.lng),
      rotation: Math.floor(Math.random() * 360),
      distance_km: r.distance_km != null ? Number(r.distance_km) : null,
    }))
  } catch (error) {
    console.error("Error fetching available drivers:", error)
    return []
  }
}


export async function getActiveRide(driverId: string) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM rides WHERE driver_id = ? AND status IN ('accepted', 'arriving', 'in_progress')",
      [driverId]
    )
    return rows[0] as Ride || null
  } catch (error) {
    console.error("Error fetching active ride:", error)
    return null
  }
}

export async function getTodayEarnings(driverId: string) {
  try {
    const today = new Date().toISOString().split("T")[0]
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT SUM(net_amount) as total FROM driver_earnings WHERE driver_id = ? AND created_at >= ?",
      [driverId, today]
    )
    return rows[0]?.total || 0
  } catch (error) {
    console.error("Error fetching earnings:", error)
    return 0
  }
}

export async function acceptRide(rideId: string, driverId: string) {
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE rides SET driver_id = ?, status = 'accepted', accepted_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'requested'",
      [driverId, rideId]
    )
    if (result.affectedRows === 0) return { error: "Course déjà acceptée ou annulée" }
    
    // Notify driver of accepted ride
    const notifId = crypto.randomUUID()
    await pool.execute(
      "INSERT INTO notifications (id, driver_id, type, title, body) VALUES (?, ?, 'ride_request', 'Course acceptée !', 'Vous avez accepté une nouvelle course. Bonne route !')",
      [notifId, driverId]
    )

    // Pusher: notify the client that a driver accepted
    try {
      await pusherServer.trigger(`ride-${rideId}`, "ride-accepted", { driverId, status: "accepted" })
    } catch {
      // Pusher not configured, skip silently
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error accepting ride:", error)
    return { error: "Erreur lors de l'acceptation de la course" }
  }
}

export async function updateRideStatus(rideId: string, newStatus: string, driverId: string, totalFare?: number) {
  try {
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      const updates: string[] = ["status = ?"]
      const params: any[] = [newStatus]

      if (newStatus === "in_progress") {
        updates.push("started_at = CURRENT_TIMESTAMP")
      } else if (newStatus === "completed") {
        updates.push("completed_at = CURRENT_TIMESTAMP")
      }

      params.push(rideId)
      await connection.execute(
        `UPDATE rides SET ${updates.join(", ")} WHERE id = ?`,
        params
      )

      if (newStatus === "completed" && totalFare) {
        const netAmount = totalFare * 0.8
        const commissionAmount = totalFare * 0.2
        const earningId = crypto.randomUUID()

        await connection.execute(
          "INSERT INTO driver_earnings (id, driver_id, ride_id, amount, commission_rate, commission_amount, net_amount, earning_type) VALUES (?, ?, ?, ?, ?, ?, ?, 'ride')",
          [earningId, driverId, rideId, totalFare, 0.2, commissionAmount, netAmount]
        )

        await connection.execute(
          "UPDATE drivers SET total_rides = total_rides + 1 WHERE id = ?",
          [driverId]
        )

        // Create payment notification
        const notifId = crypto.randomUUID()
        await connection.execute(
          "INSERT INTO notifications (id, driver_id, type, title, body) VALUES (?, ?, 'payment', 'Paiement reçu', ?)",
          [notifId, driverId, `Vous avez reçu ${netAmount.toFixed(0)} FCFA pour votre course.`]
        )
      }

      await connection.commit()

      // Pusher: push status update to client tracking this ride
      try {
        await pusherServer.trigger(`ride-${rideId}`, "ride-status", { status: newStatus })
      } catch {
        // Pusher not configured, skip silently
      }

      return { success: true }
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error updating ride status:", error)
    return { error: "Erreur lors de la mise à jour du statut" }
  }
}

export async function getPendingRides() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM rides WHERE status = 'requested' ORDER BY created_at DESC LIMIT 1"
    )
    return rows[0] as Ride || null
  } catch (error) {
    console.error("Error fetching pending rides:", error)
    return null
  }
}
export async function completeOnboarding(formData: FormData) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const vehicleMake = formData.get("vehicleMake") as string
  const vehicleModel = formData.get("vehicleModel") as string
  const vehicleYearRaw = formData.get("vehicleYear")
  const vehicleYear = vehicleYearRaw ? Number(vehicleYearRaw) : null
  const vehicleColor = formData.get("vehicleColor") as string
  const licensePlate = formData.get("licensePlate") as string

  console.log("completeOnboarding starting for user:", session.user.id)
  console.log("Data:", { fullName, phone, vehicleMake, vehicleModel, vehicleYear, vehicleColor, licensePlate })

  if (vehicleYear && isNaN(vehicleYear)) {
    return { error: "L'année du véhicule doit être un nombre valide" }
  }

  try {
    const driverId = crypto.randomUUID()
    
    // Check if driver already exists
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM drivers WHERE user_id = ?",
      [session.user.id]
    )

    if (existing.length > 0) {
      // Update existing driver
      await pool.execute(
        "UPDATE drivers SET full_name = ?, phone = ?, vehicle_make = ?, vehicle_model = ?, vehicle_year = ?, vehicle_color = ?, license_plate = ?, is_verified = TRUE WHERE user_id = ?",
        [fullName, phone, vehicleMake, vehicleModel, vehicleYear, vehicleColor, licensePlate, session.user.id]
      )
    } else {
      // Insert new driver
      await pool.execute(
        "INSERT INTO drivers (id, user_id, full_name, phone, vehicle_make, vehicle_model, vehicle_year, vehicle_color, license_plate, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)",
        [driverId, session.user.id, fullName, phone, vehicleMake, vehicleModel, vehicleYear, vehicleColor, licensePlate]
      )
    }

    return { success: true }
  } catch (error: any) {
    console.error("Onboarding error:", error)
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: "Ce numéro de téléphone est déjà utilisé" }
    }
    return { error: "Erreur lors de l'enregistrement des informations" }
  }
}

export async function getEarningsHistory(driverId: string) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, r.pickup_address, r.destination_address 
       FROM driver_earnings e
       LEFT JOIN rides r ON e.ride_id = r.id
       WHERE e.driver_id = ?
       ORDER BY e.created_at DESC
       LIMIT 20`,
      [driverId]
    )
    
    // Map database fields to the interface expected by the UI
    return rows.map(row => ({
      ...row,
      rides: row.pickup_address ? {
        pickup_address: row.pickup_address,
        destination_address: row.destination_address
      } : undefined
    }))
  } catch (error) {
    console.error("Error fetching earnings history:", error)
    return []
  }
}

export async function getWeekEarnings(driverId: string) {
  try {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT SUM(net_amount) as total FROM driver_earnings WHERE driver_id = ? AND created_at >= ?",
      [driverId, weekAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )
    return Number(rows[0]?.total) || 0
  } catch (error) {
    console.error("Error fetching week earnings:", error)
    return 0
  }
}

export async function getRideHistory(driverId: string) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM rides WHERE driver_id = ? AND status IN ('completed', 'cancelled') ORDER BY created_at DESC LIMIT 30",
      [driverId]
    )
    return rows as Ride[]
  } catch (error) {
    console.error("Error fetching ride history:", error)
    return []
  }
}

export async function updateDriverProfile(data: any) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    await pool.execute(
      `UPDATE drivers SET 
        full_name = ?, phone = ?, 
        profile_image_url = ?,
        vehicle_make = ?, vehicle_model = ?, 
        vehicle_year = ?, vehicle_color = ?, 
        license_plate = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [
        data.fullName, data.phone, 
        data.profileImageUrl,
        data.vehicleMake, data.vehicleModel, 
        data.vehicleYear, data.vehicleColor, 
        data.licensePlate, session.user.id
      ]
    )
    return { success: true }
  } catch (error: any) {
    console.error("Error updating driver profile:", error)
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: "Ce numéro de téléphone est déjà utilisé" }
    }
    return { error: "Erreur lors de la mise à jour du profil" }
  }
}

export async function seedDemoData() {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    const driver = await getDriverProfile()
    if (!driver) return { error: "Profil chauffeur introuvable" }

    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // 1. Create a dummy client
      const clientId = crypto.randomUUID()
      const clientUserId = crypto.randomUUID()
      await connection.execute(
        "INSERT IGNORE INTO users (id, email, password_hash, role) VALUES (?, 'demo-client@seneba.com', 'demo', 'client')",
        [clientUserId]
      )
      await connection.execute(
        "INSERT IGNORE INTO clients (id, user_id, full_name, phone) VALUES (?, ?, 'Demo Client', '+220 00 000 00 00')",
        [clientId, clientUserId]
      )

      // 2. Create a completed ride
      const rideId = crypto.randomUUID()
      const totalFare = 250
      await connection.execute(
        "INSERT INTO rides (id, client_id, client_user_id, driver_id, pickup_address, destination_address, total_fare, status, created_at, accepted_at, started_at, completed_at, rating, rating_comment) VALUES (?, ?, ?, ?, 'Banjul Market', 'Senegambia Strip', ?, 'completed', ?, ?, ?, ?, 5, 'Excellent service !')",
        [
          rideId, clientId, clientUserId, driver.id, 
          totalFare,
          new Date(Date.now() - 3600000).toISOString().slice(0, 19).replace('T', ' '),
          new Date(Date.now() - 3500000).toISOString().slice(0, 19).replace('T', ' '),
          new Date(Date.now() - 3400000).toISOString().slice(0, 19).replace('T', ' '),
          new Date(Date.now() - 1800000).toISOString().slice(0, 19).replace('T', ' ')
        ]
      )

      // 3. Create earning
      const earningId = crypto.randomUUID()
      const netAmount = totalFare * 0.8
      const commissionAmount = totalFare * 0.2
      await connection.execute(
        "INSERT INTO driver_earnings (id, driver_id, ride_id, amount, commission_rate, commission_amount, net_amount, earning_type) VALUES (?, ?, ?, ?, ?, ?, ?, 'ride')",
        [earningId, driver.id, rideId, totalFare, 0.2, commissionAmount, netAmount]
      )

      await connection.commit()
      return { success: true }
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error seeding demo data:", error)
    return { error: "Erreur lors de la génération des données" }
  }
}
