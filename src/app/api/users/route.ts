// src/app/api/users/route.ts
import { userServiceInstance } from "@/lib/di-container";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await userServiceInstance.findAll(); // <-- CORREGIDO
    return NextResponse.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newUser = await userServiceInstance.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}