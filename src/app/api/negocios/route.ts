import { NextResponse } from 'next/server';
import { negocioServiceInstance } from '@/lib/di-container';

export async function GET() {
  try {
    // CORREGIDO: Usamos el nombre estándar 'findAll'
    const negocios = await negocioServiceInstance.findAll();
    return NextResponse.json(negocios);
  } catch (error) {
    // CORREGIDO: Mensaje en español
    return NextResponse.json({ error: 'Error al obtener los negocios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // CORREGIDO: Usamos el nombre estándar 'create'
    const newNegocio = await negocioServiceInstance.create(body);
    return NextResponse.json(newNegocio, { status: 201 });
  } catch (error) {
    // CORREGIDO: Mensaje en español
    return NextResponse.json({ error: 'Error al crear el negocio' }, { status: 500 });
  }
}