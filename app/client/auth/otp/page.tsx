"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Delete } from "lucide-react";
import { verifyOTP, sendOTP } from "@/lib/actions/otp";

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const [devCode, setDevCode] = useState<string | null>(null);
  const CODE_LENGTH = 4;

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleKeyPress = (key: string) => {
    if (code.length < CODE_LENGTH && !loading) {
      setCode((prev) => prev + key);
      setError("");
    }
  };

  const handleDelete = () => {
    setCode((prev) => prev.slice(0, -1));
    setError("");
  };

  // Auto-submit when code is full
  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      handleVerification(code);
    }
  }, [code]);

  const handleVerification = async (enteredCode: string) => {
    setLoading(true);
    setError("");

    const result = await verifyOTP(phone, enteredCode);

    if (!result.success) {
      setError(result.error || "Code incorrect.");
      setCode("");
      setLoading(false);
      return;
    }

    // Redirect to book page on success
    router.push("/client/book");
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setDevCode(null);
    setCode("");
    setError("");
    setResendCooldown(30);

    const result = await sendOTP(phone);
    if (result.devCode) {
      setDevCode(result.devCode);
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center gap-4 px-4 py-4 safe-area-top">
        <Button variant="ghost" size="icon" asChild className="rounded-full touch-target">
          <Link href="/client/auth/login">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col px-6 py-4">
        <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          Code de validation
        </h1>
        <p className="text-muted-foreground mb-8 text-base">
          Saisissez le code à 4 chiffres envoyé au{" "}
          <span className="font-bold text-foreground">+221 {phone}</span>
        </p>

        {/* DEV MODE: affichage du code OTP */}
        {devCode && (
          <div className="mb-6 rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 text-center">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              🧪 Mode Développement — Code OTP
            </p>
            <p className="text-4xl font-black text-amber-700 tracking-[0.3em]">{devCode}</p>
          </div>
        )}

        {/* OTP Digit Display */}
        <div className="flex justify-center gap-4 mb-6">
          {[...Array(CODE_LENGTH)].map((_, i) => (
            <div
              key={i}
              className={`w-16 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 transition-all duration-200 ${
                loading
                  ? "border-primary/40 bg-primary/5 text-primary/40"
                  : code[i]
                  ? "border-primary bg-primary/5 text-primary scale-105"
                  : "border-muted-foreground/20 bg-muted/10 text-muted-foreground"
              }`}
            >
              {code[i] ? "●" : ""}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive text-center border border-destructive/20">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center text-primary mb-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        <div className="mt-auto pb-8 space-y-4">
          {/* Resend button */}
          <p className="text-center text-sm font-medium text-muted-foreground">
            Je n'ai pas reçu de code.{" "}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-bold transition-colors ${
                resendCooldown > 0
                  ? "text-muted-foreground cursor-not-allowed"
                  : "text-accent hover:underline"
              }`}
            >
              {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : "Renvoyer"}
            </button>
          </p>

          {/* Custom Numpad */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="ghost"
                onClick={() => handleKeyPress(num.toString())}
                disabled={loading}
                className="h-16 text-2xl font-semibold rounded-2xl hover:bg-muted active:bg-muted/80 active:scale-95 transition-transform"
              >
                {num}
              </Button>
            ))}
            <div /> {/* spacer */}
            <Button
              variant="ghost"
              onClick={() => handleKeyPress("0")}
              disabled={loading}
              className="h-16 text-2xl font-semibold rounded-2xl hover:bg-muted active:bg-muted/80 active:scale-95 transition-transform"
            >
              0
            </Button>
            <Button
              variant="ghost"
              onClick={handleDelete}
              disabled={loading}
              className="h-16 rounded-2xl hover:bg-muted active:bg-muted/80 text-muted-foreground active:scale-95 transition-transform"
            >
              <Delete className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <OTPForm />
    </Suspense>
  );
}
