"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SenebaLogo } from "@/components/seneba-logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { sendOTP } from "@/lib/actions/otp";

export default function ClientLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setDevCode(null);

    const result = await sendOTP(phone);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Erreur lors de l'envoi du SMS.");
      return;
    }

    // Dev mode: show code on screen
    if (result.devCode) {
      setDevCode(result.devCode);
      // Still navigate to OTP page after short delay so user can see code
      setTimeout(() => {
        router.push(`/client/auth/otp?phone=${encodeURIComponent(phone)}`);
      }, 2000);
      return;
    }

    // Production: go to OTP page immediately
    router.push(`/client/auth/otp?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center gap-4 px-4 py-4 safe-area-top">
        <Button variant="ghost" size="icon" asChild className="rounded-full touch-target">
          <Link href="/client">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col px-6 py-4">
        <div className="flex justify-center mb-10">
          <SenebaLogo className="h-12" />
        </div>

        <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          Saisissez votre numéro
        </h1>
        <p className="text-muted-foreground mb-10 text-base">
          Nous vous enverrons un code de confirmation par SMS pour vérifier votre identité.
        </p>

        {/* DEV MODE: affichage du code OTP */}
        {devCode && (
          <div className="mb-6 rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 text-center animate-pulse">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              🧪 Mode Développement — Code OTP
            </p>
            <p className="text-4xl font-black text-amber-700 tracking-[0.3em]">{devCode}</p>
            <p className="text-xs text-amber-500 mt-1">Redirection automatique dans 2 secondes…</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6 flex-1">
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
              Numéro de téléphone
            </Label>
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

          {error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <div className="mt-auto pb-8">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white"
              disabled={loading || phone.length < 9 || !!devCode}
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continuer"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
