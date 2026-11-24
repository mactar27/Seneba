import { updateSession, decrypt } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get("session")?.value
  
  // Si l'utilisateur possède déjà une session active et ouvre l'accueil ou le login,
  // on le redirige directement vers l'application (expérience native Uber/Bolt)
  if (sessionToken) {
    try {
      const parsed = await decrypt(sessionToken)
      if (parsed?.user) {
        if (
          pathname === "/" || 
          pathname === "/home" || 
          pathname === "/client/auth/login" || 
          pathname === "/client/auth/sign-up"
        ) {
          if (parsed.user.role === "driver") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
          } else {
            return NextResponse.redirect(new URL("/client/book", request.url))
          }
        }
      }
    } catch {
      // Ignorer si le token ne peut pas être déchiffré
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
