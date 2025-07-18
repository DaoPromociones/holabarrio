"use client"

import { useEffect, useState, useRef } from "react"
import { Layers, Navigation, X, MapPin, Download, Share2, Settings, ShoppingBag, Shield, Users } from 'lucide-react'
import type { PuntoUrbano, PuntoSeleccionado, InfoRuta } from "@/types/mapa-types"
import type { ComercioLocal, UsuarioTipo, RutaRealista, DashboardMunicipal } from "@/types/superapp-types"
import { exportarGPX, exportarKML } from "@/lib/export-utils"
import { calculateRouteStatistics } from "@/lib/route-analytics"
import { calcularRutaRealista } from "@/lib/routing-engine"
import RouteStatisticsPanel from "@/components/mapa/route-statistics"
import ComercioPanel from "@/components/mapa/comercio-panel"
import MunicipalDashboard from "@/components/mapa/municipal-dashboard"
import type { RouteStatistics } from "@/lib/route-analytics"
import {
  getDefaultPreferences,
  getCurrentConditions,
  analyzeAndSuggestImprovements,
  applySuggestion,
} from "@/lib/adaptive-engine"
import UserPreferencesPanel from "@/components/mapa/user-preferences"
import AdaptiveSuggestionsPanel from "@/components/mapa/adaptive-suggestions"
import type {
  UserPreferences,
  CurrentConditions,
  AdaptiveRouteAnalysis,
  RouteSuggestion,
} from "@/types/adaptive-routing" 

// Función para simular la obtención de datos de FIWARE extendida
function fetchUrbanDataPlaceholder(): Promise<PuntoUrbano[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          lat: 41.6718,
          lng: 2.7923,
          type: "sensor",
          value: 25,
          name: "Sensor de Calidad del Aire",
          description: "Mide niveles de CO2 y partículas en suspensión",
        },
        {
          id: "2",
          lat: 41.675,
          lng: 2.795,
          type: "poi",
          name: "Plaza del Ayuntamiento",
          description: "Centro administrativo de la ciudad",
        },
        {
          id: "3",
          lat: 41.673,
          lng: 2.79,
          type: "incident",
          value: 3,
          name: "Obras en la Vía",
          description: "Trabajos de mantenimiento hasta el 15/06",
        },
        {
          id: "4",
          lat: 41.67,
          lng: 2.788,
          type: "sensor",
          value: 18,
          name: "Sensor de Ruido",
          description: "Monitoriza niveles de contaminación acústica",
        },
        {
          id: "5",
          lat: 41.678,
          lng: 2.793,
          type: "poi",
          name: "Parque Municipal",
          description: "Zona verde con instalaciones deportivas",
        },
        {
          id: "6",
          lat: 41.674,
          lng: 2.791,
          type: "poi",
          name: "Centro Comercial",
          description: "Zona comercial principal",
        },
        {
          id: "7",
          lat: 41.669,
          lng: 2.785,
          type: "poi",
          name: "Estación de Tren",
          description: "Estación principal de ferrocarril",
        },
      ])
    }, 1000)
  })
}

