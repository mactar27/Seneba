import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SenebaLogo } from "@/components/seneba-logo"
import { Mail, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-primary/5 to-background">
      <SenebaLogo className="h-12 mb-8" />

      <Card className="w-full max-w-sm border-0 shadow-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>A confirmation link has been sent to your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-5 w-5" />
            <span>Check your inbox</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Cliquez sur le lien dans l'email pour activer votre compte et commencer votre inscription
          </p>
          <Button asChild variant="outline" className="mt-4 bg-transparent">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
