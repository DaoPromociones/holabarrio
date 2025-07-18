// app/[locale]/dashboard/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getDictionary } from "@/i18n/get-dictionary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";

interface DashboardPageProps {
  params: {
    locale: Locale;
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = params;
  
  // 1. OBTENEMOS LA SESIÓN CON NEXTAUTH
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(locale);

  // 2. LA LÓGICA DE PROTECCIÓN AHORA USA 'session'
  if (!session) {
    // Redirigimos al login si no hay sesión
    redirect(`/${locale}/auth/signin?callbackUrl=/${locale}/dashboard`);
  }
  
  // 3. ACCEDEMOS AL USUARIO A TRAVÉS DE 'session.user'
  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dictionary.dashboard.welcome}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Hola, {user.name || user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.dashboard.profile}</CardTitle>
              <CardDescription>Gestiona tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: {user.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rol: {user.role}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{dictionary.dashboard.settings}</CardTitle>
              <CardDescription>Configura tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personaliza tu experiencia</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}