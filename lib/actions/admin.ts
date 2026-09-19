"use server"

import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function getAdminStats() {
  try {
    const [[revenueResult]] = await pool.execute<RowDataPacket[]>(
      "SELECT SUM(total_fare) as total_revenue FROM rides WHERE status = 'completed'"
    )
    
    const [[commissionResult]] = await pool.execute<RowDataPacket[]>(
      "SELECT SUM(commission_amount) as total_commission FROM driver_earnings"
    )

    const [[ridesResult]] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total_rides FROM rides"
    )

    const [[clientsResult]] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total_clients FROM clients"
    )

    const [[driversResult]] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total_drivers FROM drivers"
    )

    return {
      totalRevenue: revenueResult?.total_revenue || 0,
      totalCommission: commissionResult?.total_commission || 0,
      totalRides: ridesResult?.total_rides || 0,
      totalClients: clientsResult?.total_clients || 0,
      totalDrivers: driversResult?.total_drivers || 0,
    }
  } catch (error) {
    console.error("Admin stats error:", error)
    return {
      totalRevenue: 0,
      totalCommission: 0,
      totalRides: 0,
      totalClients: 0,
      totalDrivers: 0,
    }
  }
}

export async function getAdminRides() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT r.*, c.full_name as client_name, d.full_name as driver_name 
       FROM rides r 
       LEFT JOIN clients c ON r.client_id = c.user_id 
       LEFT JOIN drivers d ON r.driver_id = d.id 
       ORDER BY r.requested_at DESC 
       LIMIT 50`
    )
    return rows
  } catch (error) {
    console.error("Admin rides error:", error)
    return []
  }
}

export async function getAdminUsers() {
  try {
    const [clients] = await pool.execute<RowDataPacket[]>(
      "SELECT user_id as id, full_name, phone, 'client' as role, created_at FROM clients ORDER BY created_at DESC LIMIT 50"
    )
    const [drivers] = await pool.execute<RowDataPacket[]>(
      "SELECT id, full_name, phone, 'driver' as role, created_at, status FROM drivers ORDER BY created_at DESC LIMIT 50"
    )
    return { clients, drivers }
  } catch (error) {
    console.error("Admin users error:", error)
    return { clients: [], drivers: [] }
  }
}