// Datos simulados para comercios
function fetchComerciosLocales(): Promise<ComercioLocal[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "comercio_1",
          nombre: "Restaurante Mar Azul",
          categoria: "restaurante",
          lat: 41.672,
          lng: 2.7925,
          horarios: {
            lunes: { apertura: "12:00", cierre: "23:00" },
            martes: { apertura: "12:00", cierre: "23:00" },
            miercoles: { apertura: "12:00", cierre: "23:00" },
            jueves: { apertura: "12:00", cierre: "23:00" },
            viernes: { apertura: "12:00", cierre: "24:00" },
            sabado: { apertura: "12:00", cierre: "24:00" },
            domingo: { apertura: "12:00", cierre: "23:00" },
          },
          promociones: [
            {
              id: "promo_1",
              titulo: "Menú del día",
              descripcion: "Menú completo con postre y bebida",
              descuento: 20,
              tipoDescuento: "porcentaje",
              fechaInicio: new Date(),
              fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              condiciones: ["Válido de lunes a viernes", "No incluye bebidas alcohólicas"],
              usosPorUsuario: 1,
              usosRestantes: 50,
            },
          ],
          rating: 4.5,
          fotos: [],
          contacto: {
            telefono: "+34 972 123 456",
            email: "info@marazul.com",
            web: "https://marazul.com",
          },
          servicios: ["Terraza", "WiFi", "Parking", "Reservas"],
          accesibilidad: {
            rampaAcceso: true,
            aseoAdaptado: true,
            espacioSillaRuedas: true,
          },
          delivery: {
            disponible: true,
            radioKm: 3,
            tiempoEstimado: 30,
            costeMinimo: 15,
          },
        },
        {
          id: "comercio_2",
          nombre: "Farmacia Central",
          categoria: "salud",
          lat: 41.6745,
          lng: 2.794,
          horarios: {
            lunes: { apertura: "09:00", cierre: "21:00" },
            martes: { apertura: "09:00", cierre: "21:00" },
            miercoles: { apertura: "09:00", cierre: "21:00" },
            jueves: { apertura: "09:00", cierre: "21:00" },
            viernes: { apertura: "09:00", cierre: "21:00" },
            sabado: { apertura: "09:00", cierre: "14:00" },
            domingo: { cerrado: true, apertura: "", cierre: "" },
          },
          promociones: [],
          rating: 4.8,
          fotos: [],
          contacto: {
            telefono: "+34 972 789 012",
          },
          servicios: ["Farmacia 24h", "Análisis", "Vacunación", "Tensión arterial"],
          accesibilidad: {
            rampaAcceso: true,
            aseoAdaptado: false,
            espacioSillaRuedas: true,
          },
          delivery: {
            disponible: false,
          },
        },
      ])
    }, 800)
  })
}

// Función para calcular ruta simple (mantenida para compatibilidad)
function calcularRutaSimple(puntos: PuntoSeleccionado[]): InfoRuta {
  if (puntos.length < 2) {
    return { distancia: 0, tiempoEstimado: 0, puntos: [] }
  }

  let distanciaTotal = 0
  const puntosRuta: [number, number][] = []

  // Ordenar puntos por orden de selección
  const puntosOrdenados = [...puntos].sort((a, b) => a.order - b.order)

  for (let i = 0; i < puntosOrdenados.length; i++) {
    const punto = puntosOrdenados[i]
    puntosRuta.push([punto.lat, punto.lng])

    if (i > 0) {
      const puntoAnterior = puntosOrdenados[i - 1]
      // Calcular distancia usando fórmula de Haversine
      const distancia = calcularDistanciaHaversine(puntoAnterior.lat, puntoAnterior.lng, punto.lat, punto.lng)
      distanciaTotal += distancia
    }
  }

  // Estimar tiempo (asumiendo velocidad promedio de 5 km/h caminando)
  const tiempoEstimado = (distanciaTotal / 1000) * 12 // 12 minutos por km

  return {
    distancia: distanciaTotal,
    tiempoEstimado: Math.round(tiempoEstimado),
    puntos: puntosRuta,
  }
}

