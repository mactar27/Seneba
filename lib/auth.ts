import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// 🔐 SÉCURITÉ : JWT_SECRET doit être défini en production.
// S'il n'est pas encore configuré sur Vercel, une clé de secours est utilisée avec un avertissement.
const jwtSecretValue = process.env.JWT_SECRET || "seneba-default-jwt-secret-fallback-key-2026"

if (!process.env.JWT_SECRET) {
  console.warn(
    "[WARNING] La variable d'environnement JWT_SECRET n'est pas définie. " +
    "Ajoutez JWT_SECRET dans votre fichier .env.local ou dans les variables Vercel."
  )
}

const key = new TextEncoder().encode(jwtSecretValue)

// Durée de session persistante : 1 an (l'utilisateur reste connecté tant qu'il ne clique pas sur Déconnexion)
export const SESSION_MAX_AGE = 365 * 24 * 60 * 60 // 365 jours en secondes
export const SESSION_DURATION_MS = SESSION_MAX_AGE * 1000

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
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
  if (!parsed) return

  parsed.expires = new Date(Date.now() + SESSION_DURATION_MS)
  const res = NextResponse.next()
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: parsed.expires,
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
