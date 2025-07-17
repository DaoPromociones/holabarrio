// src/core/models/negocio.ts
import { Json } from "../types/json";

export interface Negocio {
  id: string;
  propietarioId: string;
  localidadId: number;
  nombreNegocio: Json;
  descripcion?: Json;
  direccionFisica?: string;
  latitud?: number; // Corregido de Decimal a number
  longitud?: number; // Corregido de Decimal a number
  telefono?: string;
  correoElectronicoNegocio?: string;
  sitioWebUrl?: string;
  redesSociales?: Json;
  galeriaFotosUrls: string[];
  horarioApertura?: Json;
  estaActivo: boolean;
  planSuscripcion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}