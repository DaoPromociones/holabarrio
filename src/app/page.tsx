// src/app/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a HolaBarrio</h1>
      {session ? (
        <div className="flex flex-col items-center gap-4">
          <p>Sesión iniciada como: <strong>{session.user?.name || session.user?.email}</strong></p>
          <button 
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p>No has iniciado sesión.</p>
          <button 
            onClick={() => signIn("google")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Iniciar Sesión con Google
          </button>
          <button 
            onClick={() => signIn("github")}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Iniciar Sesión con GitHub
          </button>
        </div>
      )}
    </main>
  );
}