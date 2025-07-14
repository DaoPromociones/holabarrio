// src/app/api/users/route.ts
import { userServiceInstance } from "@/lib/di-container";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await userServiceInstance.getAllUsers();
    return NextResponse.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Nuestro servicio ya sabe cómo crear un usuario gracias a la corrección.
    const newUser = await userServiceInstance.createUser(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}