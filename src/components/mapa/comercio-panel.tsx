
"use client"

import { useState } from "react"
import { ShoppingBag, TrendingUp, Users, Clock, Star, Phone, Globe, Truck } from "lucide-react"
import type { ComercioLocal, AnalyticsComerciante, PromocionActiva } from "@/types/superapp-types"

interface ComercioPanelProps {
  comercio: ComercioLocal
  analytics: AnalyticsComerciante
  onCrearPromocion: (promocion: Omit<PromocionActiva, "id">) => void
  onActualizarHorarios: (horarios: ComercioLocal["horarios"]) => void
}

export default function ComercioPanel({
  comercio,
  analytics,
  onCrearPromocion,
  onActualizarHorarios,
}: ComercioPanelProps) {
  const [activeTab, setActiveTab] = useState<"info" | "analytics" | "promociones" | "horarios">("info")
  const [nuevaPromocion, setNuevaPromocion] = useState({
    titulo: "",
    descripcion: "",
    descuento: 0,
    tipoDescuento: "porcentaje" as const,
    duracionDias: 7,
  })

  const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case "restaurante":
        return "🍽️"
      case "tienda":
        return "🛍️"
      case "servicio":
        return "🔧"
      case "ocio":
        return "🎭"
      case "salud":
        return "🏥"
      case "educacion":
        return "📚"
      default:
        return "🏪"
    }
  }

  const handleCrearPromocion = () => {
    if (!nuevaPromocion.titulo || !nuevaPromocion.descripcion) return

    const fechaInicio = new Date()
    const fechaFin = new Date()
    fechaFin.setDate(fechaFin.getDate() + nuevaPromocion.duracionDias)

    onCrearPromocion({
      titulo: nuevaPromocion.titulo,
      descripcion: nuevaPromocion.descripcion,
      descuento: nuevaPromocion.descuento,
      tipoDescuento: nuevaPromocion.tipoDescuento,
      fechaInicio,
      fechaFin,
      condiciones: ["Válido solo en tienda física", "No acumulable con otras ofertas"],
      usosPorUsuario: 1,
      usosRestantes: 100,
      geoRestriccion: {
        radio: 500,
        zonas: ["centro"],
      },
    })

    // Reset form
    setNuevaPromocion({
      titulo: "",
      descripcion: "",
      descuento: 0,
      tipoDescuento: "porcentaje",
      duracionDias: 7,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-3xl mr-3">{getCategoriaIcon(comercio.categoria)}</div>
            <div>
              <h2 className="text-2xl font-bold">{comercio.nombre}</h2>
              <p className="text-blue-100 capitalize">{comercio.categoria}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-300">
              <Star className="mr-1 h-5 w-5" />
              <span className="font-bold">{comercio.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-blue-100">Rating promedio</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "info", label: "Información", icon: ShoppingBag },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "promociones", label: "Promociones", icon: Users },
          { id: "horarios", label: "Horarios", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center py-3 px-4 font-medium transition-colors ${
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
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Contacto</h3>
                <div className="space-y-2">
                  {comercio.contacto.telefono && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      {comercio.contacto.telefono}
                    </div>
                  )}
                  {comercio.contacto.web && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="mr-2 h-4 w-4" />
                      <a href={comercio.contacto.web} className="text-blue-600 hover:underline">
                        Sitio web
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Servicios</h3>
                <div className="flex flex-wrap gap-2">
                  {comercio.servicios.map((servicio, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Accesibilidad */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Accesibilidad</h3>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`p-3 rounded-lg text-center ${comercio.accesibilidad.rampaAcceso ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  <div className="text-2xl mb-1">♿</div>
                  <div className="text-sm">Rampa de acceso</div>
                </div>
                <div
                  className={`p-3 rounded-lg text-center ${comercio.accesibilidad.aseoAdaptado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  <div className="text-2xl mb-1">🚻</div>
                  <div className="text-sm">Aseo adaptado</div>
                </div>
                <div
                  className={`p-3 rounded-lg text-center ${comercio.accesibilidad.espacioSillaRuedas ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  <div className="text-2xl mb-1">🪑</div>
                  <div className="text-sm">Espacio silla ruedas</div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            {comercio.delivery.disponible && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Servicio de Delivery
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-bold text-green-800">{comercio.delivery.radioKm} km</div>
                      <div className="text-sm text-green-600">Radio de entrega</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-800">{comercio.delivery.tiempoEstimado} min</div>
                      <div className="text-sm text-green-600">Tiempo estimado</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-800">{comercio.delivery.costeMinimo}€</div>
                      <div className="text-sm text-green-600">Pedido mínimo</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* KPIs principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.visitasSemanales}</div>
                <div className="text-sm text-blue-800">Visitas esta semana</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.conversionPromociones}%</div>
                <div className="text-sm text-green-800">Conversión promociones</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{analytics.ratingPromedio}</div>
                <div className="text-sm text-yellow-800">Rating promedio</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics.horasPico.length}</div>
                <div className="text-sm text-purple-800">Horas pico</div>
              </div>
            </div>

            {/* Origen de visitantes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Origen de Visitantes</h3>
              <div className="space-y-2">
                {analytics.origenVisitantes.map((origen, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{origen.zona}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${origen.porcentaje}%` }} />
                      </div>
                      <span className="text-sm font-medium">{origen.porcentaje}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recomendaciones de Mejora</h3>
              <div className="space-y-2">
                {analytics.recomendacionesMejora.map((recomendacion, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                    <span className="text-blue-800">{recomendacion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "promociones" && (
          <div className="space-y-6">
            {/* Crear nueva promoción */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Crear Nueva Promoción</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={nuevaPromocion.titulo}
                    onChange={(e) => setNuevaPromocion((prev) => ({ ...prev, titulo: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Descuento de verano"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de descuento</label>
                  <select
                    value={nuevaPromocion.tipoDescuento}
                    onChange={(e) => setNuevaPromocion((prev) => ({ ...prev, tipoDescuento: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="porcentaje">Porcentaje</option>
                    <option value="cantidad">Cantidad fija</option>
                    <option value="2x1">2x1</option>
                    <option value="regalo">Regalo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {nuevaPromocion.tipoDescuento === "porcentaje" ? "Porcentaje %" : "Cantidad €"}
                  </label>
                  <input
                    type="number"
                    value={nuevaPromocion.descuento}
                    onChange={(e) => setNuevaPromocion((prev) => ({ ...prev, descuento: Number(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max={nuevaPromocion.tipoDescuento === "porcentaje" ? "100" : "999"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración (días)</label>
                  <input
                    type="number"
                    value={nuevaPromocion.duracionDias}
                    onChange={(e) => setNuevaPromocion((prev) => ({ ...prev, duracionDias: Number(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="365"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={nuevaPromocion.descripcion}
                    onChange={(e) => setNuevaPromocion((prev) => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe los detalles de la promoción..."
                  />
                </div>
              </div>
              <button
                onClick={handleCrearPromocion}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Crear Promoción
              </button>
            </div>

            {/* Promociones activas */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Promociones Activas</h3>
              <div className="space-y-3">
                {comercio.promociones.map((promocion) => (
                  <div key={promocion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{promocion.titulo}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {promocion.descuento}
                        {promocion.tipoDescuento === "porcentaje" ? "%" : "€"} OFF
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{promocion.descripcion}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Válida hasta: {promocion.fechaFin.toLocaleDateString()}</span>
                      <span>Usos restantes: {promocion.usosRestantes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "horarios" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Gestión de Horarios</h3>
            <div className="space-y-3">
              {diasSemana.map((dia) => (
                <div key={dia} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium capitalize w-20">{dia}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={comercio.horarios[dia]?.apertura || "09:00"}
                      className="p-1 border border-gray-300 rounded text-sm"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={comercio.horarios[dia]?.cierre || "18:00"}
                      className="p-1 border border-gray-300 rounded text-sm"
                    />
                    <label className="flex items-center">
                      <input type="checkbox" checked={comercio.horarios[dia]?.cerrado || false} className="mr-1" />
                      <span className="text-sm">Cerrado</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Guardar Horarios
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
