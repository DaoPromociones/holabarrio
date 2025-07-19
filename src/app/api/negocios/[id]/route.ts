import { NextResponse } from 'next/server';
import { negocioServiceInstance } from '@/lib/di-container';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    // CORREGIDO: Usamos el nombre estándar 'findById'
    const negocio = await negocioServiceInstance.findById(params.id);
    if (!negocio) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }
    return NextResponse.json(negocio);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el negocio' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();
    // CORREGIDO: Usamos el nombre estándar 'update'
    const updatedNegocio = await negocioServiceInstance.update(params.id, body);
    return NextResponse.json(updatedNegocio);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar el negocio' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    // CORREGIDO: Usamos el nombre estándar 'delete'
    await negocioServiceInstance.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el negocio' }, { status: 500 });
  }
}