"use server"

import pool from "@/lib/db"
import { encrypt, SESSION_DURATION_MS, SESSION_MAX_AGE } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RowDataPacket } from "mysql2"

export async function login(formData: FormData, redirectTo: string = "/dashboard") {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis" }
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    const user = rows[0]

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return { error: "Email ou mot de passe incorrect" }
    }

    // Create persistent session (1 year)
    const expires = new Date(Date.now() + SESSION_DURATION_MS)
    const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role }, expires })

    // Save the session in a cookie
    ;(await cookies()).set("session", session, {
      expires,
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    redirect(redirectTo)
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error
    console.error("Login error:", error)
    return { error: "Une erreur est survenue lors de la connexion" }
  }
}

export async function signup(formData: FormData, role: 'driver' | 'client' = 'driver', redirectTo: string = "/onboarding") {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string

  if (!email || !password || !fullName || !phone) {
    return { error: "Tous les champs sont requis" }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = crypto.randomUUID()

    // Start a transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Create user
      await connection.execute(
        "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [userId, email, hashedPassword, role]
      )

      if (role === 'driver') {
        const driverId = crypto.randomUUID()
        // Create driver profile
        await connection.execute(
          "INSERT INTO drivers (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)",
          [driverId, userId, fullName, phone]
        )
      } else if (role === 'client') {
        // Ensure clients table exists
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS clients (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL UNIQUE,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(255),
            profile_image_url VARCHAR(512),
            home_address TEXT,
            home_latitude DECIMAL(10, 8),
            home_longitude DECIMAL(11, 8),
            work_address TEXT,
            work_latitude DECIMAL(10, 8),
            work_longitude DECIMAL(11, 8),
            total_rides INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        // Create client
        await connection.execute(
          "INSERT INTO clients (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)",
          [crypto.randomUUID(), userId, fullName, phone]
        )
      }

      await connection.commit()
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    // Create persistent session (1 year)
    const expires = new Date(Date.now() + SESSION_DURATION_MS)
    const session = await encrypt({ user: { id: userId, email, role }, expires })
    ;(await cookies()).set("session", session, {
      expires,
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    redirect(redirectTo)
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error
    console.error("Signup error:", error)
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: "Cet email ou numéro de téléphone est déjà utilisé" }
    }
    return { error: `Erreur interne: ${error.message || "Erreur inconnue"}` }
  }
}

export async function logout(redirectTo: string = "/home") {
  ;(await cookies()).set("session", "", {
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
  redirect(redirectTo)
}

export async function getSession() {
  const { getSession: getAuthSession } = await import("@/lib/auth")
  return await getAuthSession()
}

export async function restoreSessionFromStorage(userId?: string, phone?: string): Promise<{ success: boolean; role?: string }> {
  if (!userId && !phone) return { success: false }

  try {
    let user: any = null

    if (userId) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT id, role, email FROM users WHERE id = ?",
        [userId]
      )
      user = rows[0]
    }

    if (!user && phone) {
      const cleanPhone = phone.replace(/\s/g, "").replace(/^\+220/, "")
      const formattedPhone = `+220${cleanPhone}`
      const [clientRows] = await pool.execute<RowDataPacket[]>(
        "SELECT user_id FROM clients WHERE phone = ? OR phone = ? OR phone = ?",
        [cleanPhone, formattedPhone, phone]
      )
      if (clientRows && clientRows[0]) {
        const [uRows] = await pool.execute<RowDataPacket[]>(
          "SELECT id, role, email FROM users WHERE id = ?",
          [clientRows[0].user_id]
        )
        user = uRows[0]
      }
    }

    if (!user) return { success: false }

    // Re-create persistent 1-year session cookie
    const expires = new Date(Date.now() + SESSION_DURATION_MS)
    const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role }, expires })

    ;(await cookies()).set("session", session, {
      expires,
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return { success: true, role: user.role }
  } catch (error) {
    console.error("restoreSessionFromStorage error:", error)
    return { success: false }
  }
}
