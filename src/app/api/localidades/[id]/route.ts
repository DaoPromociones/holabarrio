import { NextResponse } from "next/server";
import { localidadServiceInstance } from "@/lib/di-container";

interface RouteContext {
  params: {
    id: string; // El ID de la ruta siempre es string
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const id = parseInt(params.id, 10); // Convertimos a número
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de localidad inválido" }, { status: 400 });
    }
    const localidad = await localidadServiceInstance.findById(id);

    if (!localidad) {
      return NextResponse.json({ error: "Localidad no encontrada" }, { status: 404 });
    }
    return NextResponse.json(localidad);
  } catch (error) {
    console.error(`Error al obtener la localidad ${params.id}:`, error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de localidad inválido" }, { status: 400 });
    }
    const data = await request.json();
    const updatedLocalidad = await localidadServiceInstance.update(id, data);
    return NextResponse.json(updatedLocalidad);
  } catch (error) {
    console.error(`Error al actualizar la localidad ${params.id}:`, error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de localidad inválido" }, { status: 400 });
    }
    await localidadServiceInstance.delete(id);
    return NextResponse.json({ message: "Localidad eliminada con éxito" });
  } catch (error) {
    console.error(`Error al eliminar la localidad ${params.id}:`, error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 400 });
  }
}