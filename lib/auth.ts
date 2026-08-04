import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// 🔐 SÉCURITÉ : JWT_SECRET doit absolument être défini en production.
// Si ce n'est pas le cas, le serveur refuse de démarrer pour éviter
// que des tokens puissent être forgés avec un secret connu.
if (!process.env.JWT_SECRET) {
  throw new Error(
    "[FATAL] La variable d'environnement JWT_SECRET n'est pas définie. " +
    "Ajoutez JWT_SECRET dans votre fichier .env.local ou dans les variables Vercel."
  )
}

const key = new TextEncoder().encode(process.env.JWT_SECRET)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("JWT decryption failed:", error)
    return null
  }
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  const res = NextResponse.next()
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: parsed.expires,
  })
  return res
}
