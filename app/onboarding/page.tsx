"use client"

import type React from "react"
import { getDriverProfilee, completeOnboarding } from "@/lib/actions/driver"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SenebaLogo } from "@/components/seneba-logo"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Car, User, FileText, CheckCircle2 } from "lucide-react"

type Step = "personal" | "vehicle" | "documents" | "complete"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    licensePlate: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const driver = await getDriverProfilee()
      if (driver) {
        setUserId(driver.user_id)
        setFormData(prev => ({
          ...prev,
          fullName: driver.full_name,
          phone: driver.phone
        }))
        if (driver.vehicle_make) {
          router.push("/dashboard")
        }
      } else {
        router.push("/auth/login")
      }
    }
    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    try {
      console.log("handleSubmit starting, userId:", userId)
      if (!userId) {
        setError("Session expirée ou non valide. Veuillez vous reconnecter.")
        return
      }
      setIsLoading(true)
      setError(null)

      const data = new FormData()
      data.append("fullName", formData.fullName)
      data.append("phone", formData.phone)
      data.append("vehicleMake", formData.vehicleMake)
      data.append("vehicleModel", formData.vehicleModel)
      data.append("vehicleYear", formData.vehicleYear)
      data.append("vehicleColor", formData.vehicleColor)
      data.append("licensePlate", formData.licensePlate)

      console.log("Calling completeOnboarding...")
      const result = await completeOnboarding(data)
      console.log("Result from completeOnboarding:", result)
      
      if (result.error) throw new Error(result.error)
      setStep("complete")
    } catch (err: any) {
      console.error("handleSubmit error:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { id: "personal", label: "Personnel", icon: User },
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "documents", label: "Documents", icon: FileText },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  if (step === "complete") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Registration complete!</h1>
          <p className="text-muted-foreground mb-8">Your SENEBA driver account is ready</p>
          <Button onClick={() => router.push("/dashboard")} className="h-12 px-8">
            Accéder au tableau de bord
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-primary/5 to-background safe-area-top">
      <header className="flex items-center justify-center py-6">
        <SenebaLogo className="h-10" />
      </header>

      {/* Progress Steps */}
      <div className="flex justify-center px-6 mb-6">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              {i < steps.length - 1 && (
                <div className={`h-1 w-8 mx-1 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 px-6 pb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === "personal" && "Informations personnelles"}
              {step === "vehicle" && "Informations véhicule"}
              {step === "documents" && "Documents"}
            </CardTitle>
            <CardDescription>
              {step === "personal" && "Complétez votre profil chauffeur"}
              {step === "vehicle" && "Ajoutez les détails de votre véhicule"}
              {step === "documents" && "Vérifiez vos informations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "personal" && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Amadou Diallo"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+220 7XX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={() => setStep("vehicle")}
                  className="h-12 mt-4"
                  disabled={!formData.fullName || !formData.phone}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === "vehicle" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleMake">Marque</Label>
                    <Input
                      id="vehicleMake"
                      name="vehicleMake"
                      placeholder="Toyota"
                      value={formData.vehicleMake}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      placeholder="Corolla"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleYear">Year</Label>
                    <Input
                      id="vehicleYear"
                      name="vehicleYear"
                      type="number"
                      placeholder="2020"
                      value={formData.vehicleYear}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleColor">Couleur</Label>
                    <Input
                      id="vehicleColor"
                      name="vehicleColor"
                      placeholder="Blanc"
                      value={formData.vehicleColor}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
                  <Input
                    id="licensePlate"
                    name="licensePlate"
                    placeholder="BJL 1234 A"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep("personal")} className="h-12 flex-1">
                    Retour
                  </Button>
                  <Button
                    onClick={() => setStep("documents")}
                    className="h-12 flex-1"
                    disabled={!formData.vehicleMake || !formData.vehicleModel || !formData.licensePlate}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === "documents" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h3 className="font-semibold mb-3">Summary</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Nom</dt>
                      <dd className="font-medium">{formData.fullName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd className="font-medium">{formData.phone}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Vehicle</dt>
                      <dd className="font-medium">
                        {formData.vehicleMake} {formData.vehicleModel}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Plaque</dt>
                      <dd className="font-medium">{formData.licensePlate}</dd>
                    </div>
                  </dl>
                </div>
                {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep("vehicle")} className="h-12 flex-1">
                    Retour
                  </Button>
                  <Button onClick={handleSubmit} className="h-12 flex-1" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Terminer"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
