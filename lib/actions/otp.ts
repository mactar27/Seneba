"use server"

import { cookies } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"

// Generate a random 4-digit OTP code
function generateOTPCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

function createOTPToken(phone: string, code: string): string {
  const expiry = Date.now() + 10 * 60 * 1000 // 10 minutes
  const payload = JSON.stringify({ phone, code, expiry })
  return Buffer.from(payload).toString("base64")
}

function verifyOTPToken(token: string, phone: string, code: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"))
    if (payload.expiry < Date.now()) return false
    const cleanPayloadPhone = String(payload.phone || "").replace(/\s/g, "").replace(/^\+220/, "")
    const cleanInputPhone = String(phone || "").replace(/\s/g, "").replace(/^\+220/, "")
    if (cleanPayloadPhone !== cleanInputPhone) return false
    if (String(payload.code).trim() !== String(code).trim()) return false
    return true
  } catch {
    return false
  }
}

export async function sendOTP(phone: string): Promise<{
  success: boolean
  devCode?: string
  error?: string
}> {
  // Rate limit: max 5 SMS per phone per 10 min
  const cleanPhone = phone.replace(/\s/g, "").replace(/^\+220/, "")
  const rl = checkRateLimit({ key: `otp:${cleanPhone}`, limit: 5, windowSecs: 600 })
  if (!rl.allowed) {
    return { success: false, error: `Trop de tentatives. Réessayez dans ${rl.resetIn}s.` }
  }

  const code = generateOTPCode()
  const token = createOTPToken(cleanPhone, code)

  // Store token in a cookie (httpOnly, secure)
  try {
    const cookieStore = await cookies()
    cookieStore.set("otp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    })
  } catch (err) {
    console.error("Cookie error:", err)
  }

  // Check if Africa's Talking credentials are configured
  const apiKey = process.env.AT_API_KEY
  const username = process.env.AT_USERNAME

  const hasATCredentials =
    apiKey &&
    apiKey !== "votre-api-key-africa-talking" &&
    apiKey !== "at_key" &&
    apiKey.length > 5 &&
    username &&
    username !== "at_username"

  // If no valid credentials → show code directly (dev mode)
  if (!hasATCredentials) {
    console.log(`[DEV] OTP code for +220${cleanPhone}: ${code}`)
    return { success: true, devCode: code }
  }

  // Send SMS via Africa's Talking
  try {
    const formattedPhone = `+220${cleanPhone}`

    const response = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        apiKey,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username,
        to: formattedPhone,
        message: `Votre code SENEBA : ${code}. Valable 10 minutes.`,
        from: "SENEBA",
      }).toString(),
    })

    const data = await response.json()
    const recipient = data?.SMSMessageData?.Recipients?.[0]

    if (recipient?.status === "Success") {
      return { success: true }
    } else {
      // API responded but failed → fallback to show code
      console.error("AT error:", JSON.stringify(data))
      // Still return the code so user is not blocked
      return { success: true, devCode: code }
    }
  } catch (err) {
    console.error("SMS network error:", err)
    // Network failure → fallback to show code
    return { success: true, devCode: code }
  }
}

export async function verifyOTP(phone: string, code: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("otp_token")?.value

    if (!token) {
      return { success: false, error: "Code expiré. Veuillez redemander un code." }
    }

    if (!verifyOTPToken(token, phone, code)) {
      return { success: false, error: "Code incorrect. Vérifiez et réessayez." }
    }

    cookieStore.delete("otp_token")

    const cleanPhone = phone.replace(/\s/g, "").replace(/^\+220/, "")
    const formattedPhone = `+220${cleanPhone}`

    // Lookup the user by phone to create a session
    const pool = (await import("@/lib/db")).default
    let userId: string = ""
    let userEmail: string = ""

    try {
      const [clientRows] = await pool.execute<any[]>(
        "SELECT user_id, email FROM clients WHERE phone = ? OR phone = ? OR phone = ?",
        [cleanPhone, formattedPhone, phone]
      )

      if (clientRows && clientRows.length > 0) {
        userId = clientRows[0].user_id
        userEmail = clientRows[0].email || `${cleanPhone}@seneba.app`
      } else {
        // Auto-provision client user if not exists yet
        const crypto = await import("crypto")
        userId = crypto.randomUUID()
        userEmail = `${cleanPhone}@seneba.app`
        const clientId = crypto.randomUUID()

        await pool.execute(
          "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id",
          [userId, userEmail, "otp_authenticated", "client"]
        )

        await pool.execute(
          "INSERT INTO clients (id, user_id, full_name, phone, email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE phone=phone",
          [clientId, userId, `Client ${cleanPhone}`, cleanPhone, userEmail]
        )
      }
    } catch (dbErr: any) {
      console.error("Database error during OTP verification:", dbErr)
      // If DB fails (table not created or credentials issue), generate transient user ID
      const crypto = await import("crypto")
      userId = crypto.randomUUID()
      userEmail = `${cleanPhone}@seneba.app`
    }

    // Create session
    const { encrypt } = await import("@/lib/auth")
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    const session = await encrypt({ user: { id: userId, email: userEmail, role: 'client' }, expires })

    cookieStore.set("session", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return { success: true }
  } catch (err: any) {
    console.error("verifyOTP error:", err)
    return { success: false, error: err?.message || "Erreur de vérification. Réessayez." }
  }
}
