import type { PuntoSeleccionado, InfoRuta } from "@/types/mapa-types"

// Tipos para estadísticas avanzadas
export interface ElevationPoint {
  lat: number
  lng: number
  elevation: number
  distance: number // distancia acumulada desde el inicio
}

export interface RouteStatistics {
  elevation: {
    min: number
    max: number
    gain: number // ganancia total de elevación
    loss: number // pérdida total de elevación
    profile: ElevationPoint[]
  }
  difficulty: {
    score: number // 1-10
    level: "Fácil" | "Moderado" | "Difícil" | "Muy Difícil" | "Extremo"
    factors: {
      distance: number
      elevation: number
      steepness: number
      terrain: number
    }
  }
  terrain: {
    surface: "Urbano" | "Mixto" | "Natural"
    avgSlope: number // pendiente promedio en %
    maxSlope: number // pendiente máxima en %
    steepSections: number // número de secciones empinadas
  }
  performance: {
    estimatedTime: {
      walking: number // minutos
      cycling: number // minutos
      running: number // minutos
    }
    calories: {
      walking: number
      cycling: number
      running: number
    }
    pace: {
      walking: number // min/km
      cycling: number // min/km
      running: number // min/km
    }
  }
  safety: {
    riskLevel: "Bajo" | "Medio" | "Alto"
    factors: string[]
    recommendations: string[]
  }
}

// Función para simular datos de elevación realistas para Blanes
function getElevationForPoint(lat: number, lng: number): number {
  // Blanes está en la costa, con elevaciones que van desde el nivel del mar hasta ~200m
  // Simulamos elevación basada en la distancia del mar y variaciones locales

  const coastLat = 41.6718 // Aproximadamente la línea de costa
  const coastLng = 2.7923

  // Distancia del punto a la costa (aproximada)
  const distanceFromCoast = Math.sqrt(Math.pow((lat - coastLat) * 111000, 2) + Math.pow((lng - coastLng) * 85000, 2))

  // Elevación base según distancia de la costa
  const baseElevation = Math.min(distanceFromCoast * 0.02, 150)

  // Añadir variaciones locales usando funciones trigonométricas
  const localVariation = Math.sin(lat * 1000) * 15 + Math.cos(lng * 1000) * 10 + Math.sin((lat + lng) * 500) * 8

  // Asegurar que la elevación mínima sea 0 (nivel del mar)
  const elevation = Math.max(0, baseElevation + localVariation)

  return Math.round(elevation)
}

// Función para calcular perfil de elevación
function calculateElevationProfile(puntos: PuntoSeleccionado[]): ElevationPoint[] {
  const profile: ElevationPoint[] = []
  let distanceAccumulated = 0

  for (let i = 0; i < puntos.length; i++) {
    const punto = puntos[i]
    const elevation = getElevationForPoint(punto.lat, punto.lng)

    if (i > 0) {
      const prevPunto = puntos[i - 1]
      const segmentDistance = calcularDistanciaHaversine(prevPunto.lat, prevPunto.lng, punto.lat, punto.lng)
      distanceAccumulated += segmentDistance
    }

    profile.push({
      lat: punto.lat,
      lng: punto.lng,
      elevation,
      distance: distanceAccumulated,
    })
  }

  return profile
}

// Función auxiliar para calcular distancia (reutilizada)
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

// Función para calcular estadísticas de elevación
function calculateElevationStats(profile: ElevationPoint[]) {
  if (profile.length === 0) {
    return { min: 0, max: 0, gain: 0, loss: 0 }
  }

  let min = profile[0].elevation
  let max = profile[0].elevation
  let gain = 0
  let loss = 0

  for (let i = 1; i < profile.length; i++) {
    const current = profile[i].elevation
    const previous = profile[i - 1].elevation

    min = Math.min(min, current)
    max = Math.max(max, current)

    const diff = current - previous
    if (diff > 0) {
      gain += diff
    } else {
      loss += Math.abs(diff)
    }
  }

  return { min, max, gain, loss }
}

// Función para calcular dificultad
function calculateDifficulty(
  distanceKm: number,
  elevationGain: number,
  maxSlope: number,
  avgSlope: number,
): RouteStatistics["difficulty"] {
  // Factores de dificultad (0-10 cada uno)
  const distanceFactor = Math.min(10, distanceKm * 2) // 5km = factor 10
  const elevationFactor = Math.min(10, elevationGain / 50) // 500m = factor 10
  const steepnessFactor = Math.min(10, maxSlope / 2) // 20% = factor 10
  const terrainFactor = 3 // Urbano = factor bajo

  // Puntuación total (promedio ponderado)
  const totalScore = distanceFactor * 0.3 + elevationFactor * 0.4 + steepnessFactor * 0.2 + terrainFactor * 0.1

  let level: RouteStatistics["difficulty"]["level"]
  if (totalScore <= 2) level = "Fácil"
  else if (totalScore <= 4) level = "Moderado"
  else if (totalScore <= 6) level = "Difícil"
  else if (totalScore <= 8) level = "Muy Difícil"
  else level = "Extremo"

  return {
    score: Math.round(totalScore * 10) / 10,
    level,
    factors: {
      distance: Math.round(distanceFactor * 10) / 10,
      elevation: Math.round(elevationFactor * 10) / 10,
      steepness: Math.round(steepnessFactor * 10) / 10,
      terrain: terrainFactor,
    },
  }
}

