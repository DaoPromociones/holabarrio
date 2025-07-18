
"use client"

import { useState } from "react"
import { Zap, TrendingUp, Shield, Heart, Check, X, ChevronDown, ChevronUp, Clock, MapPin, Activity } from "lucide-react"
import type { AdaptiveRouteAnalysis, RouteSuggestion } from "@/types/adaptive-routing"

interface AdaptiveSuggestionsProps {
  analysis: AdaptiveRouteAnalysis
  onApplySuggestion: (suggestion: RouteSuggestion) => void
  onDismissSuggestion: (suggestionId: string) => void
}

export default function AdaptiveSuggestionsPanel({
  analysis,
  onApplySuggestion,
  onDismissSuggestion,
}: AdaptiveSuggestionsProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set())

  const getSuggestionIcon = (type: RouteSuggestion["type"]) => {
    switch (type) {
      case "optimization":
        return <Zap className="text-gray-600 mt-1" size={20} />
      case "alternative":
        return <TrendingUp className="text-gray-600 mt-1" size={20} />
      case "safety":
        return <Shield className="text-gray-600 mt-1" size={20} />
      case "preference":
        return <Heart className="text-gray-600 mt-1" size={20} />
      default:
        return <Zap className="text-gray-600 mt-1" size={20} />
    }
  }

  const getPriorityColor = (priority: RouteSuggestion["priority"]) => {
    switch (priority) {
      case "alta":
        return "border-red-200 bg-red-50"
      case "media":
        return "border-yellow-200 bg-yellow-50"
      case "baja":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    if (score >= 40) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const handleApplySuggestion = (suggestion: RouteSuggestion) => {
    onApplySuggestion(suggestion)
    setAppliedSuggestions((prev) => new Set([...prev, suggestion.id]))
  }

  if (analysis.suggestions.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Check className="text-green-600 mr-2 h-5 w-5" />
          <span className="text-green-800 font-medium">¡Tu ruta está optimizada!</span>
        </div>
        <p className="text-green-700 text-sm mt-1">No se encontraron mejoras significativas para sugerir.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Route Score */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Puntuación de Ruta</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.originalRoute.score)}`}>
            {analysis.originalRoute.score}/100
          </span>
        </div>

        {/* Issues */}
        {analysis.originalRoute.issues.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-red-700 mb-2">Problemas Detectados:</h4>
            <ul className="space-y-1">
              {analysis.originalRoute.issues.map((issue, index) => (
                <li key={index} className="flex items-center text-sm text-red-600">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths */}
        {analysis.originalRoute.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">Fortalezas:</h4>
            <ul className="space-y-1">
              {analysis.originalRoute.strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-sm text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <Zap className="mr-2 text-blue-600 h-5 w-5" />
          Sugerencias de Mejora ({analysis.suggestions.length})
        </h3>

        {analysis.suggestions.map((suggestion) => {
          const isExpanded = expandedSuggestion === suggestion.id
          const isApplied = appliedSuggestions.has(suggestion.id)

          return (
            <div key={suggestion.id} className={`border rounded-lg ${getPriorityColor(suggestion.priority)}`}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            suggestion.priority === "alta"
                              ? "bg-red-100 text-red-700"
                              : suggestion.priority === "media"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {suggestion.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}% confianza
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <p className="text-xs text-gray-500">{suggestion.reason}</p>

                      {/* Impact Summary */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {suggestion.impact.timeChange !== 0 && (
                          <span className="flex items-center text-xs bg-white px-2 py-1 rounded">
                            <Clock className="mr-1 h-3 w-3" />
                            {suggestion.impact.timeChange > 0 ? "+" : ""}
                            {suggestion.impact.timeChange} min
                          </span>
                        )}
                        {suggestion.impact.distanceChange !== 0 && (
                          <span className="flex items-center text-xs bg-white px-2 py-1 rounded">
                            <MapPin className="mr-1 h-3 w-3" />
                            {suggestion.impact.distanceChange > 0 ? "+" : ""}
                            {Math.round(suggestion.impact.distanceChange)} m
                          </span>
                        )}
                        {suggestion.impact.difficultyChange !== 0 && (
                          <span className="flex items-center text-xs bg-white px-2 py-1 rounded">
                            <Activity className="mr-1 h-3 w-3" />
                            {suggestion.impact.difficultyChange > 0 ? "+" : ""}
                            {suggestion.impact.difficultyChange} dif
                          </span>
                        )}
                        {suggestion.impact.safetyImprovement && (
                          <span className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            <Shield className="mr-1 h-3 w-3" />
                            Más seguro
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      {/* Detailed Changes */}
                      {suggestion.changes.addPoints && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Puntos a añadir:</h5>
                          <ul className="text-sm text-gray-600 ml-4">
                            {suggestion.changes.addPoints.map((pointId) => (
                              <li key={pointId}>• Punto {pointId}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {suggestion.changes.removePoints && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Puntos a eliminar:</h5>
                          <ul className="text-sm text-gray-600 ml-4">
                            {suggestion.changes.removePoints.map((pointId) => (
                              <li key={pointId}>• Punto {pointId}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {suggestion.changes.replacePoints && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Reemplazos:</h5>
                          <ul className="text-sm text-gray-600 ml-4">
                            {suggestion.changes.replacePoints.map((replace, index) => (
                              <li key={index}>
                                • {replace.oldId} → {replace.newId}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleApplySuggestion(suggestion)}
                          disabled={isApplied}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isApplied
                              ? "bg-green-100 text-green-700 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="inline mr-1 h-4 w-4" />
                              Aplicada
                            </>
                          ) : (
                            "Aplicar Sugerencia"
                          )}
                        </button>
                        <button
                          onClick={() => onDismissSuggestion(suggestion.id)}
                          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                        >
                          <X className="inline mr-1 h-4 w-4" />
                          Descartar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
