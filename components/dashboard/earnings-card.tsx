"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

interface EarningsCardProps {
  amount: number
}

export function EarningsCard({ amount }: EarningsCardProps) {
  const formattedAmount = new Intl.NumberFormat("fr-GM", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

  return (
    <Link href="/earnings">
      <Card className="p-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Gains aujourd'hui</p>
            <p className="text-3xl font-bold">{formattedAmount} FCFA</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex items-center text-sm opacity-90">
              Voir détails <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
