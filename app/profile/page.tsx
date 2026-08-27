"use client"

import { getDriverProfilee, updateDriverProfilee } from "@/lib/actions/driver"
import { getSession, logout } from "@/lib/actions/auth"
import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Driver } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { ArrowLeft, Car, Star, Phone, Mail, LogOut, ChevronRight, Shield, HelpCircle, FileText, Edit2, Save, X, Loader2, Camera } from "lucide-react"
import Link from "next/link"

export default function ProfileePage() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profileImageUrl: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    licensePlate: "",
  })
  const router = useRouter()

  const loadData = useCallback(async () => {
    const [driverData, session] = await Promise.all([
      getDriverProfilee(),
      getSession()
    ])

    if (!driverData) {
      router.push("/auth/login")
      return
    }

    setEmail(session?.user?.email || null)
    setDriver(driverData)
    setFormData({
      fullName: driverData.full_name,
      phone: driverData.phone,
      profileImageUrl: driverData.profile_image_url || "/images/mactar-profile.png",
      vehicleMake: driverData.vehicle_make || "",
      vehicleModel: driverData.vehicle_model || "",
      vehicleYear: driverData.vehicle_year?.toString() || "",
      vehicleColor: driverData.vehicle_color || "",
      licensePlate: driverData.license_plate || "",
    })
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleLogout = async () => {
    await logout()
  }

  const handleSave = async () => {
    if (!driver) return
    setIsSaving(true)
    const result = await updateDriverProfilee(formData)
    setIsSaving(false)
    if (result.success) {
      setIsEditing(false)
      loadData()
    } else {
      alert(result.error || "Erreur lors de la mise à jour")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({ ...prev, profileImageUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!driver) return null

  const initials = driver.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex min-h-svh flex-col bg-background pb-20 safe-area-top safe-area-bottom">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Retour</span>
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Mon profil</h1>
          </div>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-primary gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Profilee Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage 
                  src={isEditing ? formData.profileImageUrl : (driver.profile_image_url || "/images/mactar-profile.png")} 
                  alt={driver.full_name} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">{initials}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="h-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Appuyez sur la photo pour la modifier</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{driver.full_name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="font-medium">{Number(driver.average_rating || 0).toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{driver.total_rides} courses</span>
                  </div>
                </>
              )}
            </div>
            {!isEditing && driver.is_verified && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Shield className="h-4 w-4" />
                Vérifié
              </div>
            )}
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="divide-y p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="h-10"
              />
            ) : (
              <p className="font-medium pl-6">{driver.phone}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 pt-4">
            <Label className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <p className="font-medium pl-6 text-muted-foreground">{email}</p>
            {isEditing && <p className="text-[10px] text-muted-foreground pl-6 italic">Email cannot be changed</p>}
          </div>
        </Card>

        {/* Vehicle Info */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">My vehicle</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="grid gap-1.5">
              <Label htmlFor="vehicleMake">Marque</Label>
              {isEditing ? (
                <Input
                  id="vehicleMake"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                  className="h-10"
                />
              ) : (
                <p className="font-medium">{driver.vehicle_make}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="vehicleModel">Model</Label>
              {isEditing ? (
                <Input
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="h-10"
                />
              ) : (
                <p className="font-medium">{driver.vehicle_model}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="vehicleYear">Year</Label>
              {isEditing ? (
                <Input
                  id="vehicleYear"
                  name="vehicleYear"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  className="h-10"
                />
              ) : (
                <p className="font-medium">{driver.vehicle_year}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="vehicleColor">Couleur</Label>
              {isEditing ? (
                <Input
                  id="vehicleColor"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  className="h-10"
                />
              ) : (
                <p className="font-medium">{driver.vehicle_color}</p>
              )}
            </div>
            <div className="col-span-2 grid gap-1.5">
              <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
              {isEditing ? (
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className="h-10"
                />
              ) : (
                <p className="font-medium">{driver.license_plate}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="divide-y">
          <Link href="/support" className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span>Aide et support</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link href="/terms" className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>Conditions d'utilisation</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log out
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
