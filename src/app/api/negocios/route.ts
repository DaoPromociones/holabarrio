
import { NextResponse } from 'next/server';
import { negocioServiceInstance } from '@/lib/di-container';
import { Negocio } from '@/core/models/negocio';

export async function GET() {
  try {
    const negocios = await negocioServiceInstance.getAllNegocios();
    return NextResponse.json(negocios);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch negocios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNegocio = await negocioServiceInstance.createNegocio(body as Negocio);
    return NextResponse.json(newNegocio, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create negocio' }, { status: 500 });
  }
}
