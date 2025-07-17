-- CreateEnum
CREATE TYPE "TipoPrivacidadComunidad" AS ENUM ('publica', 'privada_con_aprobacion', 'secreta_por_invitacion');

-- CreateEnum
CREATE TYPE "RolEnComunidadTipo" AS ENUM ('administrador', 'moderador', 'miembro');

-- CreateEnum
CREATE TYPE "EstadoMiembroComunidadTipo" AS ENUM ('activo', 'pendiente_aprobacion', 'invitado', 'bloqueado', 'rechazado');

-- CreateEnum
CREATE TYPE "EstadoModeracionGeneralTipo" AS ENUM ('pendiente', 'aprobado', 'rechazado', 'escalado_a_admin');

-- CreateEnum
CREATE TYPE "ModalidadServicioBtTipo" AS ENUM ('presencial', 'online', 'mixta');

-- CreateEnum
CREATE TYPE "EstadoIntercambioBtTipo" AS ENUM ('solicitado', 'acordado', 'en_progreso', 'completado', 'cancelado_oferente', 'cancelado_solicitante', 'disputado', 'pendiente_confirmacion');

-- CreateEnum
CREATE TYPE "EntidadSelloTipo" AS ENUM ('negocio', 'oferta', 'profesional');

-- CreateEnum
CREATE TYPE "TipoEntidadPublica" AS ENUM ('policia', 'bomberos', 'ayuntamiento', 'proteccion_civil', 'centro_salud', 'otro');

-- CreateEnum
CREATE TYPE "TipoAvisoOficial" AS ENUM ('trafico', 'evento_cultural', 'emergencia', 'aviso_informativo', 'fiestas_locales', 'otro');

-- CreateEnum
CREATE TYPE "RolUsuarioEntidad" AS ENUM ('publicador', 'gestor');

