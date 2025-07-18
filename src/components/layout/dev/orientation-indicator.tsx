//components/orientation-indicator.tsx


"use client"

import { useState, useEffect } from "react"
import { Smartphone, Rotate3dIcon as Rotate } from "lucide-react"

/**
 * Componente indicador de orientación del dispositivo
 *
 * Muestra información sobre:
 * - Orientación actual (Portrait/Landscape)
 * - Dimensiones de la pantalla
 * - Solo visible en desarrollo
 */
export function OrientationIndicator() {
  // Estados para tracking de orientación y dimensiones
  const [isLandscape, setIsLandscape] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    /**
     * Función para verificar la orientación actual del dispositivo
     * Compara ancho vs alto para determinar la orientación
     */
    const checkOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Si el ancho es mayor que el alto, está en modo horizontal
      setIsLandscape(width > height)
      setDimensions({ width, height })
    }

    // Verificar orientación al montar el componente
    checkOrientation()

    // Escuchar cambios de tamaño de ventana y orientación
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    // Cleanup: remover listeners al desmontar
    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  // Solo mostrar en desarrollo, no en producción
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-16 right-4 z-50 flex items-center justify-center rounded-full bg-black bg-opacity-75 p-3 font-mono text-xs text-white">
      <div className="flex items-center">
        {/* Icono que cambia según la orientación */}
        {isLandscape ? (
          <Rotate className="h-4 w-4 mr-2 rotate-90" /> // Icono rotado para landscape
        ) : (
          <Smartphone className="h-4 w-4 mr-2" /> // Icono de teléfono para portrait
        )}
        <span>
          {/* Mostrar orientación y dimensiones actuales */}
          {isLandscape ? "Landscape" : "Portrait"} ({dimensions.width}x{dimensions.height})
        </span>
      </div>
    </div>
  )
}
