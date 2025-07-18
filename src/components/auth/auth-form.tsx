"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react" // <-- 1. IMPORTAMOS DE NEXTAUTH
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import Link from "next/link"
import type { Locale } from "@/i18n/config"

interface AuthFormProps {
  mode: "signin" | "signup"
  locale: Locale
  dictionary: any
}

export function AuthForm({ mode, locale, dictionary }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  // 2. ELIMINAMOS TODA LA LÓGICA DE SUPABASE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (mode === "signup") {
      // La lógica de registro requerirá un endpoint de API propio.
      // Lo implementaremos en el siguiente paso.
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden")
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: email.split('@')[0] }), // Enviamos un nombre por defecto
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Algo fue mal');
        
        // Si el registro es exitoso, iniciamos sesión automáticamente
        await signIn('credentials', { email, password, callbackUrl: `/${locale}/dashboard` });

      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }

    } else {
      // 3. USAMOS EL signIn DE NEXTAUTH PARA "credentials"
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        setLoading(false);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoading(true)
    // 4. USAMOS EL signIn DE NEXTAUTH PARA OAUTH
    await signIn(provider, {
      callbackUrl: `/${locale}/dashboard`,
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "signin" ? dictionary.auth.signIn : dictionary.auth.signUp}</CardTitle>
        <CardDescription>{mode === "signin" ? "Ingresa a tu cuenta" : "Crea una nueva cuenta"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 5. ELIMINAMOS LOS AVISOS DE CONFIGURACIÓN DE SUPABASE */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{dictionary.auth.email}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dictionary.auth.password}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{dictionary.auth.confirmPassword}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : mode === "signin" ? dictionary.auth.signIn : dictionary.auth.signUp}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleOAuthSignIn("google")} disabled={loading}>
            Google
          </Button>
          <Button variant="outline" onClick={() => handleOAuthSignIn("github")} disabled={loading}>
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        <div className="text-center text-sm">
          {mode === "signin" ? (
            <>
              {dictionary.auth.noAccount}{" "}
              <Link href={`/${locale}/auth/signup`} className="underline">
                {dictionary.auth.signUp}
              </Link>
            </>
          ) : (
            <>
              {dictionary.auth.hasAccount}{" "}
              <Link href={`/${locale}/auth/signin`} className="underline">
                {dictionary.auth.signIn}
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}