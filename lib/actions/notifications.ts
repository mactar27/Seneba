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

export async function getClientNotifications(): Promise<Notification[]> {
  const session = await getSession()
  const userId = session?.user?.id

  try {
    // Ensure table exists with all needed columns
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        driver_id VARCHAR(36),
        client_id VARCHAR(36),
        type VARCHAR(50) NOT NULL DEFAULT 'system',
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    let rows: any[] = []
    if (userId) {
      const [res] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM notifications WHERE user_id = ? OR client_id = ? ORDER BY created_at DESC LIMIT 30",
        [userId, userId]
      )
      rows = res
    }

    if (rows.length === 0) {
      const crypto = await import("crypto")
      const welcomeId = crypto.randomUUID()
      const promoId = crypto.randomUUID()
      const safetyId = crypto.randomUUID()

      if (userId) {
        try {
          await pool.execute(
            "INSERT INTO notifications (id, user_id, type, title, body, is_read) VALUES (?, ?, ?, ?, ?, ?)",
            [welcomeId, userId, "system", "Welcome to SENEBA 🇬🇲", "Your account is active! Book fast, secure and reliable rides in Gambia anytime.", false]
          )
          await pool.execute(
            "INSERT INTO notifications (id, user_id, type, title, body, is_read) VALUES (?, ?, ?, ?, ?, ?)",
            [promoId, userId, "payment", "Special Launch Promo: -15% 🎉", "Enjoy 15% discount on your next ride to or from Banjul Airport with code SENEBA2026.", false]
          )
          await pool.execute(
            "INSERT INTO notifications (id, user_id, type, title, body, is_read) VALUES (?, ?, ?, ?, ?, ?)",
            [safetyId, userId, "rating", "Safety First 🛡️", "All SENEBA drivers are background-checked and identity-verified for your safety.", false]
          )
        } catch (seedErr) {
          console.error("Error inserting initial notifications:", seedErr)
        }
      }

      return [
        {
          id: promoId,
          driver_id: "",
          type: "payment",
          title: "Special Launch Promo: -15% 🎉",
          body: "Enjoy 15% discount on your next ride to or from Banjul Airport with code SENEBA2026.",
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: welcomeId,
          driver_id: "",
          type: "system",
          title: "Welcome to SENEBA 🇬🇲",
          body: "Your account is active! Book fast, secure and reliable rides in Gambia anytime.",
          is_read: false,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: safetyId,
          driver_id: "",
          type: "rating",
          title: "Safety First 🛡️",
          body: "All SENEBA drivers are background-checked and identity-verified for your safety.",
          is_read: false,
          created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
        }
      ]
    }

    return rows.map(r => ({ ...r, is_read: !!r.is_read })) as Notification[]
  } catch (error) {
    console.error("Error fetching client notifications:", error)
    return [
      {
        id: "promo-1",
        driver_id: "",
        type: "payment",
        title: "Special Launch Promo: -15% 🎉",
        body: "Enjoy 15% discount on your next ride to or from Banjul Airport with code SENEBA2026.",
        is_read: false,
        created_at: new Date().toISOString()
      },
      {
        id: "welcome-1",
        driver_id: "",
        type: "system",
        title: "Welcome to SENEBA 🇬🇲",
        body: "Your account is active! Book fast, secure and reliable rides in Gambia anytime.",
        is_read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: "safety-1",
        driver_id: "",
        type: "rating",
        title: "Safety First 🛡️",
        body: "All SENEBA drivers are background-checked and identity-verified for your safety.",
        is_read: false,
        created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      }
    ]
  }
}

export async function markClientNotificationsAsRead(): Promise<{ success: boolean }> {
  const session = await getSession()
  const userId = session?.user?.id
  if (!userId) return { success: true }

  try {
    await pool.execute(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ? OR client_id = ?",
      [userId, userId]
    )
    return { success: true }
  } catch (error) {
    console.error("Error marking client notifications as read:", error)
    return { success: false }
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