-- CreateTable
CREATE TABLE "Localidad" (
    "id" SERIAL NOT NULL,
    "nombreLocalidad" TEXT NOT NULL,
    "provincia" TEXT,
    "comarca" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'España',
    "latitudCentro" DECIMAL(65,30),
    "longitudCentro" DECIMAL(65,30),
    "codigoPostalPrincipal" TEXT,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaNegocio" (
    "id" SERIAL NOT NULL,
    "nombreCategoria" JSONB NOT NULL,
    "descripcion" JSONB,
    "iconoUrl" TEXT,

    CONSTRAINT "CategoriaNegocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Negocio" (
    "id" TEXT NOT NULL,
    "propietarioId" TEXT NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "nombreNegocio" JSONB NOT NULL,
    "descripcion" JSONB,
    "direccionFisica" TEXT,
    "latitud" DECIMAL(65,30),
    "longitud" DECIMAL(65,30),
    "telefono" TEXT,
    "correoElectronicoNegocio" TEXT,
    "sitioWebUrl" TEXT,
    "redesSociales" JSONB,
    "galeriaFotosUrls" TEXT[],
    "horarioApertura" JSONB,
    "estaActivo" BOOLEAN NOT NULL DEFAULT false,
    "planSuscripcion" TEXT NOT NULL DEFAULT 'gratuito',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Negocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NegocioCategoriaUnion" (
    "negocioId" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "NegocioCategoriaUnion_pkey" PRIMARY KEY ("negocioId","categoriaId")
);

-- CreateTable
CREATE TABLE "CategoriaOferta" (
    "id" SERIAL NOT NULL,
    "nombreCategoria" JSONB NOT NULL,
    "descripcion" JSONB,
    "iconoUrl" TEXT,

    CONSTRAINT "CategoriaOferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "tituloOferta" JSONB NOT NULL,
    "descripcionCorta" JSONB,
    "descripcionLarga" JSONB,
    "precio" DECIMAL(65,30) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'EUR',
    "capacidadMaxima" INTEGER,
    "fechaInicioValidez" DATE,
    "fechaFinValidez" DATE,
    "horaInicio" TEXT,
    "horaFin" TEXT,
    "duracionMinutos" INTEGER,
    "imagenPrincipalUrl" TEXT,
    "estaActiva" BOOLEAN NOT NULL DEFAULT false,
    "detallesUbicacion" JSONB,
    "politicaCancelacion" JSONB,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfertaCategoriaUnion" (
    "ofertaId" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "OfertaCategoriaUnion_pkey" PRIMARY KEY ("ofertaId","categoriaId")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "fechaReservaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaServicioReservado" DATE NOT NULL,
    "horaServicioReservado" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioTotal" DECIMAL(65,30) NOT NULL,
    "estadoReserva" TEXT NOT NULL DEFAULT 'pendiente',
    "idPagoStripe" TEXT,
    "qrCodigoUrl" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valoracion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "negocioId" TEXT,
    "ofertaId" TEXT,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Valoracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "negocioId" TEXT,
    "ofertaId" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidenciaCiudadana" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "localidadId" INTEGER NOT NULL,
    "tituloIncidencia" TEXT NOT NULL,
    "descripcionIncidencia" TEXT NOT NULL,
    "latitud" DECIMAL(65,30),
    "longitud" DECIMAL(65,30),
    "direccionReportada" TEXT,
    "estadoIncidencia" TEXT NOT NULL DEFAULT 'pendiente',
    "imagenUrl" TEXT,
    "tipoIncidencia" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidenciaCiudadana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComunidadVecinal" (
    "idComunidad" TEXT NOT NULL,
    "nombreComunidad" JSONB NOT NULL,
    "descripcionComunidad" JSONB,
    "localidadId" INTEGER NOT NULL,
    "creadorUsuarioId" TEXT NOT NULL,
    "tipoPrivacidad" "TipoPrivacidadComunidad" NOT NULL DEFAULT 'publica',
    "imagenPortadaUrl" TEXT,
    "reglasComunidad" JSONB,
    "estadoModeracion" "EstadoModeracionGeneralTipo" NOT NULL DEFAULT 'pendiente',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComunidadVecinal_pkey" PRIMARY KEY ("idComunidad")
);

-- CreateTable
CREATE TABLE "ComunidadMiembro" (
    "comunidadId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rolEnComunidad" "RolEnComunidadTipo" NOT NULL DEFAULT 'miembro',
    "fechaUnion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoMiembro" "EstadoMiembroComunidadTipo" NOT NULL DEFAULT 'pendiente_aprobacion',

    CONSTRAINT "ComunidadMiembro_pkey" PRIMARY KEY ("comunidadId","usuarioId")
);

-- CreateTable
CREATE TABLE "PublicacionComunidad" (
    "idPublicacion" TEXT NOT NULL,
    "comunidadId" TEXT NOT NULL,
    "usuarioAutorId" TEXT NOT NULL,
    "contenidoTexto" TEXT NOT NULL,
    "adjuntosUrls" TEXT[],
    "hiloRespuestaAId" TEXT,
    "estadoModeracion" "EstadoModeracionGeneralTipo" NOT NULL DEFAULT 'pendiente',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicacionComunidad_pkey" PRIMARY KEY ("idPublicacion")
);

-- CreateTable
CREATE TABLE "BancoTiempoServicio" (
    "idServicioBt" TEXT NOT NULL,
    "usuarioOferenteId" TEXT NOT NULL,
    "tituloServicio" JSONB NOT NULL,
    "descripcionHabilidad" JSONB,
    "categoriaServicioBt" TEXT,
    "horasEstimadasOValorTiempo" DECIMAL(65,30),
    "modalidad" "ModalidadServicioBtTipo" NOT NULL DEFAULT 'presencial',
    "localidadId" INTEGER,
    "estaActivoBt" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BancoTiempoServicio_pkey" PRIMARY KEY ("idServicioBt")
);

-- CreateTable
CREATE TABLE "IntercambioTiempoRegistrado" (
    "idIntercambioBt" TEXT NOT NULL,
    "servicioIdBt" TEXT NOT NULL,
    "usuarioSolicitanteId" TEXT NOT NULL,
    "usuarioOferenteId" TEXT NOT NULL,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaAcuerdo" TIMESTAMP(3),
    "fechaRealizacionPrevista" TIMESTAMP(3),
    "fechaRealizacionEfectiva" TIMESTAMP(3),
    "estadoIntercambio" "EstadoIntercambioBtTipo" NOT NULL DEFAULT 'solicitado',
    "notasIntercambio" TEXT,
    "valoracionDelIntercambioOferente" JSONB,
    "valoracionDelIntercambioSolicitante" JSONB,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntercambioTiempoRegistrado_pkey" PRIMARY KEY ("idIntercambioBt")
);

-- CreateTable
CREATE TABLE "SelloAutenticidadLocal" (
    "idSello" TEXT NOT NULL,
    "nombreSello" JSONB NOT NULL,
    "descripcionSello" JSONB,
    "criteriosObtencion" JSONB,
    "iconoSelloUrl" TEXT,
    "gestionadoPorLocalidadId" INTEGER,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelloAutenticidadLocal_pkey" PRIMARY KEY ("idSello")
);

-- CreateTable
CREATE TABLE "EntidadConSello" (
    "selloId" TEXT NOT NULL,
    "entidadTipo" "EntidadSelloTipo" NOT NULL,
    "entidadId" TEXT NOT NULL,
    "fechaOtorgamiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "otorgadoPorUsuarioId" TEXT,
    "metadataAdicional" JSONB,

    CONSTRAINT "EntidadConSello_pkey" PRIMARY KEY ("selloId","entidadId","entidadTipo")
);

-- CreateTable
CREATE TABLE "RolSistema" (
    "idRol" SERIAL NOT NULL,
    "nombreRol" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolSistema_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "UsuarioRolSistema" (
    "idAsignacion" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    "localidadId" INTEGER,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "metadataAsignacion" JSONB,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioRolSistema_pkey" PRIMARY KEY ("idAsignacion")
);

-- CreateTable
CREATE TABLE "EntidadPublica" (
    "id" TEXT NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "nombreEntidad" TEXT NOT NULL,
    "tipoEntidad" "TipoEntidadPublica" NOT NULL,
    "descripcion" TEXT,
    "contacto" JSONB,
    "logoUrl" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntidadPublica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvisoOficial" (
    "id" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "usuarioPublicadorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipoAviso" "TipoAvisoOficial" NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvisoOficial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioPorEntidad" (
    "usuarioId" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "rol" "RolUsuarioEntidad" NOT NULL,

    CONSTRAINT "UsuarioPorEntidad_pkey" PRIMARY KEY ("usuarioId","entidadId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Localidad_nombreLocalidad_key" ON "Localidad"("nombreLocalidad");

-- CreateIndex
CREATE UNIQUE INDEX "Negocio_correoElectronicoNegocio_key" ON "Negocio"("correoElectronicoNegocio");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_idPagoStripe_key" ON "Reserva"("idPagoStripe");

-- CreateIndex
CREATE UNIQUE INDEX "RolSistema_nombreRol_key" ON "RolSistema"("nombreRol");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRolSistema_usuarioId_rolId_localidadId_key" ON "UsuarioRolSistema"("usuarioId", "rolId", "localidadId");

-- AddForeignKey
ALTER TABLE "Negocio" ADD CONSTRAINT "Negocio_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegocioCategoriaUnion" ADD CONSTRAINT "NegocioCategoriaUnion_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegocioCategoriaUnion" ADD CONSTRAINT "NegocioCategoriaUnion_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaNegocio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfertaCategoriaUnion" ADD CONSTRAINT "OfertaCategoriaUnion_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfertaCategoriaUnion" ADD CONSTRAINT "OfertaCategoriaUnion_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaOferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidenciaCiudadana" ADD CONSTRAINT "IncidenciaCiudadana_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComunidadVecinal" ADD CONSTRAINT "ComunidadVecinal_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComunidadMiembro" ADD CONSTRAINT "ComunidadMiembro_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "ComunidadVecinal"("idComunidad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionComunidad" ADD CONSTRAINT "PublicacionComunidad_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "ComunidadVecinal"("idComunidad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionComunidad" ADD CONSTRAINT "PublicacionComunidad_hiloRespuestaAId_fkey" FOREIGN KEY ("hiloRespuestaAId") REFERENCES "PublicacionComunidad"("idPublicacion") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BancoTiempoServicio" ADD CONSTRAINT "BancoTiempoServicio_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntercambioTiempoRegistrado" ADD CONSTRAINT "IntercambioTiempoRegistrado_servicioIdBt_fkey" FOREIGN KEY ("servicioIdBt") REFERENCES "BancoTiempoServicio"("idServicioBt") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelloAutenticidadLocal" ADD CONSTRAINT "SelloAutenticidadLocal_gestionadoPorLocalidadId_fkey" FOREIGN KEY ("gestionadoPorLocalidadId") REFERENCES "Localidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntidadConSello" ADD CONSTRAINT "EntidadConSello_selloId_fkey" FOREIGN KEY ("selloId") REFERENCES "SelloAutenticidadLocal"("idSello") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRolSistema" ADD CONSTRAINT "UsuarioRolSistema_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "RolSistema"("idRol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRolSistema" ADD CONSTRAINT "UsuarioRolSistema_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntidadPublica" ADD CONSTRAINT "EntidadPublica_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisoOficial" ADD CONSTRAINT "AvisoOficial_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "EntidadPublica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPorEntidad" ADD CONSTRAINT "UsuarioPorEntidad_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "EntidadPublica"("id") ON DELETE CASCADE ON UPDATE CASCADE;
