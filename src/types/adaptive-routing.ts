// Tipos para el sistema de rutas adaptativas
// Define una nueva interfaz para las preferencias de entorno
export interface EnvironmentPreferences {
  preferShade: boolean;
  avoidCrowds: boolean;
  preferQuietRoutes: boolean;
  urbanAreas?: boolean; // ¿Prefiere rutas en zonas urbanas?
  naturalAreas?: boolean; // ¿Prefiere rutas en la naturaleza?
  indoorRoutes?: boolean; // ¿Prefiere rutas que incluyan interiores?
  outdoorRoutes?: boolean; // ¿Prefiere rutas al aire libre?
  // Añade aquí todas las propiedades que necesites para el entorno
}



export interface AdaptiveRoutingConfig {
  maxSuggestions: number
  minConfidence: number
  timeSensitivity: boolean
  distanceSensitivity: boolean
  difficultySensitivity: boolean
  safetySensitivity: boolean
  userPreferences: UserPreferences
  currentConditions: CurrentConditions
}

export interface UserPreferences {
  environment: EnvironmentPreferences; 
  fitness: {
    level: "principiante" | "intermedio" | "avanzado" | "experto"
    preferredActivity: "caminar" | "correr" | "ciclismo" | "mixto"
    maxDistance: number // en km
    maxDuration: number // en minutos
    maxDifficulty: number // 1-10
  }
  interests: {
    sensors: boolean
    pois: boolean
    incidents: boolean
    nature: boolean
    culture: boolean
    shopping: boolean
  }
  accessibility: {
    wheelchairAccessible: boolean
    avoidSteepSlopes: boolean
    preferPavedPaths: boolean
    needRestStops: boolean
    maxSlopePercent: number
  }
  timing: {
    preferredStartTime: string // HH:MM
    availableTime: number // minutos
    flexibleSchedule: boolean
  }
}

export interface CurrentConditions {
  weather: {
    condition: "soleado" | "nublado" | "lluvia" | "viento" | "niebla"
    temperature: number // Celsius
    windSpeed: number // km/h
    precipitation: number // %
    visibility: "excelente" | "buena" | "regular" | "mala"
  }
  traffic: {
    level: "bajo" | "moderado" | "alto" | "muy_alto"
    incidents: string[]
    peakHours: boolean
  }
  pointStatus: {
    [pointId: string]: {
      available: boolean
      crowded: boolean
      maintenance: boolean
      estimatedWaitTime: number // minutos
    }
  }
  timeOfDay: "madrugada" | "mañana" | "mediodia" | "tarde" | "noche"
  dayOfWeek: "laborable" | "fin_de_semana"
}

export interface RouteSuggestion {
  id: string
  type: "optimization" | "alternative" | "safety" | "preference"
  priority: "alta" | "media" | "baja"
  title: string
  description: string
  reason: string
  impact: {
    timeChange: number // minutos (+ o -)
    distanceChange: number // metros (+ o -)
    difficultyChange: number // puntos (+ o -)
    safetyImprovement: boolean
  }
  changes: {
    addPoints?: string[]
    removePoints?: string[]
    reorderPoints?: { from: number; to: number }[]
    replacePoints?: { oldId: string; newId: string }[]
  }
  confidence: number // 0-1
}

export interface AdaptiveRouteAnalysis {
  originalRoute: {
    score: number
    issues: string[]
    strengths: string[]
  }
  suggestions: RouteSuggestion[]
  optimizedRoute?: {
    points: string[]
    score: number
    improvements: string[]
  }
}
