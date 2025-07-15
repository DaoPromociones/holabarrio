// src/app/admin/users/page.tsx
import { userServiceInstance } from "@/lib/di-container";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  // 1. Obtenemos la sesión en el servidor
  const session = await getServerSession(authOptions);

  // 2. Si no hay sesión, redirigimos al login
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin/users");
  }
   // --- NUEVA COMPROBACIÓN ---
  // Si el usuario tiene sesión pero no es ADMIN, lo redirigimos a la página principal.
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // 3. Si hay sesión, obtenemos los datos y renderizamos la página
  const users = await userServiceInstance.getAllUsers();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Panel de Administración de Usuarios</h1>
      {/* El resto de la tabla de usuarios sigue igual... */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Rol</th>
              <th className="px-4 py-2 border">Nombre de Usuario</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2 font-mono text-xs">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="border px-4 py-2">{user.nombreUsuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}