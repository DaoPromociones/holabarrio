import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales, defaultLocale } from "@/i18n/config"

/**
 * Middleware de Next.js para manejar la internacionalización (i18n)
 *
 * Este middleware se ejecuta en cada petición y se encarga de:
 * - Detectar el idioma de la URL
 * - Redirigir a rutas con el idioma correcto
 * - Manejar la ruta raíz redirigiendo al idioma por defecto
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignorar archivos estáticos y rutas de API para evitar procesamiento innecesario
  if (
    pathname.startsWith("/_next") || // Archivos de Next.js
    pathname.startsWith("/api") || // Rutas de API
    pathname.includes(".") || // Archivos con extensión (imágenes, CSS, etc.)
    pathname.startsWith("/favicon") // Favicon
  ) {
    return NextResponse.next()
  }

  // Si es la ruta raíz, redirigir al idioma por defecto
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // Verificar si la ruta tiene un locale válido
  // Comprueba si la URL comienza con alguno de los idiomas configurados
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Si no tiene locale, redirigir agregando el locale por defecto
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
  }

  // Continuar con la petición normal si todo está correcto
  return NextResponse.next()
}

// Configuración del matcher para definir en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de petición excepto las que comienzan con:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo de favicon)
     * - cualquier ruta con un punto (archivos estáticos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.).*)',
  ],
}
