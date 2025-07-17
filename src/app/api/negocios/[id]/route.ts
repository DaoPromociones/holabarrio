
import { NextResponse } from 'next/server';
import { negocioServiceInstance } from '@/lib/di-container';
import { Negocio } from '@/core/models/negocio';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const negocio = await negocioServiceInstance.getNegocioById(params.id);
    if (!negocio) {
      return NextResponse.json({ error: 'Negocio not found' }, { status: 404 });
    }
    return NextResponse.json(negocio);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch negocio' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updatedNegocio = await negocioServiceInstance.updateNegocio(params.id, body as Negocio);
    if (!updatedNegocio) {
      return NextResponse.json({ error: 'Negocio not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNegocio);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update negocio' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await negocioServiceInstance.deleteNegocio(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Negocio not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete negocio' }, { status: 500 });
  }
}
