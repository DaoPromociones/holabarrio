import type { PuntoSeleccionado } from "@/types/mapa-types"
import type { RutaRealista, InstruccionNavegacion } from "@/types/superapp-types"

// Simulador de API de routing realista (en producción usaríamos OpenRouteService, Mapbox, etc.)
export async function calcularRutaRealista(
  puntos: PuntoSeleccionado[],
  tipoTransporte: "caminar" | "ciclismo" | "conducir" | "transporte_publico" = "caminar",
  evitarEscalones = false,
  preferirSombra = false,
): Promise<RutaRealista> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (puntos.length < 2) {
    throw new Error("Se necesitan al menos 2 puntos para calcular una ruta")
  }

  // Simular cálculo de ruta realista siguiendo calles
  const rutaSimulada = simularRutaPorCalles(puntos, tipoTransporte, evitarEscalones, preferirSombra)

  return rutaSimulada
}

function simularRutaPorCalles(
  puntos: PuntoSeleccionado[],
  tipoTransporte: "caminar" | "ciclismo" | "conducir" | "transporte_publico",
  evitarEscalones: boolean,
  preferirSombra: boolean,
): RutaRealista {
  const puntosRuta: [number, number][] = []
  const instrucciones: InstruccionNavegacion[] = []
  let distanciaTotal = 0
  let duracionTotal = 0

  // Velocidades por tipo de transporte (km/h)
  const velocidades = {
    caminar: 5,
    ciclismo: 15,
    conducir: 30,
    transporte_publico: 12,
  }

  const velocidad = velocidades[tipoTransporte]

  for (let i = 0; i < puntos.length - 1; i++) {
    const origen = puntos[i]
    const destino = puntos[i + 1]

    // Simular puntos intermedios siguiendo calles (en realidad usaríamos una API de routing)
    const segmentoRuta = generarSegmentoRutaRealista(origen, destino, tipoTransporte, evitarEscalones)

    puntosRuta.push(...segmentoRuta.puntos)
    instrucciones.push(...segmentoRuta.instrucciones)
    distanciaTotal += segmentoRuta.distancia
    duracionTotal += segmentoRuta.duracion
  }

  // Simular datos adicionales
  const superficies = simularSuperficies(tipoTransporte, evitarEscalones)
  const accesibilidad = evaluarAccesibilidad(puntosRuta, evitarEscalones)
  const alertas = generarAlertas(puntosRuta, tipoTransporte)
  const elevacion = simularElevacion(puntosRuta)

  return {
    puntos: puntosRuta,
    instrucciones,
    distancia: distanciaTotal,
    duracion: duracionTotal,
    tipoTransporte,
    elevacion,
    superficies,
    accesibilidad,
    puntosInteres: [],
    alertas,
  }
}

function generarSegmentoRutaRealista(
  origen: PuntoSeleccionado,
  destino: PuntoSeleccionado,
  tipoTransporte: string,
  evitarEscalones: boolean,
) {
  const puntos: [number, number][] = []
  const instrucciones: InstruccionNavegacion[] = []

  // Simular puntos intermedios (en realidad vendría de la API de routing)
  const numPuntosIntermedios = Math.floor(Math.random() * 5) + 3

  for (let j = 0; j <= numPuntosIntermedios; j++) {
    const factor = j / numPuntosIntermedios

    // Añadir variación para simular calles reales (no línea recta)
    const variacionLat = (Math.random() - 0.5) * 0.001 * (1 - Math.abs(factor - 0.5) * 2)
    const variacionLng = (Math.random() - 0.5) * 0.001 * (1 - Math.abs(factor - 0.5) * 2)

    const lat = origen.lat + (destino.lat - origen.lat) * factor + variacionLat
    const lng = origen.lng + (destino.lng - origen.lng) * factor + variacionLng

    puntos.push([lat, lng])

    // Generar instrucciones de navegación
    if (j > 0) {
      const callesBlanes = [
        "Carrer de la Pau",
        "Avinguda de Catalunya",
        "Carrer Major",
        "Passeig de Mar",
        "Carrer de Sant Joan",
        "Carrer de la Muralla",
        "Avinguda de Europa",
        "Carrer de la Plantera",
        "Carrer de Ponent",
        "Carrer de Llevant",
      ]

      const direcciones: InstruccionNavegacion["direccion"][] = ["straight", "left", "right"]
      const direccion = j === 1 ? "straight" : direcciones[Math.floor(Math.random() * direcciones.length)]

      const distanciaSegmento = calcularDistanciaHaversine(puntos[j - 1][0], puntos[j - 1][1], lat, lng)

      const duracionSegmento = (distanciaSegmento / 1000) * (60 / 5) // 5 km/h caminando

      let instruccionTexto = ""
      switch (direccion) {
        case "straight":
          instruccionTexto = `Continúa recto por ${callesBlanes[Math.floor(Math.random() * callesBlanes.length)]}`
          break
        case "left":
          instruccionTexto = `Gira a la izquierda en ${callesBlanes[Math.floor(Math.random() * callesBlanes.length)]}`
          break
        case "right":
          instruccionTexto = `Gira a la derecha en ${callesBlanes[Math.floor(Math.random() * callesBlanes.length)]}`
          break
      }

      instrucciones.push({
        distancia: distanciaSegmento,
        duracion: duracionSegmento,
        instruccion: instruccionTexto,
        direccion,
        nombreCalle: callesBlanes[Math.floor(Math.random() * callesBlanes.length)],
        coordenada: [lat, lng],
      })
    }
  }

  const distanciaTotal = puntos.reduce((total, punto, index) => {
    if (index === 0) return 0
    return total + calcularDistanciaHaversine(puntos[index - 1][0], puntos[index - 1][1], punto[0], punto[1])
  }, 0)

  const duracionTotal = (distanciaTotal / 1000) * (60 / 5) // minutos

  return {
    puntos,
    instrucciones,
    distancia: distanciaTotal,
    duracion: duracionTotal,
  }
}

function calcularDistanciaHaversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function simularSuperficies(
  tipoTransporte: string,
  evitarEscalones: boolean,
): ("asfalto" | "adoquin" | "tierra" | "escalones")[] {
  const superficies: ("asfalto" | "adoquin" | "tierra" | "escalones")[] = []

  // Blanes tiene mucho adoquín en el centro histórico
  const probabilidades = {
    asfalto: tipoTransporte === "driving" ? 0.8 : 0.4,
    adoquin: 0.4,
    tierra: 0.1,
    escalones: evitarEscalones ? 0 : 0.1,
  }

  for (let i = 0; i < 10; i++) {
    const rand = Math.random()
    if (rand < probabilidades.asfalto) superficies.push("asfalto")
    else if (rand < probabilidades.asfalto + probabilidades.adoquin) superficies.push("adoquin")
    else if (rand < probabilidades.asfalto + probabilidades.adoquin + probabilidades.tierra) superficies.push("tierra")
    else superficies.push("escalones")
  }

  return superficies
}

function evaluarAccesibilidad(puntos: [number, number][], evitarEscalones: boolean) {
  const problemas: string[] = []

  if (!evitarEscalones && Math.random() > 0.7) {
    problemas.push("Escalones en el tramo cerca de la iglesia")
  }

  if (Math.random() > 0.8) {
    problemas.push("Acera estrecha en algunos tramos")
  }

  if (Math.random() > 0.9) {
    problemas.push("Pendiente pronunciada")
  }

  return {
    sillaRuedas: evitarEscalones && problemas.length === 0,
    problemasMovilidad: problemas,
  }
}

function generarAlertas(puntos: [number, number][], tipoTransporte: string): string[] {
  const alertas: string[] = []

  if (Math.random() > 0.7) {
    alertas.push("Obras en Carrer Major - posibles retrasos")
  }

  if (Math.random() > 0.8) {
    alertas.push("Evento en la plaza - mayor afluencia de personas")
  }

  if (tipoTransporte === "ciclismo" && Math.random() > 0.6) {
    alertas.push("Zona de tráfico intenso - precaución en bicicleta")
  }

  return alertas
}

function simularElevacion(puntos: [number, number][]): number[] {
  // Blanes tiene elevaciones desde el nivel del mar hasta unos 200m
  return puntos.map((punto, index) => {
    const baseElevation = Math.max(0, (punto[0] - 41.6718) * 1000 + Math.sin(index) * 10)
    return Math.round(baseElevation)
  })
}

// Función para obtener transporte público
export async function obtenerTransportePublico(origen: [number, number], destino: [number, number]) {
  // Simular datos de transporte público
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    rutas: [
      {
        linea: "L1 - Línea Azul",
        paradas: ["Estación Central", "Plaza Mayor", "Hospital", "Universidad"],
        duracion: 25,
        precio: 1.5,
        frecuencia: "Cada 15 minutos",
        proximoAutobus: "5 minutos",
      },
      {
        linea: "L2 - Línea Verde",
        paradas: ["Puerto", "Centro Comercial", "Polideportivo"],
        duracion: 18,
        precio: 1.5,
        frecuencia: "Cada 20 minutos",
        proximoAutobus: "12 minutos",
      },
    ],
  }
}
