"use client"

import { useState } from "react"
import { Activity, AlertTriangle, Calendar, TrendingUp, Wind, MapPin, BarChart2, Shield } from 'lucide-react'
import type { DashboardMunicipal, SensorIoT, IncidenciaUrbana, EventoMunicipal } from "@/types/superapp-types"

interface MunicipalDashboardProps {
  dashboard: DashboardMunicipal
  sensores: SensorIoT[]
  incidencias: IncidenciaUrbana[]
  eventos: EventoMunicipal[]
  onCrearIncidencia: (incidencia: Omit<IncidenciaUrbana, "id">) => void
  onResolverIncidencia: (id: string) => void
}

export default function MunicipalDashboard({
  dashboard,
  sensores,
  incidencias,
  eventos,
  onCrearIncidencia,
  onResolverIncidencia,
}: MunicipalDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "sensores" | "incidencias" | "eventos" | "movilidad">(
    "overview",
  )
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    tipo: "obra" as const,
    titulo: "",
    descripcion: "",
    gravedad: "media" as const,
    lat: 41.6718,
    lng: 2.7923,
    afectaTrafico: false,
    callesAfectadas: [""],
    contactoResponsable: "",
  })

  const getSensorIcon = (tipo: string) => {
    switch (tipo) {
      case "calidad_aire":
        return "🌬️"
      case "ruido":
        return "🔊"
      case "trafico":
        return "🚗"
      case "temperatura":
        return "🌡️"
      case "humedad":
        return "💧"
      case "luminosidad":
        return "💡"
      case "ocupacion":
        return "👥"
      default:
        return "📊"
    }
  }

  const getIncidenciaColor = (gravedad: string) => {
    switch (gravedad) {
      case "baja":
        return "bg-green-100 text-green-800 border-green-200"
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critica":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCrearIncidencia = () => {
    if (!nuevaIncidencia.titulo || !nuevaIncidencia.descripcion) return

    onCrearIncidencia({
      ...nuevaIncidencia,
      fechaInicio: new Date(),
      estado: "planificada",
      desviosRecomendados: [],
    })

    // Reset form
    setNuevaIncidencia({
      tipo: "obra",
      titulo: "",
      descripcion: "",
      gravedad: "media",
      lat: 41.6718,
      lng: 2.7923,
      afectaTrafico: false,
      callesAfectadas: [""],
      contactoResponsable: "",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Municipal</h2>
            <p className="text-blue-100">Gestión inteligente de la ciudad</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{dashboard.sensoresActivos}</div>
            <p className="text-sm text-blue-100">Sensores activos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {[
          { id: "overview", label: "Resumen", icon: BarChart2 },
          { id: "sensores", label: "Sensores IoT", icon: Activity },
          { id: "incidencias", label: "Incidencias", icon: AlertTriangle },
          { id: "eventos", label: "Eventos", icon: Calendar },
          { id: "movilidad", label: "Movilidad", icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center justify-center py-3 px-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="mr-2 h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPIs principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Activity className="mx-auto mb-2 text-blue-600 h-6 w-6" />
                <div className="text-2xl font-bold text-blue-600">{dashboard.sensoresActivos}</div>
                <div className="text-sm text-blue-800">Sensores Activos</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <AlertTriangle className="mx-auto mb-2 text-red-600 h-6 w-6" />
                <div className="text-2xl font-bold text-red-600">{dashboard.incidenciasAbiertas}</div>
                <div className="text-sm text-red-800">Incidencias Abiertas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Calendar className="mx-auto mb-2 text-green-600 h-6 w-6" />
                <div className="text-2xl font-bold text-green-600">{dashboard.eventosHoy}</div>
                <div className="text-sm text-green-800">Eventos Hoy</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Wind className="mx-auto mb-2 text-purple-600 h-6 w-6" />
                <div className="text-2xl font-bold text-purple-600">{dashboard.calidadAirePromedio}</div>
                <div className="text-sm text-purple-800">Calidad del Aire</div>
              </div>
            </div>

            {/* Alertas activas */}
            {dashboard.alertasActivas.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Shield className="mr-2 text-red-600 h-5 w-5" />
                  Alertas Activas
                </h3>
                <div className="space-y-2">
                  {dashboard.alertasActivas.map((alerta, index) => (
                    <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="mr-3 text-red-600 h-5 w-5" />
                      <span className="text-red-800">{alerta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estadísticas de movilidad */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Estadísticas de Movilidad</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🚶</div>
                  <div className="font-bold text-gray-800">{dashboard.estadisticasMovilidad.peatonal}%</div>
                  <div className="text-sm text-gray-600">Peatonal</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🚴</div>
                  <div className="font-bold text-gray-800">{dashboard.estadisticasMovilidad.ciclista}%</div>
                  <div className="text-sm text-gray-600">Ciclista</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="font-bold text-gray-800">{dashboard.estadisticasMovilidad.vehicular}%</div>
                  <div className="text-sm text-gray-600">Vehicular</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🚌</div>
                  <div className="font-bold text-gray-800">{dashboard.estadisticasMovilidad.transportePublico}%</div>
                  <div className="text-sm text-gray-600">Transporte Público</div>
                </div>
              </div>
            </div>

            {/* Zonas de mayor actividad */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Zonas de Mayor Actividad</h3>
              <div className="space-y-2">
                {dashboard.zonasMayorActividad.map((zona, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-blue-600 h-5 w-5" />
                      <span className="font-medium text-blue-800">{zona}</span>
                    </div>
                    <span className="text-sm text-blue-600">Alta actividad</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sensores" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensores.map((sensor) => (
                <div key={sensor.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getSensorIcon(sensor.tipo)}</span>
                      <div>
                        <h4 className="font-medium text-gray-800 capitalize">{sensor.tipo.replace("_", " ")}</h4>
                        <p className="text-sm text-gray-500">ID: {sensor.id}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        sensor.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : sensor.estado === "mantenimiento"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sensor.estado}
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-gray-800">{sensor.valor}</div>
                    <div className="text-sm text-gray-600">{sensor.unidad}</div>
                  </div>

                  {sensor.umbralAlerta && sensor.valor > sensor.umbralAlerta && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                      <span className="text-red-800 text-sm font-medium">⚠️ Umbral superado</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 text-center mt-2">
                    Última actualización: {sensor.ultimaActualizacion.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "incidencias" && (
          <div className="space-y-6">
            {/* Crear nueva incidencia */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Reportar Nueva Incidencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={nuevaIncidencia.tipo}
                    onChange={(e) => setNuevaIncidencia((prev) => ({ ...prev, tipo: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="obra">Obra</option>
                    <option value="accidente">Accidente</option>
                    <option value="evento">Evento</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="emergencia">Emergencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gravedad</label>
                  <select
                    value={nuevaIncidencia.gravedad}
                    onChange={(e) => setNuevaIncidencia((prev) => ({ ...prev, gravedad: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={nuevaIncidencia.titulo}
                    onChange={(e) => setNuevaIncidencia((prev) => ({ ...prev, titulo: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Título de la incidencia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                  <input
                    type="text"
                    value={nuevaIncidencia.contactoResponsable}
                    onChange={(e) => setNuevaIncidencia((prev) => ({ ...prev, contactoResponsable: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Contacto del responsable"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={nuevaIncidencia.descripcion}
                    onChange={(e) => setNuevaIncidencia((prev) => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descripción detallada de la incidencia"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={nuevaIncidencia.afectaTrafico}
                      onChange={(e) => setNuevaIncidencia((prev) => ({ ...prev, afectaTrafico: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Afecta al tráfico</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleCrearIncidencia}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reportar Incidencia
              </button>
            </div>

            {/* Lista de incidencias */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Incidencias Activas</h3>
              <div className="space-y-3">
                {incidencias
                  .filter((i) => i.estado !== "resuelta")
                  .map((incidencia) => (
                    <div
                      key={incidencia.id}
                      className={`border rounded-lg p-4 ${getIncidenciaColor(incidencia.gravedad)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{incidencia.titulo}</h4>
                          <p className="text-sm opacity-80 capitalize">
                            {incidencia.tipo} • {incidencia.gravedad}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              incidencia.estado === "planificada"
                                ? "bg-blue-100 text-blue-800"
                                : incidencia.estado === "activa"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {incidencia.estado}
                          </span>
                          {incidencia.estado !== "resuelta" && (
                            <button
                              onClick={() => onResolverIncidencia(incidencia.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              Resolver
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mb-2">{incidencia.descripcion}</p>
                      <div className="flex justify-between text-xs opacity-75">
                        <span>Inicio: {incidencia.fechaInicio.toLocaleDateString()}</span>
                        <span>Responsable: {incidencia.contactoResponsable}</span>
                      </div>
                      {incidencia.afectaTrafico && (
                        <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          ⚠️ Afecta al tráfico
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "eventos" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Eventos Programados</h3>
            <div className="space-y-3">
              {eventos.map((evento) => (
                <div key={evento.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">{evento.titulo}</h4>
                      <p className="text-sm text-gray-600 capitalize">{evento.categoria}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{evento.fechaInicio.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {evento.fechaInicio.toLocaleTimeString()} - {evento.fechaFin.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{evento.descripcion}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>📍 {evento.ubicacion.direccion}</span>
                    <span>👤 {evento.organizador}</span>
                  </div>
                  {evento.afectaTrafico && (
                    <div className="mt-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      🚗 Afecta al tráfico - Cortes: {evento.corteCalles.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "movilidad" && (
          <div className="space-y-6">
            {/* Gráfico de movilidad por horas */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Flujo de Tráfico por Horas</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-12 gap-1 h-32">
                  {Array.from({ length: 24 }, (_, i) => {
                    const altura = Math.random() * 100
                    return (
                      <div key={i} className="flex flex-col justify-end">
                        <div className="bg-blue-500 rounded-t" style={{ height: `${altura}%` }} />
                        <div className="text-xs text-center mt-1">{i}h</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Rutas más utilizadas */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Rutas Más Utilizadas</h3>
              <div className="space-y-3">
                {[
                  { origen: "Centro", destino: "Puerto", usuarios: 1250, tiempo: "12 min" },
                  { origen: "Estación", destino: "Hospital", usuarios: 890, tiempo: "8 min" },
                  { origen: "Universidad", destino: "Centro Comercial", usuarios: 670, tiempo: "15 min" },
                  { origen: "Residencial Norte", destino: "Centro", usuarios: 540, tiempo: "18 min" },
                ].map((ruta, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-blue-600 h-5 w-5" />
                      <span className="font-medium">
                        {ruta.origen} → {ruta.destino}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>👥 {ruta.usuarios} usuarios/día</span>
                      <span>⏱️ {ruta.tiempo} promedio</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Puntos de congestión */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Puntos de Congestión</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { ubicacion: "Rotonda del Puerto", nivel: "Alto", horaPico: "08:00-09:00" },
                  { ubicacion: "Cruce Av. Catalunya", nivel: "Medio", horaPico: "17:30-18:30" },
                  { ubicacion: "Plaza Mayor", nivel: "Bajo", horaPico: "12:00-13:00" },
                  { ubicacion: "Entrada Autopista", nivel: "Alto", horaPico: "07:30-08:30" },
                ].map((punto, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      punto.nivel === "Alto"
                        ? "bg-red-50 border-red-200"
                        : punto.nivel === "Medio"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="font-medium">{punto.ubicacion}</div>
                    <div className="text-sm text-gray-600">Hora pico: {punto.horaPico}</div>
                    <div
                      className={`text-xs font-medium mt-1 ${
                        punto.nivel === "Alto"
                          ? "text-red-600"
                          : punto.nivel === "Medio"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      Congestión: {punto.nivel}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

