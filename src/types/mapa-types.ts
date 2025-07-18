// Tipos para el mapa urbano

export interface PuntoUrbano {
  id: string
  lat: number
  lng: number
  type: "sensor" | "poi" | "incident"
  value?: number
  name: string
  description?: string
}

export interface PuntoSeleccionado {
  id: string
  lat: number
  lng: number
  name: string
  order: number
}

export interface InfoRuta {
  distancia: number // en metros
  tiempoEstimado: number // en minutos
  puntos: [number, number][]
}
