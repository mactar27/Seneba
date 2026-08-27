"use server"

import { pool } from "@/lib/db"
import { getSession } from "@/lib/auth"
import type { RowDataPacket } from "mysql2"
import { checkRateLimit } from "@/lib/rate-limit"

export async function getClientProfilee() {
  const session = await getSession()
  if (!session?.user?.id) return null

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM clients WHERE user_id = ?",
      [session.user.id]
    )
    
    if (rows[0]) {
      return rows[0]
    }

    // If no client profile exists but session is valid, create a default one
    const clientId = crypto.randomUUID()
    await pool.execute(
      "INSERT INTO clients (id, user_id, full_name, phone, email) VALUES (?, ?, ?, ?, ?)",
      [clientId, session.user.id, "Client Seneba", "", session.user.email || ""]
    )

    const [newRows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM clients WHERE user_id = ?",
      [session.user.id]
    )
    return newRows[0] || null

  } catch (error) {
    console.error("Error fetching/creating client profile:", error)
    return null
  }
}

export async function createRide(data: any) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  // Rate limit: max 5 ride creations per user per minute
  const rl = checkRateLimit({ key: `ride:${session.user.id}`, limit: 5, windowSecs: 60 })
  if (!rl.allowed) {
    return { error: `Trop de demandes. Réessayez dans ${rl.resetIn}s.` }
  }

  const rideId = crypto.randomUUID()
  
  try {
    await pool.execute(
      `INSERT INTO rides (
        id, client_id, client_user_id, client_name, client_phone, 
        pickup_address, pickup_latitude, pickup_longitude, 
        destination_address, destination_latitude, destination_longitude, 
        distance_km, base_fare, distance_fare, total_fare, payment_method, status, requested_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'requested', ?)`,
      [
        rideId, 
        data.client_id, 
        session.user.id, 
        data.client_name, 
        data.client_phone,
        data.pickup_address, 
        data.pickup_latitude, 
        data.pickup_longitude,
        data.destination_address, 
        data.destination_latitude, 
        data.destination_longitude,
        data.distance_km, 
        data.base_fare, 
        data.distance_fare, 
        data.total_fare,
        data.payment_method || 'cash',
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    )

    return { success: true, id: rideId }
  } catch (error) {
    console.error("Error creating ride:", error)
    return { error: "Erreur lors de la création de la course" }
  }
}

export async function getRideDetails(rideId: string) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT r.*, d.full_name as driver_name, d.phone as driver_phone, 
              d.vehicle_make, d.vehicle_model, d.license_plate, d.profile_image_url as driver_image,
              d.average_rating as driver_rating, d.current_latitude as driver_lat, d.current_longitude as driver_lng
       FROM rides r
       LEFT JOIN drivers d ON r.driver_id = d.id
       WHERE r.id = ?`,
      [rideId]
    )
    
    const ride = rows[0]
    if (!ride) return null

    // Map database fields to the interface expected by the UI
    return {
      ...ride,
      driver: ride.driver_name ? {
        full_name: ride.driver_name,
        phone: ride.driver_phone,
        vehicle_make: ride.vehicle_make,
        vehicle_model: ride.vehicle_model,
        license_plate: ride.license_plate,
        profile_image_url: ride.driver_image,
        average_rating: Number(ride.driver_rating) || 0,
        current_latitude: ride.driver_lat ? Number(ride.driver_lat) : undefined,
        current_longitude: ride.driver_lng ? Number(ride.driver_lng) : undefined
      } : null
    }
  } catch (error) {
    console.error("Error fetching ride details:", error)
    return null
  }
}

export async function cancelRide(rideId: string) {
  try {
    await pool.execute(
      "UPDATE rides SET status = 'cancelled', cancelled_at = ?, cancelled_by = 'client' WHERE id = ?",
      [new Date().toISOString().slice(0, 19).replace('T', ' '), rideId]
    )
    return { success: true }
  } catch (error) {
    console.error("Error cancelling ride:", error)
    return { error: "Erreur lors de l'annulation de la course" }
  }
}

export async function rateRide(rideId: string, rating: number, comment: string) {
  try {
    await pool.execute(
      "UPDATE rides SET rating = ?, rating_comment = ? WHERE id = ?",
      [rating, comment, rideId]
    )
    return { success: true }
  } catch (error) {
    console.error("Error rating ride:", error)
    return { error: "Erreur lors de l'enregistrement de la note" }
  }
}

export async function getClientRideHistory() {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT r.*, d.full_name as driver_name, d.vehicle_make, d.vehicle_model, d.license_plate, d.average_rating as driver_rating
       FROM rides r
       LEFT JOIN drivers d ON r.driver_id = d.id
       WHERE r.client_user_id = ?
       ORDER BY r.created_at DESC`,
      [session.user.id]
    )
    
    // Map database fields to the interface expected by the UI
    const rides = rows.map(row => ({
      ...row,
      driver: row.driver_name ? {
        full_name: row.driver_name,
        vehicle_make: row.vehicle_make,
        vehicle_model: row.vehicle_model,
        license_plate: row.license_plate,
        average_rating: Number(row.driver_rating) || 0
      } : null
    }))
    return { rides }
  } catch (error) {
    console.error("Error fetching client ride history:", error)
    return { error: "Erreur lors de la récupération de l'historique" }
  }
}

export async function updateClientProfilee(data: any) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    await pool.execute(
      `UPDATE clients SET 
        full_name = ?, phone = ?, email = ?, 
        home_address = ?, work_address = ?, 
        updated_at = ? 
       WHERE user_id = ?`,
      [
        data.full_name, data.phone, data.email, 
        data.home_address, data.work_address, 
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        session.user.id
      ]
    )
    return { success: true }
  } catch (error) {
    console.error("Error updating client profile:", error)
    return { error: "Erreur lors de la mise à jour du profil" }
  }
}
