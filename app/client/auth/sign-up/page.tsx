"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SenebaLogo } from "@/components/seneba-logo"
import { signup } from "@/lib/actions/auth"
import { ArrowLeft, Loader2, User, Mail, Lock } from "lucide-react"

export default function ClientSignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData()
    formData.append("fullName", fullName)
    // Always store phone without spaces, prefix is implied
    formData.append("phone", phone.replace(/\s/g, ""))
    formData.append("email", email)
    formData.append("password", password)

    const result = await signup(formData, "client", "/client/book")

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center gap-4 px-4 py-4 safe-area-top">
        <Button variant="ghost" size="icon" asChild className="rounded-full touch-target">
          <Link href="/home">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col px-6 py-2">
        <div className="flex justify-center mb-6">
          <SenebaLogo className="h-10" />
        </div>

        <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">Créer un compte</h1>
        <p className="text-muted-foreground mb-8 text-base">Inscrivez-vous pour commander votre première course SENEBA.</p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5 flex-1">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">Nom complet</Label>
            <div className="flex items-center rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card px-4 h-14">
              <User className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                id="fullName"
                type="text"
                placeholder="Ex: Amadou Diallo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-0 focus-visible:ring-0 text-lg font-medium px-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Numéro de téléphone</Label>
            <div className="flex rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card overflow-hidden">
              <div className="flex items-center justify-center px-4 bg-muted/30 border-r border-muted-foreground/20">
                <span className="font-bold text-foreground text-lg">🇸🇳 +221</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="77 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-14 border-0 focus-visible:ring-0 text-lg font-medium px-4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email</Label>
            <div className="flex items-center rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card px-4 h-14">
              <Mail className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-0 focus-visible:ring-0 text-lg font-medium px-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Mot de passe</Label>
            <div className="flex items-center rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card px-4 h-14">
              <Lock className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-0 focus-visible:ring-0 text-lg font-medium px-0"
              />
            </div>
          </div>

          {error && <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20 mt-2">{error}</div>}

          <div className="mt-auto pb-4 pt-6">
            <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Créer mon compte"}
            </Button>
            
            <p className="text-center text-muted-foreground mt-6 text-sm">
              En créant un compte, vous acceptez nos{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Conditions
              </Link>
              {" "}et notre{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Confidentialité
              </Link>
            </p>

            <p className="text-center text-muted-foreground mt-4 text-base">
              Déjà un compte ?{" "}
              <Link href="/client/auth/login" className="text-primary font-bold hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
