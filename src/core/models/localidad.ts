// src/core/models/localidad.ts

export interface Localidad {
  id: number;
  nombreLocalidad: string;
  provincia: string | null;
  comarca: string | null;
  pais: string;
  latitudCentro: number | null;
  longitudCentro: number | null;
  codigoPostalPrincipal: string | null;
  estaActiva: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}