// Función para calcular distancia entre dos puntos usando Haversine
function calcularDistanciaHaversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // Radio de la Tierra en metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Componente principal del mapa urbano
export default function MapaUrbano() {
  const [puntos, setPuntos] = useState<PuntoUrbano[]>([])
  const [comercios, setComercios] = useState<ComercioLocal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const routeLayerRef = useRef<any>(null)

  // Estados para funcionalidad de rutas
  const [modoRuta, setModoRuta] = useState(false)
  const [tipoTransporte, setTipoTransporte] = useState<"walking" | "cycling" | "driving" | "public_transport">(
    "walking",
  )
  const [puntosSeleccionados, setPuntosSeleccionados] = useState<PuntoSeleccionado[]>([])
  const [infoRuta, setInfoRuta] = useState<InfoRuta | null>(null)
  const [rutaRealista, setRutaRealista] = useState<RutaRealista | null>(null)
  const [mostrarMenuExportar, setMostrarMenuExportar] = useState(false)
  const [estadisticasRuta, setEstadisticasRuta] = useState<RouteStatistics | null>(null)
  const [calculandoRuta, setCalculandoRuta] = useState(false)

  // Estados para sistema adaptativo
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(getDefaultPreferences())
  const [currentConditions, setCurrentConditions] = useState<CurrentConditions>(getCurrentConditions())
  const [adaptiveAnalysis, setAdaptiveAnalysis] = useState<AdaptiveRouteAnalysis | null>(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())

  // Estados para superapp
  const [usuarioActual, setUsuarioActual] = useState<UsuarioTipo>({
    tipo: "ciudadano",
    id: "user_1",
    nombre: "Usuario Demo",
    permisos: ["ver_mapa", "crear_rutas"],
  })
  const [mostrarCapas, setMostrarCapas] = useState({
    sensores: true,
    comercios: true,
    incidencias: true,
    eventos: false,
    transportePublico: false,
  })
  const [comercioSeleccionado, setComercioSeleccionado] = useState<ComercioLocal | null>(null)
  const [showMunicipalDashboard, setShowMunicipalDashboard] = useState(false)

  // Datos simulados para dashboard municipal
  const [dashboardData] = useState<DashboardMunicipal>({
    sensoresActivos: 24,
    incidenciasAbiertas: 3,
    eventosHoy: 2,
    traficoPromedio: 65,
    calidadAirePromedio: 78,
    alertasActivas: ["Obras en Carrer Major", "Evento en Plaza Mayor"],
    zonasMayorActividad: ["Centro Histórico", "Puerto", "Estación"],
    estadisticasMovilidad: {
      peatonal: 45,
      ciclista: 15,
      vehicular: 30,
      transportePublico: 10,
    },
  })

  // Coordenadas de Blanes, Girona, España
  const posicionInicial: [number, number] = [41.6718, 2.7923]
  const zoomInicial = 14

  // Cargar Leaflet desde CDN
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.L) {
      setLeafletLoaded(true)
      return
    }

    // Cargar CSS de Leaflet
    const linkElement = document.createElement("link")
    linkElement.rel = "stylesheet"
    linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(linkElement)

    // Cargar JavaScript de Leaflet
    const scriptElement = document.createElement("script")
    scriptElement.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    scriptElement.onload = () => {
      setLeafletLoaded(true)
    }
    scriptElement.onerror = () => {
      setError("Error al cargar Leaflet. Por favor, recarga la página.")
    }
    document.head.appendChild(scriptElement)

    return () => {
      // Limpieza si es necesario
    }
  }, [])

  // Función para crear iconos personalizados
  const crearIconoPersonalizado = (tipo: string, seleccionado = false, orden?: number) => {
    if (!window.L) return null

    const L = window.L
    let color = "#3388ff"
    let icono = "📍"

    switch (tipo) {
      case "sensor":
        color = "#10b981"
        icono = "🔬"
        break
      case "poi":
        color = "#3b82f6"
        icono = "📍"
        break
      case "incident":
        color = "#ef4444"
        icono = "⚠️"
        break
      case "comercio":
        color = "#8b5cf6"
        icono = "🏪"
        break
    }

    if (seleccionado) {
      color = "#f59e0b"
    }

    const html = `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        ${seleccionado && orden !== undefined ? orden : icono}
      </div>
    `

    return L.divIcon({
      html: html,
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
  }

  // Función para manejar clic en marcador
  const manejarClicMarcador = (punto: PuntoUrbano) => {
    if (!modoRuta) return

    const yaSeleccionado = puntosSeleccionados.find((p) => p.id === punto.id)

    if (yaSeleccionado) {
      // Deseleccionar punto
      setPuntosSeleccionados((prev) => prev.filter((p) => p.id !== punto.id))
    } else {
      // Seleccionar punto
      const nuevoPunto: PuntoSeleccionado = {
        id: punto.id,
        lat: punto.lat,
        lng: punto.lng,
        name: punto.name,
        order: puntosSeleccionados.length + 1,
      }
      setPuntosSeleccionados((prev) => [...prev, nuevoPunto])
    }
  }

  // Función para manejar clic en comercio
  const manejarClicComercio = (comercio: ComercioLocal) => {
    if (modoRuta) {
      // Si estamos en modo ruta, añadir como punto
      const yaSeleccionado = puntosSeleccionados.find((p) => p.id === comercio.id)

      if (yaSeleccionado) {
        setPuntosSeleccionados((prev) => prev.filter((p) => p.id !== comercio.id))
      } else {
        const nuevoPunto: PuntoSeleccionado = {
          id: comercio.id,
          lat: comercio.lat,
          lng: comercio.lng,
          name: comercio.nombre,
          order: puntosSeleccionados.length + 1,
        }
        setPuntosSeleccionados((prev) => [...prev, nuevoPunto])
      }
    } else {
      // Mostrar información del comercio
      setComercioSeleccionado(comercio)
    }
  }

  // Función para manejar exportación
  const manejarExportacion = (formato: "gpx" | "kml") => {
    if (!infoRuta || puntosSeleccionados.length < 2) {
      alert("Necesitas crear una ruta con al menos 2 puntos antes de exportar.")
      return
    }

    try {
      if (formato === "gpx") {
        exportarGPX(puntosSeleccionados, infoRuta)
      } else {
        exportarKML(puntosSeleccionados, infoRuta)
      }
      setMostrarMenuExportar(false)

      // Mostrar mensaje de éxito
      const mensaje = `Ruta exportada exitosamente en formato ${formato.toUpperCase()}`
      alert(mensaje)
    } catch (error) {
      console.error("Error al exportar:", error)
      alert("Error al exportar la ruta. Por favor, inténtalo de nuevo.")
    }
  }

  // Actualizar marcadores cuando cambian los puntos seleccionados o las capas
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return

    const L = window.L

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => {
      mapRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Crear marcadores para puntos urbanos
    if (mostrarCapas.sensores || mostrarCapas.incidencias) {
      puntos.forEach((punto) => {
        if (
          (punto.type === "sensor" && !mostrarCapas.sensores) ||
          (punto.type === "incident" && !mostrarCapas.incidencias) ||
          (punto.type === "poi" && !mostrarCapas.sensores)
        )
          return

        const seleccionado = puntosSeleccionados.find((p) => p.id === punto.id)
        const icono = crearIconoPersonalizado(punto.type, !!seleccionado, seleccionado?.order)

        const marker = L.marker([punto.lat, punto.lng], { icon: icono })
          .addTo(mapRef.current)
          .bindPopup(`
            <div>
              <h3 style="font-weight: bold; font-size: 16px;">${punto.name}</h3>
              <p style="color: #666;">${punto.description || ""}</p>
              ${punto.value !== undefined ? `<p style="margin-top: 8px;"><span style="font-weight: 600;">Valor:</span> ${punto.value}</p>` : ""}
              ${modoRuta ? `<p style="margin-top: 8px; color: #f59e0b;"><strong>Haz clic para ${seleccionado ? "deseleccionar" : "seleccionar"} este punto</strong></p>` : ""}
            </div>
          `)

        // Añadir evento de clic si estamos en modo ruta
        if (modoRuta) {
          marker.on("click", () => manejarClicMarcador(punto))
        }

        markersRef.current.push(marker)
      })
    }

    // Crear marcadores para comercios
    if (mostrarCapas.comercios) {
      comercios.forEach((comercio) => {
        const seleccionado = puntosSeleccionados.find((p) => p.id === comercio.id)
        const icono = crearIconoPersonalizado("comercio", !!seleccionado, seleccionado?.order)

        const marker = L.marker([comercio.lat, comercio.lng], { icon: icono })
          .addTo(mapRef.current)
          .bindPopup(`
            <div>
              <h3 style="font-weight: bold; font-size: 16px;">${comercio.nombre}</h3>
              <p style="color: #666; text-transform: capitalize;">${comercio.categoria}</p>
              <p style="color: #666;">⭐ ${comercio.rating}/5</p>
              ${comercio.promociones.length > 0 ? `<p style="color: #10b981; font-weight: 600;">🎉 ${comercio.promociones.length} promoción(es) activa(s)</p>` : ""}
              ${modoRuta ? `<p style="margin-top: 8px; color: #f59e0b;"><strong>Haz clic para ${seleccionado ? "deseleccionar" : "añadir a ruta"}</strong></p>` : `<p style="margin-top: 8px; color: #8b5cf6;"><strong>Haz clic para ver detalles</strong></p>`}
            </div>
          `)

        marker.on("click", () => manejarClicComercio(comercio))
        markersRef.current.push(marker)
      })
    }
  }, [puntos, comercios, leafletLoaded, puntosSeleccionados, modoRuta, mostrarCapas])

  // Calcular y mostrar ruta cuando cambian los puntos seleccionados
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || puntosSeleccionados.length < 2) {
      // Limpiar ruta existente
      if (routeLayerRef.current) {
        mapRef.current.removeLayer(routeLayerRef.current)
        routeLayerRef.current = null
      }
      setInfoRuta(null)
      setRutaRealista(null)
      setEstadisticasRuta(null)
      return
    }

    const calcularYMostrarRuta = async () => {
      setCalculandoRuta(true)

      try {
        // Calcular ruta realista
        const transporteMap: Record<typeof tipoTransporte, "caminar" | "ciclismo" | "conducir" | "transporte_publico"> = {
          walking: "caminar",
          cycling: "ciclismo",
          driving: "conducir",
          public_transport: "transporte_publico",
        }
        const rutaReal = await calcularRutaRealista(
          puntosSeleccionados,
          transporteMap[tipoTransporte],
          userPreferences.accessibility.avoidSteepSlopes,
          false, // preferir sombra
        )

        setRutaRealista(rutaReal)

        // Convertir a formato compatible con InfoRuta
        const infoRutaCompatible: InfoRuta = {
          distancia: rutaReal.distancia,
          tiempoEstimado: rutaReal.duracion,
          puntos: rutaReal.puntos,
        }
        setInfoRuta(infoRutaCompatible)

        // Calcular estadísticas avanzadas
        const estadisticas = calculateRouteStatistics(puntosSeleccionados, infoRutaCompatible)
        setEstadisticasRuta(estadisticas)

        const L = window.L

        // Limpiar ruta anterior
        if (routeLayerRef.current) {
          mapRef.current.removeLayer(routeLayerRef.current)
        }

        // Dibujar nueva ruta realista
        routeLayerRef.current = L.polyline(rutaReal.puntos, {
          color: "#f59e0b",
          weight: 4,
          opacity: 0.8,
          dashArray: tipoTransporte === "public_transport" ? "10, 5" : "none",
        }).addTo(mapRef.current)

        // Ajustar vista para mostrar toda la ruta
        if (rutaReal.puntos.length > 0) {
          mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [20, 20] })
        }
      } catch (error) {
        console.error("Error al calcular ruta:", error)
        // Fallback a ruta simple
        const ruta = calcularRutaSimple(puntosSeleccionados)
        setInfoRuta(ruta)

        const L = window.L
        if (routeLayerRef.current) {
          mapRef.current.removeLayer(routeLayerRef.current)
        }

        routeLayerRef.current = L.polyline(ruta.puntos, {
          color: "#ef4444",
          weight: 4,
          opacity: 0.8,
          dashArray: "5, 5",
        }).addTo(mapRef.current)
      } finally {
        setCalculandoRuta(false)
      }
    }

    calcularYMostrarRuta()
  }, [puntosSeleccionados, tipoTransporte, leafletLoaded, userPreferences.accessibility.avoidSteepSlopes])

  // Análisis adaptativo cuando cambian los puntos o estadísticas
  useEffect(() => {
    if (puntosSeleccionados.length >= 2 && estadisticasRuta && infoRuta) {
      const analysis = analyzeAndSuggestImprovements(
        puntosSeleccionados,
        puntos,
        estadisticasRuta,
        userPreferences,
        currentConditions,
      )

      // Filtrar sugerencias descartadas
      analysis.suggestions = analysis.suggestions.filter((suggestion) => !dismissedSuggestions.has(suggestion.id))

      setAdaptiveAnalysis(analysis)
    } else {
      setAdaptiveAnalysis(null)
    }
  }, [
    puntosSeleccionados,
    estadisticasRuta,
    infoRuta,
    puntos,
    userPreferences,
    currentConditions,
    dismissedSuggestions,
  ])

  // Inicializar el mapa cuando Leaflet esté cargado
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return

    // Acceder a Leaflet a través del objeto global L
    const L = window.L
    if (!L) return

    // Crear el mapa
    const map = L.map(mapContainerRef.current).setView(posicionInicial, zoomInicial)
    mapRef.current = map

    // Añadir capa base de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Cargar datos
    const cargarDatos = async () => {
      try {
        const [datos, comerciosData] = await Promise.all([fetchUrbanDataPlaceholder(), fetchComerciosLocales()])
        setPuntos(datos)
        setComercios(comerciosData)
      } catch (err) {
        setError("Error al cargar los datos urbanos")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    cargarDatos()

    // Limpiar al desmontar
    return () => {
      map.remove()
    }
  }, [leafletLoaded])

  // Función para limpiar ruta
  const limpiarRuta = () => {
    setPuntosSeleccionados([])
    setInfoRuta(null)
    setRutaRealista(null)
    setEstadisticasRuta(null)
    setMostrarMenuExportar(false)
    if (routeLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }
  }

  // Función para alternar modo ruta
  const alternarModoRuta = () => {
    if (modoRuta) {
      limpiarRuta()
    }
    setModoRuta(!modoRuta)
  }

  // Función para aplicar sugerencia
  const handleApplySuggestion = (suggestion: RouteSuggestion) => {
    const newPoints = applySuggestion(suggestion, puntosSeleccionados, puntos)
    setPuntosSeleccionados(newPoints)
  }

  // Función para descartar sugerencia
  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions((prev) => new Set([...prev, suggestionId]))
  }

  // Función para actualizar condiciones
  const updateConditions = () => {
    setCurrentConditions(getCurrentConditions())
    setDismissedSuggestions(new Set()) // Reset dismissed suggestions
  }

  // Función para cambiar tipo de usuario
  const cambiarTipoUsuario = (tipo: UsuarioTipo["tipo"]) => {
    setUsuarioActual((prev) => ({ ...prev, tipo }))

    // Ajustar permisos según el tipo
    const permisos = {
      ciudadano: ["ver_mapa", "crear_rutas", "ver_comercios"],
      comerciante: ["ver_mapa", "crear_rutas", "gestionar_comercio", "ver_analytics"],
      administrador: [
        "ver_mapa",
        "crear_rutas",
        "gestionar_comercio",
        "ver_analytics",
        "gestionar_ciudad",
        "ver_sensores",
        "gestionar_incidencias",
      ],
    }

    setUsuarioActual((prev) => ({ ...prev, permisos: permisos[tipo] }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-md z-10 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">SuperApp de Blanes</h2>

          {/* Selector de tipo de usuario */}
          <select
            value={usuarioActual.tipo}
            onChange={(e) => cambiarTipoUsuario(e.target.value as UsuarioTipo["tipo"])}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="ciudadano">👤 Ciudadano</option>
            <option value="comerciante">🏪 Comerciante</option>
            <option value="administrador">🏛️ Administrador</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            className={`p-2 rounded-md transition-colors ${
              modoRuta ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={alternarModoRuta}
            title={modoRuta ? "Desactivar modo ruta" : "Activar modo ruta"}
          >
            <Navigation className="h-5 w-5" />
            <span className="sr-only">Modo Ruta</span>
          </button>

          {/* Selector de transporte en modo ruta */}
          {modoRuta && (
            <select
              value={tipoTransporte}
              onChange={(e) => setTipoTransporte(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="walking">🚶 Caminando</option>
              <option value="cycling">🚴 Bicicleta</option>
              <option value="driving">🚗 Coche</option>
              <option value="public_transport">🚌 Transporte Público</option>
            </select>
          )}

          <button
            onClick={() => setShowPreferences(true)}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            title="Configurar preferencias"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Preferencias</span>
          </button>

          {/* Control de capas */}
          <div className="relative">
            <button
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => setMostrarCapas((prev) => ({ ...prev, sensores: !prev.sensores }))}
            >
              <Layers className="h-5 w-5" />
              <span className="sr-only">Capas</span>
            </button>
          </div>

          {usuarioActual.tipo === "comerciante" && (
            <button
              className="p-2 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors"
              title="Panel de comerciante"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Comercio</span>
            </button>
          )}

          {usuarioActual.tipo === "administrador" && (
            <button
              onClick={() => setShowMunicipalDashboard(true)}
              className="p-2 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              title="Dashboard municipal"
            >
              <Shield className="h-5 w-5" />
              <span className="sr-only">Administración</span>
            </button>
          )}

          <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <Users className="h-5 w-5" />
            <span className="sr-only">Comunidad</span>
          </button>
        </div>
      </div>

      {/* Panel de información de ruta */}
      {modoRuta && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-orange-800 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Planificador de Rutas Inteligente
              {calculandoRuta && <span className="ml-2 text-sm">(Calculando...)</span>}
            </h3>
            <div className="flex items-center space-x-2">
              {/* Botón de exportar */}
              {puntosSeleccionados.length >= 2 && infoRuta && (
                <div className="relative">
                  <button
                    onClick={() => setMostrarMenuExportar(!mostrarMenuExportar)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors flex items-center text-sm"
                    title="Exportar ruta"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Exportar
                  </button>

                  {/* Menú desplegable de exportación */}
                  {mostrarMenuExportar && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                      <div className="py-1">
                        <button
                          onClick={() => manejarExportacion("gpx")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Exportar como GPX
                          <span className="ml-auto text-xs text-gray-500">GPS</span>
                        </button>
                        <button
                          onClick={() => manejarExportacion("kml")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Exportar como KML
                          <span className="ml-auto text-xs text-gray-500">Google Earth</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {puntosSeleccionados.length > 0 && (
                <button
                  onClick={limpiarRuta}
                  className="text-orange-600 hover:text-orange-800 flex items-center text-sm"
                >
                  <X className="mr-1 h-4 w-4" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {puntosSeleccionados.length === 0 && (
            <p className="text-orange-700 text-sm">
              Haz clic en los puntos del mapa para crear una ruta inteligente. Selecciona al menos 2 puntos.
            </p>
          )}

          {puntosSeleccionados.length === 1 && (
            <p className="text-orange-700 text-sm">
              Punto seleccionado: <strong>{puntosSeleccionados[0].name}</strong>. Selecciona otro punto para crear la
              ruta.
            </p>
          )}

          {puntosSeleccionados.length > 1 && infoRuta && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-orange-200 px-2 py-1 rounded">📏 {(infoRuta.distancia / 1000).toFixed(2)} km</span>
                <span className="bg-orange-200 px-2 py-1 rounded">⏱️ {infoRuta.tiempoEstimado} min</span>
                <span className="bg-orange-200 px-2 py-1 rounded">📍 {puntosSeleccionados.length} puntos</span>
                <span className="bg-blue-200 px-2 py-1 rounded">
                  {tipoTransporte === "walking"
                    ? "🚶"
                    : tipoTransporte === "cycling"
                      ? "🚴"
                      : tipoTransporte === "driving"
                        ? "🚗"
                        : "🚌"}
                  {tipoTransporte === "walking"
                    ? "Caminando"
                    : tipoTransporte === "cycling"
                      ? "Bicicleta"
                      : tipoTransporte === "driving"
                        ? "Coche"
                        : "Transporte Público"}
                </span>
                {rutaRealista && <span className="bg-green-200 px-2 py-1 rounded">✅ Ruta realista</span>}
              </div>

              {rutaRealista && rutaRealista.alertas.length > 0 && (
                <div className="text-sm">
                  <strong className="text-red-600">Alertas:</strong>
                  <ul className="list-disc list-inside text-red-600 ml-2">
                    {rutaRealista.alertas.map((alerta, index) => (
                      <li key={index}>{alerta}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-sm text-orange-700">
                <strong>Ruta:</strong>{" "}
                {puntosSeleccionados.map((p, i) => (
                  <span key={p.id}>
                    {i > 0 && " → "}
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Panel de estadísticas avanzadas */}
      {modoRuta && estadisticasRuta && infoRuta && (
        <div className="p-4 bg-gray-50 border-b">
          <RouteStatisticsPanel statistics={estadisticasRuta} distanceKm={infoRuta.distancia / 1000} />
        </div>
      )}

      {/* Panel de sugerencias adaptativas */}
      {modoRuta && adaptiveAnalysis && (
        <div className="p-4 bg-gray-50 border-b">
          <AdaptiveSuggestionsPanel
            analysis={adaptiveAnalysis}
            onApplySuggestion={handleApplySuggestion}
            onDismissSuggestion={handleDismissSuggestion}
          />
        </div>
      )}

      {/* Overlay para cerrar menú de exportar */}
      {mostrarMenuExportar && <div className="fixed inset-0 z-10" onClick={() => setMostrarMenuExportar(false)} />}

      <div className="relative flex-grow">
        {/* Estado de carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          </div>
        )}

        {/* El contenedor del mapa */}
        <div ref={mapContainerRef} className="h-full w-full" style={{ minHeight: "500px" }} />
      </div>

      <div className="bg-white p-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {puntos.length} sensores/POIs • {comercios.length} comercios
            {modoRuta && puntosSeleccionados.length > 0 && (
              <span className="ml-2 text-orange-600">• {puntosSeleccionados.length} seleccionados para ruta</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={async () => {
                setIsLoading(true)
                try {
                  const [nuevoDatos, nuevosComerciosData] = await Promise.all([
                    fetchUrbanDataPlaceholder(),
                    fetchComerciosLocales(),
                  ])
                  setPuntos(nuevoDatos)
                  setComercios(nuevosComerciosData)
                  updateConditions() // Actualizar condiciones
                  limpiarRuta()
                } catch (err) {
                  setError("Error al actualizar los datos")
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              Actualizar datos
            </button>
          </div>
        </div>
      </div>

      {/* Panel de preferencias */}
      <UserPreferencesPanel
        preferences={userPreferences}
        onPreferencesChange={setUserPreferences}
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />

      {/* Panel de comercio */}
      {comercioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setComercioSeleccionado(null)}
              className="absolute top-4 right-4 z-[1002] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <ComercioPanel
              comercio={comercioSeleccionado}
              analytics={{
                visitasSemanales: 245,
                horasPico: ["12:00-14:00", "20:00-22:00"],
                origenVisitantes: [
                  { zona: "Centro", porcentaje: 45 },
                  { zona: "Puerto", porcentaje: 30 },
                  { zona: "Residencial", porcentaje: 25 },
                ],
                conversionPromociones: 15,
                ratingPromedio: comercioSeleccionado.rating,
                comentariosRecientes: ["Excelente servicio", "Muy buena comida", "Ambiente agradable"],
                competenciaZona: [],
                recomendacionesMejora: [
                  "Ampliar horario de fin de semana",
                  "Mejorar presencia en redes sociales",
                  "Ofrecer más opciones veganas",
                ],
              }}
              onCrearPromocion={(promocion) => {
                console.log("Nueva promoción:", promocion)
                setComercioSeleccionado(null)
              }}
              onActualizarHorarios={(horarios) => {
                console.log("Horarios actualizados:", horarios)
              }}
            />
          </div>
        </div>
      )}

      {/* Dashboard Municipal */}
      {showMunicipalDashboard && usuarioActual.tipo === "administrador" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setShowMunicipalDashboard(false)}
              className="absolute top-4 right-4 z-[1002] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <MunicipalDashboard
              dashboard={dashboardData}
              sensores={[
                {
                  id: "sensor_1",
                  tipo: "calidad_aire",
                  lat: 41.6718,
                  lng: 2.7923,
                  valor: 78,
                  unidad: "AQI",
                  ultimaActualizacion: new Date(),
                  estado: "activo",
                  umbralAlerta: 100,
                  historico: [],
                },
                {
                  id: "sensor_2",
                  tipo: "ruido",
                  lat: 41.675,
                  lng: 2.795,
                  valor: 65,
                  unidad: "dB",
                  ultimaActualizacion: new Date(),
                  estado: "activo",
                  umbralAlerta: 70,
                  historico: [],
                },
              ]}
              incidencias={[
                {
                  id: "inc_1",
                  tipo: "obra",
                  titulo: "Renovación Carrer Major",
                  descripcion: "Obras de mejora del pavimento",
                  lat: 41.673,
                  lng: 2.79,
                  fechaInicio: new Date(),
                  gravedad: "media",
                  afectaTrafico: true,
                  callesAfectadas: ["Carrer Major"],
                  desviosRecomendados: ["Carrer de la Pau"],
                  contactoResponsable: "Obras Públicas",
                  estado: "activa",
                },
              ]}
              eventos={[
                {
                  id: "evento_1",
                  titulo: "Festival de Verano",
                  descripcion: "Conciertos y actividades culturales",
                  fechaInicio: new Date(),
                  fechaFin: new Date(Date.now() + 3 * 60 * 60 * 1000),
                  ubicacion: {
                    lat: 41.675,
                    lng: 2.795,
                    direccion: "Plaza Mayor",
                  },
                  categoria: "cultural",
                  organizador: "Ayuntamiento de Blanes",
                  inscripcionRequerida: false,
                  gratuito: true,
                  contacto: "cultura@blanes.cat",
                  afectaTrafico: true,
                  corteCalles: ["Plaza Mayor", "Carrer de la Pau"],
                },
              ]}
              onCrearIncidencia={(incidencia) => {
                console.log("Nueva incidencia:", incidencia)
              }}
              onResolverIncidencia={(id) => {
                console.log("Resolver incidencia:", id)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
