"use client"

import { useState } from "react"
import { TrendingUp, Activity, Shield, Info, ChevronDown, ChevronUp } from 'lucide-react'
import type { RouteStatistics } from "@/lib/route-analytics"

interface RouteStatisticsProps {
  statistics: RouteStatistics
  distanceKm: number
}

export default function RouteStatisticsPanel({ statistics, distanceKm }: RouteStatisticsProps) {
  const [activeTab, setActiveTab] = useState<"elevation" | "difficulty" | "performance" | "safety">("elevation")
  const [isExpanded, setIsExpanded] = useState(false)

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Fácil":
        return "text-green-600 bg-green-100"
      case "Moderado":
        return "text-yellow-600 bg-yellow-100"
      case "Difícil":
        return "text-orange-600 bg-orange-100"
      case "Muy Difícil":
        return "text-red-600 bg-red-100"
      case "Extremo":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Bajo":
        return "text-green-600 bg-green-100"
      case "Medio":
        return "text-yellow-600 bg-yellow-100"
      case "Alto":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  // Componente para el perfil de elevación simplificado
  const ElevationProfile = () => {
    const { profile } = statistics.elevation
    if (profile.length < 2) return null

    const maxElevation = Math.max(...profile.map((p) => p.elevation))
    const minElevation = Math.min(...profile.map((p) => p.elevation))
    const elevationRange = maxElevation - minElevation || 1

    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Perfil de Elevación</h4>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="relative h-24 bg-white rounded border">
            <svg width="100%" height="100%" className="absolute inset-0">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={profile
                  .map((point, index) => {
                    const x = (index / (profile.length - 1)) * 100
                    const y = 100 - ((point.elevation - minElevation) / elevationRange) * 80
                    return `${x},${y}`
                  })
                  .join(" ")}
              />
              {/* Área bajo la curva */}
              <polygon
                fill="rgba(59, 130, 246, 0.1)"
                points={`0,100 ${profile
                  .map((point, index) => {
                    const x = (index / (profile.length - 1)) * 100
                    const y = 100 - ((point.elevation - minElevation) / elevationRange) * 80
                    return `${x},${y}`
                  })
                  .join(" ")} 100,100`}
              />
            </svg>
            {/* Etiquetas de elevación */}
            <div className="absolute top-1 left-1 text-xs text-gray-500">{maxElevation}m</div>
            <div className="absolute bottom-1 left-1 text-xs text-gray-500">{minElevation}m</div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Inicio</span>
            <span>{distanceKm.toFixed(1)} km</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div
        className="p-4 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Activity className="mr-2 text-blue-600 h-5 w-5" />
          <h3 className="font-semibold text-gray-800">Estadísticas Avanzadas</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(statistics.difficulty.level)}`}
          >
            {statistics.difficulty.level}
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Tabs */}
          <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
            {[
              { id: "elevation", label: "Elevación", icon: TrendingUp },
              { id: "difficulty", label: "Dificultad", icon: Activity },
              { id: "performance", label: "Rendimiento", icon: Activity },
              { id: "safety", label: "Seguridad", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <tab.icon className="mr-1 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "elevation" && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Elevación Mín/Máx</div>
                    <div className="text-lg font-bold text-blue-800">
                      {statistics.elevation.min}m / {statistics.elevation.max}m
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Ganancia Total</div>
                    <div className="text-lg font-bold text-green-800">+{statistics.elevation.gain}m</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">Pérdida Total</div>
                    <div className="text-lg font-bold text-red-800">-{statistics.elevation.loss}m</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Pendiente Máx</div>
                    <div className="text-lg font-bold text-purple-800">{statistics.terrain.maxSlope}%</div>
                  </div>
                </div>
                <ElevationProfile />
              </div>
            )}

            {activeTab === "difficulty" && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-800 mb-2">{statistics.difficulty.score}/10</div>
                  <div
                    className={`inline-block px-4 py-2 rounded-full font-medium ${getDifficultyColor(statistics.difficulty.level)}`}
                  >
                    {statistics.difficulty.level}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Distancia</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(statistics.difficulty.factors.distance / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statistics.difficulty.factors.distance}/10</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Elevación</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(statistics.difficulty.factors.elevation / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statistics.difficulty.factors.elevation}/10</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pendiente</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(statistics.difficulty.factors.steepness / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statistics.difficulty.factors.steepness}/10</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Terreno</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(statistics.difficulty.factors.terrain / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{statistics.difficulty.factors.terrain}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚶</div>
                    <div className="text-sm text-gray-600">Caminando</div>
                    <div className="font-bold">{statistics.performance.estimatedTime.walking} min</div>
                    <div className="text-xs text-gray-500">{statistics.performance.calories.walking} cal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚴</div>
                    <div className="text-sm text-gray-600">Ciclismo</div>
                    <div className="font-bold">{statistics.performance.estimatedTime.cycling} min</div>
                    <div className="text-xs text-gray-500">{statistics.performance.calories.cycling} cal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏃</div>
                    <div className="text-sm text-gray-600">Corriendo</div>
                    <div className="font-bold">{statistics.performance.estimatedTime.running} min</div>
                    <div className="text-xs text-gray-500">{statistics.performance.calories.running} cal</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Ritmo Estimado (min/km)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">🚶 Caminando</span>
                      <span className="font-medium">{statistics.performance.pace.walking} min/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">🚴 Ciclismo</span>
                      <span className="font-medium">{statistics.performance.pace.cycling} min/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">🏃 Corriendo</span>
                      <span className="font-medium">{statistics.performance.pace.running} min/km</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "safety" && (
              <div>
                <div className="text-center mb-6">
                  <div
                    className={`inline-block px-4 py-2 rounded-full font-medium ${getRiskColor(statistics.safety.riskLevel)}`}
                  >
                    Riesgo {statistics.safety.riskLevel}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    Factores de Riesgo
                  </h4>
                  <div className="space-y-2">
                    {statistics.safety.factors.map((factor, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Recomendaciones
                  </h4>
                  <div className="space-y-2">
                    {statistics.safety.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-2" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
