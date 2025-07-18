"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Importamos el componente de mapa dinámicamente para evitar errores de SSR
const MapaUrbano = dynamic(() => import("@/components/mapa/mapa-urbano"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
})

export default function MapaPage() {
  return (
    <div className="h-screen flex flex-col">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <MapaUrbano />
      </Suspense>
    </div>
  )
}