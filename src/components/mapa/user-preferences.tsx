"use client"

import { useState } from "react"
import { Settings, User, Clock, Activity, Heart, X } from "lucide-react"
import type { UserPreferences } from "@/types/adaptive-routing"
import { Button } from "@/components/ui/button"

interface UserPreferencesProps {
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
  isOpen: boolean
  onClose: () => void
}

export default function UserPreferencesPanel({
  preferences,
  onPreferencesChange,
  isOpen,
  onClose,
}: UserPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences)

  const handleSave = () => {
    onPreferencesChange(localPreferences)
    onClose()
  }

  const handleReset = () => {
    setLocalPreferences(preferences)
  }

  const updatePreferences = (section: keyof UserPreferences, field: string, value: any) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center">
            <Settings className="mr-3 text-blue-600 h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Preferencias de Ruta</h2>
              <p className="text-sm text-gray-600">Personaliza tu experiencia de navegación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Fitness Section */}
          <div>
            <h3 className="flex items-center text-lg font-medium mb-4 text-gray-800">
              <Activity className="mr-2 text-green-600 h-5 w-5" />
              Condición Física
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Fitness</label>
                <select
                  value={localPreferences.fitness.level}
                  onChange={(e) => updatePreferences("fitness", "level", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="principiante">🟢 Principiante</option>
                  <option value="intermedio">🟡 Intermedio</option>
                  <option value="avanzado">🟠 Avanzado</option>
                  <option value="experto">🔴 Experto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actividad Preferida</label>
                <select
                  value={localPreferences.fitness.preferredActivity}
                  onChange={(e) => updatePreferences("fitness", "preferredActivity", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="caminar">🚶 Caminar</option>
                  <option value="correr">🏃 Correr</option>
                  <option value="ciclismo">🚴 Ciclismo</option>
                  <option value="mixto">🔄 Mixto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distancia Máxima:{" "}
                  <span className="font-bold text-blue-600">{localPreferences.fitness.maxDistance} km</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={localPreferences.fitness.maxDistance}
                  onChange={(e) => updatePreferences("fitness", "maxDistance", Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span>20 km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificultad Máxima:{" "}
                  <span className="font-bold text-orange-600">{localPreferences.fitness.maxDifficulty}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={localPreferences.fitness.maxDifficulty}
                  onChange={(e) => updatePreferences("fitness", "maxDifficulty", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Fácil</span>
                  <span>Extremo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div>
            <h3 className="flex items-center text-lg font-medium mb-4 text-gray-800">
              <Heart className="mr-2 text-red-600 h-5 w-5" />
              Intereses y Puntos de Atención
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(localPreferences.interests).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updatePreferences("interests", key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium">
                    {key === "pois"
                      ? "📍 Puntos de Interés"
                      : key === "sensors"
                        ? "🔬 Sensores"
                        : key === "comercios"
                          ? "🏪 Comercios"
                          : key === "naturaleza"
                            ? "🌳 Naturaleza"
                            : key === "cultura"
                              ? "🎭 Cultura"
                              : key === "deporte"
                                ? "⚽ Deporte"
                                : `✨ ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Accessibility Section */}
          <div>
            <h3 className="flex items-center text-lg font-medium mb-4 text-gray-800">
              <User className="mr-2 text-purple-600 h-5 w-5" />
              Accesibilidad y Movilidad
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localPreferences.accessibility.avoidSteepSlopes}
                    onChange={(e) => updatePreferences("accessibility", "avoidSteepSlopes", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium">⛰️ Evitar pendientes pronunciadas</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localPreferences.accessibility.preferPavedPaths}
                    onChange={(e) => updatePreferences("accessibility", "preferPavedPaths", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium">🛤️ Preferir caminos pavimentados</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localPreferences.accessibility.needRestStops}
                    onChange={(e) => updatePreferences("accessibility", "needRestStops", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium">🪑 Necesito paradas de descanso</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localPreferences.accessibility.wheelchairAccessible || false}
                    onChange={(e) => updatePreferences("accessibility", "wheelchairAccessible", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium">♿ Acceso para silla de ruedas</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pendiente Máxima Tolerable:{" "}
                  <span className="font-bold text-purple-600">{localPreferences.accessibility.maxSlopePercent}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={localPreferences.accessibility.maxSlopePercent}
                  onChange={(e) =>
                    updatePreferences("accessibility", "maxSlopePercent", Number.parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5% (Muy suave)</span>
                  <span>25% (Muy empinado)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timing Section */}
          <div>
            <h3 className="flex items-center text-lg font-medium mb-4 text-gray-800">
              <Clock className="mr-2 text-orange-600 h-5 w-5" />
              Horarios y Tiempo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🕐 Hora Preferida de Inicio</label>
                <input
                  type="time"
                  value={localPreferences.timing.preferredStartTime}
                  onChange={(e) => updatePreferences("timing", "preferredStartTime", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏱️ Tiempo Disponible:{" "}
                  <span className="font-bold text-orange-600">{localPreferences.timing.availableTime} min</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="240"
                  step="15"
                  value={localPreferences.timing.availableTime}
                  onChange={(e) => updatePreferences("timing", "availableTime", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 min</span>
                  <span>4 horas</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localPreferences.timing.flexibleSchedule}
                    onChange={(e) => updatePreferences("timing", "flexibleSchedule", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium">🔄 Horario flexible (puedo ajustar mis tiempos)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Weather and Environment Preferences */}
          <div>
            <h3 className="flex items-center text-lg font-medium mb-4 text-gray-800">
              <span className="mr-2">🌤️</span>
              Preferencias Ambientales
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localPreferences.environment?.preferShade || false}
                  onChange={(e) => updatePreferences("environment", "preferShade", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium">🌳 Preferir sombra</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localPreferences.environment?.avoidCrowds || false}
                  onChange={(e) => updatePreferences("environment", "avoidCrowds", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium">👥 Evitar multitudes</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localPreferences.environment?.preferQuietRoutes || false}
                  onChange={(e) => updatePreferences("environment", "preferQuietRoutes", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm font-medium">🔇 Rutas silenciosas</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            🔄 Restablecer
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              💾 Guardar Preferencias
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
