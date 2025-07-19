import { Json } from "@/core/types/json"; // <-- Importación corregida con alias

export interface Negocio {
  id: string;
  propietarioId: string;
  localidadId: number;
  nombreNegocio: Json;
  descripcion: Json | null;
  direccionFisica: string | null;
  latitud: number | null;
  longitud: number | null;
  telefono: string | null;
  correoElectronicoNegocio: string | null;
  sitioWebUrl: string | null;
  redesSociales: Json | null;
  galeriaFotosUrls: string[];
  horarioApertura: Json | null;
  estaActivo: boolean;
  planSuscripcion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  categoryIds?: number[];
}