import type { PuntoUrbano, PuntoSeleccionado } from "../types/mapa-types"
import type { RouteStatistics } from "./route-analytics"
import type {
  UserPreferences,
  CurrentConditions,
  RouteSuggestion,
  AdaptiveRouteAnalysis,
} from "@/types/adaptive-routing"

// Simulador de condiciones actuales
export function getCurrentConditions(): CurrentConditions {
  const hour = new Date().getHours()
  const dayOfWeek = new Date().getDay()

  // Simular condiciones meteorológicas
  const weatherConditions = ["soleado", "nublado", "lluvia", "viento", "niebla"] as const
  const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

  return {
    weather: {
      condition: randomWeather,
      temperature: 15 + Math.random() * 15, // 15-30°C
      windSpeed: Math.random() * 20, // 0-20 km/h
      precipitation: randomWeather === "lluvia" ? 60 + Math.random() * 40 : Math.random() * 30,
      visibility: randomWeather === "niebla" ? "mala" : randomWeather === "lluvia" ? "regular" : "excelente",
    },
    traffic: {
      level: (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? "alto" : "moderado",
      incidents: Math.random() > 0.7 ? ["Obras en Calle Principal"] : [],
      peakHours: (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19),
    },
    pointStatus: {}, // Se llenará dinámicamente
    timeOfDay: hour < 6 ? "madrugada" : hour < 12 ? "mañana" : hour < 17 ? "mediodia" : hour < 21 ? "tarde" : "noche",
    dayOfWeek: dayOfWeek === 0 || dayOfWeek === 6 ? "fin_de_semana" : "laborable",
  }
}

// Preferencias por defecto
export function getDefaultPreferences(): UserPreferences {
return {
  fitness: {
    level: "intermedio",
    preferredActivity: "caminar",
    maxDistance: 5,
    maxDuration: 60,
    maxDifficulty: 6,
  },
  interests: {
    sensors: true,
    pois: true,
    incidents: false,
    nature: true,
    culture: true,
    shopping: false,
  },
  accessibility: {
    wheelchairAccessible: false,
    avoidSteepSlopes: false,
    preferPavedPaths: true,
    needRestStops: false,
    maxSlopePercent: 15,
  },
  timing: {
    preferredStartTime: "10:00",
    availableTime: 90,
    flexibleSchedule: true,
  },
  environment: {
    preferShade: false,
    avoidCrowds: false,
    preferQuietRoutes: false
  },
}
}

// Función para evaluar compatibilidad de un punto con las preferencias
function evaluatePointCompatibility(
  punto: PuntoUrbano,
  preferences: UserPreferences,
  conditions: CurrentConditions,
): number {
  let score = 0.5 // Base score

  // Evaluar intereses
  if (preferences.interests.sensors && punto.type === "sensor") score += 0.3
  if (preferences.interests.pois && punto.type === "poi") score += 0.3
  if (preferences.interests.incidents && punto.type === "incident") score += 0.1
  if (!preferences.interests.incidents && punto.type === "incident") score -= 0.2

  // Evaluar condiciones del punto
  const pointStatus = conditions.pointStatus[punto.id]
  if (pointStatus) {
    if (!pointStatus.available) score -= 0.5
    if (pointStatus.crowded && conditions.dayOfWeek === "fin_de_semana") score -= 0.2
    if (pointStatus.maintenance) score -= 0.3
  }

  // Evaluar condiciones meteorológicas
  if (conditions.weather.condition === "lluvia" && punto.type === "poi") {
    if (punto.name.includes("Parque") || punto.name.includes("Plaza")) score -= 0.3
  }

  return Math.max(0, Math.min(1, score))
}

// Función para generar sugerencias de optimización
function generateOptimizationSuggestions(
  puntosSeleccionados: PuntoSeleccionado[],
  todosPuntos: PuntoUrbano[],
  statistics: RouteStatistics,
  preferences: UserPreferences,
  conditions: CurrentConditions,
): RouteSuggestion[] {
  const suggestions: RouteSuggestion[] = []

  // Sugerencia 1: Reducir dificultad si excede preferencias
  if (statistics.difficulty.score > preferences.fitness.maxDifficulty) {
    const puntosProblematicos = puntosSeleccionados.filter((p) => {
      const punto = todosPuntos.find((tp) => tp.id === p.id)
      return punto && evaluatePointCompatibility(punto, preferences, conditions) < 0.4
    })

    if (puntosProblematicos.length > 0) {
      suggestions.push({
        id: "reduce-difficulty",
        type: "optimization",
        priority: "alta",
        title: "Reducir Dificultad",
        description: `Eliminar ${puntosProblematicos.length} punto(s) para reducir la dificultad`,
        reason: `La ruta actual (${statistics.difficulty.score}/10) excede tu nivel preferido (${preferences.fitness.maxDifficulty}/10)`,
        impact: {
          timeChange: -15,
          distanceChange: -500,
          difficultyChange: -2,
          safetyImprovement: true,
        },
        changes: {
          removePoints: puntosProblematicos.map((p) => p.id),
        },
        confidence: 0.8,
      })
    }
  }

  // Sugerencia 2: Añadir puntos de interés según preferencias
  const puntosDisponibles = todosPuntos.filter(
    (p) =>
      !puntosSeleccionados.find((ps) => ps.id === p.id) && evaluatePointCompatibility(p, preferences, conditions) > 0.7,
  )

  if (puntosDisponibles.length > 0 && puntosSeleccionados.length < 5) {
    const mejorPunto = puntosDisponibles.sort(
      (a, b) =>
        evaluatePointCompatibility(b, preferences, conditions) - evaluatePointCompatibility(a, preferences, conditions),
    )[0]

    suggestions.push({
      id: "add-interest-point",
      type: "preference",
      priority: "media",
      title: "Añadir Punto de Interés",
      description: `Incluir "${mejorPunto.name}" en tu ruta`,
      reason: "Este punto coincide perfectamente con tus intereses",
      impact: {
        timeChange: 10,
        distanceChange: 300,
        difficultyChange: 0.5,
        safetyImprovement: false,
      },
      changes: {
        addPoints: [mejorPunto.id],
      },
      confidence: 0.9,
    })
  }

  // Sugerencia 3: Reordenar por eficiencia
  if (puntosSeleccionados.length > 2) {
    suggestions.push({
      id: "optimize-order",
      type: "optimization",
      priority: "media",
      title: "Optimizar Orden",
      description: "Reordenar puntos para reducir la distancia total",
      reason: "El orden actual no es el más eficiente",
      impact: {
        timeChange: -8,
        distanceChange: -200,
        difficultyChange: 0,
        safetyImprovement: false,
      },
      changes: {
        reorderPoints: [{ from: 1, to: 2 }],
      },
      confidence: 0.7,
    })
  }

  // Sugerencia 4: Adaptación meteorológica
  if (conditions.weather.condition === "lluvia") {
    const puntosExteriores = puntosSeleccionados.filter((p) => {
      const punto = todosPuntos.find((tp) => tp.id === p.id)
      return punto && (punto.name.includes("Parque") || punto.name.includes("Plaza"))
    })

    if (puntosExteriores.length > 0) {
      const puntosInteriores = todosPuntos.filter(
        (p) =>
          !puntosSeleccionados.find((ps) => ps.id === p.id) &&
          (p.name.includes("Centro") || p.name.includes("Comercial") || p.name.includes("Estación")),
      )

      if (puntosInteriores.length > 0) {
        suggestions.push({
          id: "weather-adaptation",
          type: "safety",
          priority: "alta",
          title: "Adaptación al Clima",
          description: "Reemplazar puntos exteriores por interiores debido a la lluvia",
          reason: "Condiciones meteorológicas adversas detectadas",
          impact: {
            timeChange: 0,
            distanceChange: 0,
            difficultyChange: -1,
            safetyImprovement: true,
          },
          changes: {
            replacePoints: [{ oldId: puntosExteriores[0].id, newId: puntosInteriores[0].id }],
          },
          confidence: 0.85,
        })
      }
    }
  }

  // Sugerencia 5: Ajuste de tiempo
  const tiempoEstimado = statistics.performance.estimatedTime.walking
  if (tiempoEstimado > preferences.timing.availableTime) {
    suggestions.push({
      id: "time-adjustment",
      type: "optimization",
      priority: "alta",
      title: "Ajustar Duración",
      description: `Reducir ruta para ajustarse a tu tiempo disponible (${preferences.timing.availableTime} min)`,
      reason: `La ruta actual toma ${tiempoEstimado} minutos, excediendo tu tiempo disponible`,
      impact: {
        timeChange: preferences.timing.availableTime - tiempoEstimado,
        distanceChange: -400,
        difficultyChange: -1.5,
        safetyImprovement: false,
      },
      changes: {
        removePoints: puntosSeleccionados.slice(-1).map((p) => p.id),
      },
      confidence: 0.9,
    })
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { alta: 3, media: 2, baja: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence
  })
}

// Función principal para analizar y sugerir mejoras
export function analyzeAndSuggestImprovements(
  puntosSeleccionados: PuntoSeleccionado[],
  todosPuntos: PuntoUrbano[],
  statistics: RouteStatistics,
  preferences: UserPreferences,
  conditions: CurrentConditions,
): AdaptiveRouteAnalysis {
  // Evaluar ruta original
  const originalScore = calculateRouteScore(puntosSeleccionados, todosPuntos, statistics, preferences, conditions)
  const issues = identifyRouteIssues(statistics, preferences, conditions)
  const strengths = identifyRouteStrengths(statistics, preferences, conditions)

  // Generar sugerencias
  const suggestions = generateOptimizationSuggestions(
    puntosSeleccionados,
    todosPuntos,
    statistics,
    preferences,
    conditions,
  )

  return {
    originalRoute: {
      score: originalScore,
      issues,
      strengths,
    },
    suggestions,
  }
}

// Función para calcular puntuación de ruta
function calculateRouteScore(
  puntosSeleccionados: PuntoSeleccionado[],
  todosPuntos: PuntoUrbano[],
  statistics: RouteStatistics,
  preferences: UserPreferences,
  conditions: CurrentConditions,
): number {
  let score = 50 // Base score

  // Evaluar compatibilidad con preferencias de fitness
  const difficultyDiff = Math.abs(statistics.difficulty.score - preferences.fitness.maxDifficulty)
  score += Math.max(0, 20 - difficultyDiff * 4)

  // Evaluar duración
  const timeDiff = Math.abs(statistics.performance.estimatedTime.walking - preferences.timing.availableTime)
  score += Math.max(0, 15 - timeDiff * 0.3)

  // Evaluar intereses
  let interestScore = 0
  puntosSeleccionados.forEach((p) => {
    const punto = todosPuntos.find((tp) => tp.id === p.id)
    if (punto) {
      interestScore += evaluatePointCompatibility(punto, preferences, conditions) * 10
    }
  })
  score += interestScore / puntosSeleccionados.length

  // Evaluar seguridad
  if (statistics.safety.riskLevel === "Bajo") score += 10
  else if (statistics.safety.riskLevel === "Medio") score += 5
  else score -= 5

  return Math.max(0, Math.min(100, Math.round(score)))
}

// Función para identificar problemas de la ruta
function identifyRouteIssues(
  statistics: RouteStatistics,
  preferences: UserPreferences,
  conditions: CurrentConditions,
): string[] {
  const issues: string[] = []

  if (statistics.difficulty.score > preferences.fitness.maxDifficulty) {
    issues.push(`Dificultad muy alta (${statistics.difficulty.score}/10)`)
  }

  if (statistics.performance.estimatedTime.walking > preferences.timing.availableTime) {
    issues.push(`Duración excesiva (${statistics.performance.estimatedTime.walking} min)`)
  }

  if (statistics.safety.riskLevel === "Alto") {
    issues.push("Nivel de riesgo elevado")
  }

  if (conditions.weather.condition === "lluvia" && statistics.terrain.surface === "Natural") {
    issues.push("Condiciones meteorológicas adversas")
  }

  if (statistics.terrain.maxSlope > preferences.accessibility.maxSlopePercent) {
    issues.push(`Pendientes muy pronunciadas (${statistics.terrain.maxSlope}%)`)
  }

  return issues
}

// Función para identificar fortalezas de la ruta
function identifyRouteStrengths(
  statistics: RouteStatistics,
  preferences: UserPreferences,
  conditions: CurrentConditions,
): string[] {
  const strengths: string[] = []

  if (statistics.difficulty.score <= preferences.fitness.maxDifficulty) {
    strengths.push("Dificultad apropiada para tu nivel")
  }

  if (statistics.safety.riskLevel === "Bajo") {
    strengths.push("Ruta segura")
  }

  if (statistics.performance.estimatedTime.walking <= preferences.timing.availableTime) {
    strengths.push("Duración adecuada")
  }

  if (conditions.weather.condition === "soleado") {
    strengths.push("Condiciones meteorológicas ideales")
  }

  if (statistics.terrain.avgSlope < 5) {
    strengths.push("Terreno mayormente plano")
  }

  return strengths
}

// Función para aplicar una sugerencia
export function applySuggestion(
  suggestion: RouteSuggestion,
  puntosSeleccionados: PuntoSeleccionado[],
  todosPuntos: PuntoUrbano[],
): PuntoSeleccionado[] {
  let newPoints = [...puntosSeleccionados]

  // Aplicar cambios según el tipo
  if (suggestion.changes.removePoints) {
    newPoints = newPoints.filter((p) => !suggestion.changes.removePoints!.includes(p.id))
  }

  if (suggestion.changes.addPoints) {
    suggestion.changes.addPoints.forEach((pointId) => {
      const punto = todosPuntos.find((p) => p.id === pointId)
      if (punto) {
        newPoints.push({
          id: punto.id,
          lat: punto.lat,
          lng: punto.lng,
          name: punto.name,
          order: newPoints.length + 1,
        })
      }
    })
  }

  if (suggestion.changes.replacePoints) {
    suggestion.changes.replacePoints.forEach(({ oldId, newId }) => {
      const index = newPoints.findIndex((p) => p.id === oldId)
      const newPoint = todosPuntos.find((p) => p.id === newId)
      if (index !== -1 && newPoint) {
        newPoints[index] = {
          id: newPoint.id,
          lat: newPoint.lat,
          lng: newPoint.lng,
          name: newPoint.name,
          order: newPoints[index].order,
        }
      }
    })
  }

  if (suggestion.changes.reorderPoints) {
    suggestion.changes.reorderPoints.forEach(({ from, to }) => {
      if (from < newPoints.length && to < newPoints.length) {
        const temp = newPoints[from]
        newPoints[from] = newPoints[to]
        newPoints[to] = temp
      }
    })
  }

  // Reordenar números de orden
  newPoints.forEach((point, index) => {
    point.order = index + 1
  })

  return newPoints
}
