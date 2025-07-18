// Tipos extendidos para la superapp municipal

export interface UsuarioTipo {
  tipo: "ciudadano" | "comerciante" | "administrador"
  id: string
  nombre: string
  permisos: string[]
}

export interface ComercioLocal {
  id: string
  nombre: string
  categoria: "restaurante" | "tienda" | "servicio" | "ocio" | "salud" | "educacion"
  lat: number
  lng: number
  horarios: {
    [dia: string]: { apertura: string; cierre: string; cerrado?: boolean }
  }
  promociones: PromocionActiva[]
  rating: number
  fotos: string[]
  contacto: {
    telefono?: string
    email?: string
    web?: string
    redes?: { [red: string]: string }
  }
  servicios: string[]
  accesibilidad: {
    rampaAcceso: boolean
    aseoAdaptado: boolean
    espacioSillaRuedas: boolean
  }
  delivery: {
    disponible: boolean
    radioKm?: number
    tiempoEstimado?: number
    costeMinimo?: number
  }
}

export interface EventoMunicipal {
  id: string
  titulo: string
  descripcion: string
  fechaInicio: Date
  fechaFin: Date
  ubicacion: {
    lat: number
    lng: number
    direccion: string
  }
  categoria: "cultural" | "deportivo" | "administrativo" | "festivo" | "educativo"
  organizador: string
  capacidad?: number
  inscripcionRequerida: boolean
  gratuito: boolean
  precio?: number
  contacto: string
  afectaTrafico: boolean
  corteCalles: string[]
}

export interface SensorIoT {
  id: string
  tipo: "calidad_aire" | "ruido" | "trafico" | "temperatura" | "humedad" | "luminosidad" | "ocupacion"
  lat: number
  lng: number
  valor: number
  unidad: string
  ultimaActualizacion: Date
  estado: "activo" | "mantenimiento" | "error"
  umbralAlerta?: number
  historico: { timestamp: Date; valor: number }[]
}

export interface IncidenciaUrbana {
  id: string
  tipo: "obra" | "accidente" | "evento" | "mantenimiento" | "emergencia"
  titulo: string
  descripcion: string
  lat: number
  lng: number
  fechaInicio: Date
  fechaFin?: Date
  gravedad: "baja" | "media" | "alta" | "critica"
  afectaTrafico: boolean
  callesAfectadas: string[]
  desviosRecomendados: string[]
  contactoResponsable: string
  estado: "planificada" | "activa" | "resuelta"
}

export interface RutaRealista {
  puntos: [number, number][]
  instrucciones: InstruccionNavegacion[]
  distancia: number
  duracion: number
  tipoTransporte: "caminar" | "ciclismo" | "conducir" | "transporte_publico"
  elevacion?: number[]
  superficies: ("asfalto" | "adoquin" | "tierra" | "escalones")[]
  accesibilidad: {
    sillaRuedas: boolean
    problemasMovilidad: string[]
  }
  puntosInteres: string[]
  alertas: string[]
}

export interface InstruccionNavegacion {
  distancia: number
  duracion: number
  instruccion: string
  direccion: "straight" | "left" | "right" | "sharp_left" | "sharp_right" | "u_turn"
  nombreCalle: string
  coordenada: [number, number]
}

export interface PromocionActiva {
  id: string
  titulo: string
  descripcion: string
  descuento: number
  tipoDescuento: "porcentaje" | "cantidad" | "2x1" | "regalo"
  fechaInicio: Date
  fechaFin: Date
  condiciones: string[]
  codigoPromocional?: string
  usosPorUsuario: number
  usosRestantes: number
  geoRestriccion?: {
    radio: number // metros
    zonas: string[]
  }
}

export interface AnalyticsComerciante {
  visitasSemanales: number
  horasPico: string[]
  origenVisitantes: { zona: string; porcentaje: number }[]
  conversionPromociones: number
  ratingPromedio: number
  comentariosRecientes: string[]
  competenciaZona: ComercioLocal[]
  recomendacionesMejora: string[]
}

export interface DashboardMunicipal {
  sensoresActivos: number
  incidenciasAbiertas: number
  eventosHoy: number
  traficoPromedio: number
  calidadAirePromedio: number
  alertasActivas: string[]
  zonasMayorActividad: string[]
  estadisticasMovilidad: {
    peatonal: number
    ciclista: number
    vehicular: number
    transportePublico: number
  }
}