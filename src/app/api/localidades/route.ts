// src/app/api/localidades/route.ts
import { NextResponse } from "next/server";
import { localidadServiceInstance } from "@/lib/di-container";

export async function GET() {
  try {
    const localidades = await localidadServiceInstance.findAll();
    return NextResponse.json(localidades);
  } catch (error) {
    console.error("Error al obtener las localidades:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevaLocalidad = await localidadServiceInstance.create(data);
    return NextResponse.json(nuevaLocalidad, { status: 201 });
  } catch (error) {
    console.error("Error al crear la localidad:", error);
    // Podríamos añadir una validación más específica aquí
    return NextResponse.json({ error: "Error en el servidor" }, { status: 400 });
  }
}