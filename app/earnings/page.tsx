"use client"

import { 
  getDriverProfilee, 
  getEarningsHistory, 
  getTodayEarnings, 
  getWeekEarnings 
} from "@/lib/actions/driver"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Driver } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { ArrowLeft, TrendingUp, Calendar, Wallet } from "lucide-react"
import Link from "next/link"

interface EarningWithRide {
  id: string
  net_amount?: number
  commission_amount?: number
  created_at: string
  rides?: {
    pickup_address: string
    destination_address: string
  }
}

export default function EarningsPage() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [earnings, setEarnings] = useState<EarningWithRide[]>([])
  const [todayTotal, setTodayTotal] = useState(0)
  const [weekTotal, setWeekTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadData = useCallback(async () => {
    const driverData = await getDriverProfilee()
    if (!driverData) {
      router.push("/auth/login")
      return
    }

    setDriver(driverData)

    const [history, today, week] = await Promise.all([
      getEarningsHistory(driverData.id),
      getTodayEarnings(driverData.id),
      getWeekEarnings(driverData.id)
    ])

    setEarnings(history as EarningWithRide[])
    setTodayTotal(today)
    setWeekTotal(week)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-GM", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background pb-20 safe-area-top safe-area-bottom">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Mes gains</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Aujourd'hui</span>
            </div>
            <p className="text-2xl font-bold">{formatAmount(todayTotal)} FCFA</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-0">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Cette semaine</span>
            </div>
            <p className="text-2xl font-bold">{formatAmount(weekTotal)} FCFA</p>
          </Card>
        </div>

        {/* Earnings List */}
        <div>
          <h2 className="font-semibold mb-3">History des gains</h2>
          {earnings.length === 0 ? (
            <Card className="p-8 text-center">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucun gain pour le moment</p>
              <p className="text-sm text-muted-foreground mt-1">Your earnings will appear here after your rides</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {earnings.map((earning) => (
                <Card key={earning.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{earning.rides?.pickup_address || "Course"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(earning.created_at)}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="font-bold text-green-600">+{formatAmount(earning.net_amount || 0)} FCFA</p>
                      <p className="text-xs text-muted-foreground">
                        Commission: {formatAmount(earning.commission_amount || 0)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
