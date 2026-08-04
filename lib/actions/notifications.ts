"use server"

import pool from "@/lib/db"
import { getSession } from "@/lib/auth"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export interface Notification {
  id: string
  driver_id: string
  type: "ride_request" | "ride_cancelled" | "payment" | "rating" | "system"
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export async function getNotifications(): Promise<Notification[]> {
  const session = await getSession()
  if (!session?.user?.id) return []

  try {
    // Get driver id from user id
    const [drivers] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM drivers WHERE user_id = ?",
      [session.user.id]
    )
    if (!drivers[0]) return []
    const driverId = drivers[0].id

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM notifications WHERE driver_id = ? ORDER BY created_at DESC LIMIT 30",
      [driverId]
    )
    return rows.map(r => ({ ...r, is_read: !!r.is_read })) as Notification[]
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function getUnreadCount(): Promise<number> {
  const session = await getSession()
  if (!session?.user?.id) return 0

  try {
    const [drivers] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM drivers WHERE user_id = ?",
      [session.user.id]
    )
    if (!drivers[0]) return 0

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM notifications WHERE driver_id = ? AND is_read = FALSE",
      [drivers[0].id]
    )
    return Number(rows[0]?.count) || 0
  } catch (error) {
    return 0
  }
}

export async function markAsRead(notificationId: string) {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    await pool.execute(
      "UPDATE notifications SET is_read = TRUE WHERE id = ?",
      [notificationId]
    )
    return { success: true }
  } catch (error) {
    return { error: "Erreur" }
  }
}

export async function markAllAsRead() {
  const session = await getSession()
  if (!session?.user?.id) return { error: "Non autorisé" }

  try {
    const [drivers] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM drivers WHERE user_id = ?",
      [session.user.id]
    )
    if (!drivers[0]) return { error: "Chauffeur introuvable" }

    await pool.execute(
      "UPDATE notifications SET is_read = TRUE WHERE driver_id = ?",
      [drivers[0].id]
    )
    return { success: true }
  } catch (error) {
    return { error: "Erreur" }
  }
}

export async function createNotification(
  driverId: string,
  type: Notification["type"],
  title: string,
  body: string
) {
  try {
    const id = crypto.randomUUID()
    await pool.execute(
      "INSERT INTO notifications (id, driver_id, type, title, body) VALUES (?, ?, ?, ?, ?)",
      [id, driverId, type, title, body]
    )
    return { success: true, id }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { error: "Erreur lors de la création" }
  }
}
