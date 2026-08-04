"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Shield, Scale, ScrollText } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background pb-8 safe-area-top safe-area-bottom">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Conditions générales</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Scale className="h-6 w-6" />
            <h2 className="text-xl font-bold">1. Conditions d'utilisation</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            En utilisant l'application SENEBA, vous acceptez de respecter nos règles de conduite et de sécurité. Les chauffeurs s'engagent à fournir un service de qualité et à respecter le code de la route en vigueur au Sénégal.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Shield className="h-6 w-6" />
            <h2 className="text-xl font-bold">2. Protection des données</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nous accordons une importance capitale à la confidentialité de vos données personnelles. Vos informations de localisation ne sont partagées que pour faciliter le bon déroulement des courses.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ScrollText className="h-6 w-6" />
            <h2 className="text-xl font-bold">3. Tarification et commissions</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Les tarifs sont calculés automatiquement en fonction de la distance et du temps de trajet. SENEBA prélève une commission transparente sur chaque course pour assurer la maintenance et l'évolution du service.
          </p>
        </div>

        <div className="pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground italic">
            Dernière mise à jour : 20 mars 2026
          </p>
        </div>
      </main>
    </div>
  )
}
