"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, ChevronDown } from "lucide-react"
import { locales, localeNames, type Locale } from "@/i18n/config"

// Propiedades del componente selector de idioma
interface LanguageSwitcherProps {
  currentLocale: Locale // Idioma actualmente seleccionado
  variant?: "default" | "mobile" // Variante del componente (escritorio o móvil)
}

/**
 * Componente para cambiar el idioma de la aplicación
 *
 * Características:
 * - Dropdown para escritorio
 * - Botones para móvil
 * - Detección de orientación
 * - Navegación automática al cambiar idioma
 */
export function LanguageSwitcher({ currentLocale, variant = "default" }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLandscape, setIsLandscape] = useState(false)

  // Detectar orientación del dispositivo para adaptar la interfaz
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    // Comprobar orientación inicial
    checkOrientation()

    // Escuchar cambios de orientación
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    // Limpiar listeners al desmontar
    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  /**
   * Función para cambiar el idioma de la aplicación
   *
   * @param newLocale - Nuevo idioma a establecer
   */
  const switchLanguage = (newLocale: Locale) => {
    // Dividir la URL actual en segmentos
    const segments = pathname.split("/")
    // Reemplazar el primer segmento (idioma) con el nuevo idioma
    segments[1] = newLocale
    // Reconstruir la URL
    const newPath = segments.join("/")

    // Log para debugging
    console.log("Switching language:", {
      currentPath: pathname,
      newLocale,
      newPath,
    })

    // Navegar a la nueva URL con el idioma cambiado
    router.push(newPath)
  }

  // Renderizar versión móvil con botones
  if (variant === "mobile") {
    return (
      <div
        className={`flex justify-center py-2 space-x-2 border-t border-gray-200 mt-2 ${isLandscape ? "px-4" : "px-0"}`}
      >
        {locales.map((locale) => (
          <Button
            key={locale}
            variant={currentLocale === locale ? "default" : "outline"}
            size="sm"
            className={`flex-1 max-w-[120px] ${
              currentLocale === locale ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"
            }`}
            onClick={() => switchLanguage(locale)}
          >
            <Globe className="h-4 w-4 mr-2 opacity-70" />
            {localeNames[locale]}
          </Button>
        ))}
      </div>
    )
  }

  // Renderizar versión dropdown para escritorio
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 sm:px-3 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Globe className="h-4 w-4 mr-1 sm:mr-2" />
          {/* Mostrar nombre completo en pantallas grandes, abreviado en pequeñas */}
          <span className="hidden sm:inline text-sm font-medium">{localeNames[currentLocale]}</span>
          <span className="sm:hidden text-sm font-bold">{currentLocale.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] bg-white border border-gray-200 shadow-lg rounded-md"
        sideOffset={5}
      >
        {/* Renderizar opción para cada idioma disponible */}
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
              currentLocale === locale ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
            }`}
          >
            <Globe className="h-4 w-4 mr-2 opacity-60" />
            <span className="flex-1">{localeNames[locale]}</span>
            {/* Mostrar checkmark para el idioma actual */}
            {currentLocale === locale && <span className="ml-2 text-blue-600 font-bold">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
