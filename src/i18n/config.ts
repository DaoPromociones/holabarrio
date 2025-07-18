// Configuración principal de internacionalización (i18n)

// Idioma por defecto de la aplicación
export const defaultLocale = "es" as const

// Lista de todos los idiomas soportados por la aplicación
export const locales = ["es", "en"] as const

// Tipo TypeScript para los idiomas válidos
export type Locale = (typeof locales)[number]

// Nombres legibles de los idiomas para mostrar en la interfaz
export const localeNames: Record<Locale, string> = {
  es: "Español", // Nombre en español
  en: "English", // Nombre en inglés
}