// Función para calcular estadísticas de terreno
function calculateTerrainStats(profile: ElevationPoint[]): RouteStatistics["terrain"] {
  if (profile.length < 2) {
    return {
      surface: "Urbano",
      avgSlope: 0,
      maxSlope: 0,
      steepSections: 0,
    }
  }

  let totalSlope = 0
  let maxSlope = 0
  let steepSections = 0

  for (let i = 1; i < profile.length; i++) {
    const elevationDiff = profile[i].elevation - profile[i - 1].elevation
    const distanceDiff = profile[i].distance - profile[i - 1].distance

    if (distanceDiff > 0) {
      const slope = Math.abs((elevationDiff / distanceDiff) * 100)
      totalSlope += slope
      maxSlope = Math.max(maxSlope, slope)

      if (slope > 8) {
        // Pendiente > 8% se considera empinada
        steepSections++
      }
    }
  }

  const avgSlope = totalSlope / (profile.length - 1)

  return {
    surface: "Urbano", // En Blanes, principalmente urbano
    avgSlope: Math.round(avgSlope * 10) / 10,
    maxSlope: Math.round(maxSlope * 10) / 10,
    steepSections,
  }
}

// Función para calcular estadísticas de rendimiento
function calculatePerformanceStats(
  distanceKm: number,
  elevationGain: number,
  avgSlope: number,
): RouteStatistics["performance"] {
  // Velocidades base (km/h)
  const baseSpeedWalking = 5
  const baseSpeedCycling = 20
  const baseSpeedRunning = 10

  // Factores de ajuste por elevación y pendiente
  const elevationFactor = 1 + (elevationGain / 1000) * 0.3 // +30% por cada 1000m
  const slopeFactor = 1 + (avgSlope / 10) * 0.2 // +20% por cada 10% de pendiente

  const adjustmentFactor = elevationFactor * slopeFactor

  // Tiempos ajustados (en minutos)
  const walkingTime = (distanceKm / baseSpeedWalking) * 60 * adjustmentFactor
  const cyclingTime = (distanceKm / baseSpeedCycling) * 60 * (adjustmentFactor * 0.7) // Ciclismo menos afectado
  const runningTime = (distanceKm / baseSpeedRunning) * 60 * adjustmentFactor

  // Cálculo de calorías (aproximado)
  const walkingCalories = distanceKm * 50 + elevationGain * 0.5
  const cyclingCalories = distanceKm * 30 + elevationGain * 0.3
  const runningCalories = distanceKm * 80 + elevationGain * 0.8

  return {
    estimatedTime: {
      walking: Math.round(walkingTime),
      cycling: Math.round(cyclingTime),
      running: Math.round(runningTime),
    },
    calories: {
      walking: Math.round(walkingCalories),
      cycling: Math.round(cyclingCalories),
      running: Math.round(runningCalories),
    },
    pace: {
      walking: Math.round((walkingTime / distanceKm) * 10) / 10,
      cycling: Math.round((cyclingTime / distanceKm) * 10) / 10,
      running: Math.round((runningTime / distanceKm) * 10) / 10,
    },
  }
}

// Función para evaluar seguridad
function calculateSafetyStats(
  terrain: RouteStatistics["terrain"],
  difficulty: RouteStatistics["difficulty"],
): RouteStatistics["safety"] {
  const factors: string[] = []
  const recommendations: string[] = []

  let riskLevel: "Bajo" | "Medio" | "Alto" = "Bajo"

  // Evaluar factores de riesgo
  if (terrain.maxSlope > 15) {
    factors.push("Pendientes pronunciadas")
    recommendations.push("Usar calzado con buena tracción")
    riskLevel = "Medio"
  }

  if (difficulty.score > 6) {
    factors.push("Ruta físicamente exigente")
    recommendations.push("Llevar agua suficiente y descansar regularmente")
    riskLevel = "Alto"
  }

  if (terrain.steepSections > 3) {
    factors.push("Múltiples secciones empinadas")
    recommendations.push("Planificar paradas de descanso")
  }

  // Recomendaciones generales
  recommendations.push("Verificar el clima antes de salir")
  recommendations.push("Informar a alguien sobre tu ruta")

  if (factors.length === 0) {
    factors.push("Ruta urbana segura")
  }

  return {
    riskLevel,
    factors,
    recommendations,
  }
}

// Función principal para calcular todas las estadísticas
export function calculateRouteStatistics(
  puntosSeleccionados: PuntoSeleccionado[],
  infoRuta: InfoRuta,
): RouteStatistics {
  const profile = calculateElevationProfile(puntosSeleccionados)
  const elevationStats = calculateElevationStats(profile)
  const terrainStats = calculateTerrainStats(profile)
  const distanceKm = infoRuta.distancia / 1000

  const difficulty = calculateDifficulty(distanceKm, elevationStats.gain, terrainStats.maxSlope, terrainStats.avgSlope)

  const performance = calculatePerformanceStats(distanceKm, elevationStats.gain, terrainStats.avgSlope)

  const safety = calculateSafetyStats(terrainStats, difficulty)

  return {
    elevation: {
      ...elevationStats,
      profile,
    },
    difficulty,
    terrain: terrainStats,
    performance,
    safety,
  }
}
