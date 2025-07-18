// app/[locale]/auth/signin/page.tsx

import { AuthForm } from "@/components/auth/auth-form"
import { getDictionary } from "@/i18n/get-dictionary"
import type { Locale } from "@/i18n/config"
import Image from "next/image"
import Link from "next/link"

interface SignInPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params

  let dictionary
  try {
    dictionary = await getDictionary(locale)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    dictionary = {
      auth: {
        signIn: "Iniciar Sesión",
        email: "Correo Electrónico",
        password: "Contraseña",
        forgotPassword: "¿Olvidaste tu contraseña?",
        noAccount: "¿No tienes cuenta?",
        signUp: "Registrarse",
        signInWithGoogle: "Continuar con Google",
        signInWithGitHub: "Continuar con GitHub",
      },
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      {/* Columna Izquierda: Imagen Corporativa */}
      <div className="hidden bg-gray-100 lg:block dark:bg-slate-900">
        <Image
          src="/comunity.png" // Reemplaza esto con tu imagen
          alt="Imagen de una pueblo conectado con HolaBarrio"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
      {/* Columna Derecha: Formulario */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href={`/${locale}`} className="flex justify-center mb-4">
               <Image src="/logo.png" alt="HolaBarrio Logo" width={48} height={48} />
            </Link>
            <AuthForm mode="signin" locale={locale} dictionary={dictionary} />
          </div>
        </div>
      </div>
    </div>
  )
}