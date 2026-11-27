"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SenebaLogo } from "@/components/seneba-logo";
import { completeClientProfile } from "@/lib/actions/client";
import { User, Calendar, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both your first and last name.");
      return;
    }

    if (!birthDate) {
      setError("Please select your date of birth.");
      return;
    }

    // Check minimum age (e.g. 16 years old)
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 13 || birthYear > currentYear - 5) {
      setError("Please enter a valid date of birth.");
      return;
    }

    setLoading(true);

    const result = await completeClientProfile({
      firstName,
      lastName,
      birthDate,
      phone,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("seneba_session", JSON.stringify({ 
        userId: result.userId || "client", 
        phone: phone || "+220 77 123 45 67", 
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(), 
        birthDate, 
        timestamp: Date.now() 
      }));
    }

    // Successfully completed! Go directly to booking
    router.push("/client/book");
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex flex-1 flex-col px-6 py-8 safe-area-top safe-area-bottom justify-between">
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-8">
            <SenebaLogo className="h-10" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066CC] text-xs font-bold">
              <span>Step 2/2</span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">
            Tell us about you
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Enter your name and date of birth to complete your SENEBA account.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Prénom (First Name) */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                First Name (Prénom)
              </Label>
              <div className="flex items-center rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card px-4 h-14">
                <User className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="e.g. Lamin"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoFocus
                  className="border-0 focus-visible:ring-0 text-base font-semibold px-0"
                />
              </div>
            </div>

            {/* Nom (Last Name) */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                Last Name (Nom)
              </Label>
              <div className="flex items-center rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card px-4 h-14">
                <User className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="e.g. Jallow"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border-0 focus-visible:ring-0 text-base font-semibold px-0"
                />
              </div>
            </div>

            {/* Date de naissance (Date of Birth) */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                Date of Birth (Date de naissance)
              </Label>
              <div className="flex items-center rounded-2xl border-2 border-muted-foreground/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-card px-4 h-14">
                <Calendar className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className="border-0 focus-visible:ring-0 text-base font-semibold px-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-[#0066CC] flex-shrink-0" />
              <span>Your personal data is encrypted and kept safe with SENEBA.</span>
            </div>

            <Button
              type="submit"
              disabled={loading || !firstName || !lastName || !birthDate}
              className="mt-6 w-full h-14 rounded-2xl text-base font-black bg-[#0066CC] hover:bg-[#0052A3] text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving profile...
                </>
              ) : (
                <>
                  Continue to SENEBA <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-[#0066CC]" />
        </div>
      }
    >
      <CompleteProfileForm />
    </Suspense>
  );
}
