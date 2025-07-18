// app/[locale]/layout.tsx

import type React from "react";
import { getDictionary } from "@/i18n/get-dictionary";
import { Navigation } from "@/components/navigation/navigation";
import { Footer } from "@/components/footer/Footer";
import type { Locale } from "@/i18n/config";
import { ResponsiveIndicator } from "@/components/layout/dev/responsive-indicator";
import { OrientationIndicator } from "@/components/layout/dev/orientation-indicator";

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: Locale
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  let dictionary
  try {
    dictionary = await getDictionary(locale)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    dictionary = {
      navigation: {
        
        home: "Inicio",
        mapa: "Mapa",
        login: "Iniciar Sesión",
        register: "Registrarse",
      },
    }
  }

  return (
    <>
      <Navigation
        locale={locale}
        dictionary={dictionary.navigation} // Pasamos la sección correcta del diccionario
        user={null}
      />
      <main>{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
      <ResponsiveIndicator />
      <OrientationIndicator />
    </>
  );
}
