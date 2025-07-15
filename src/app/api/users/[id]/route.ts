
// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { userServiceInstance } from "@/lib/di-container";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const user = await userServiceInstance.getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const data = await request.json();
    const updatedUser = await userServiceInstance.updateUser(id, data);

    return NextResponse.json(updatedUser);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    await userServiceInstance.deleteUser(id);

    return NextResponse.json({ message: "Usuario eliminado con éxito" });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}