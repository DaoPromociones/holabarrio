// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { userServiceInstance } from "@/lib/di-container";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos." }, { status: 400 });
    }

    const existingUser = await userServiceInstance.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userServiceInstance.create({
      name: name || email.split('@')[0],
      email: email,
      password: hashedPassword,
      nombreUsuario: name || email.split('@')[0],
      emailVerified: null,
      image: null,
    });

    // @ts-ignore - Omitimos la contraseña en la respuesta por seguridad
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ error: "Error en el servidor." }, { status: 500 });
  }
}