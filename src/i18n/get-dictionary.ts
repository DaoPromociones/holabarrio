import type { Locale } from "@/i18n/config"

/**
 * Diccionarios de traducciones para cada idioma
 *
 * Cada función retorna una promesa que carga dinámicamente
 * el archivo JSON correspondiente al idioma solicitado
 */
const dictionaries = {
  // Diccionario en español - archivo principal
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  // Diccionario en inglés - archivo de traducciones
  en: () => import("./dictionaries/en.json").then((module) => module.default),
}

/**
 * Función para obtener el diccionario de traducciones según el idioma
 *
 * @param locale - El código del idioma (es, en)
 * @returns Promise con el objeto de traducciones
 */
export const getDictionary = async (locale: Locale) => {
  try {
    // Intentar cargar el diccionario del idioma solicitado
    return dictionaries[locale]?.() ?? dictionaries.es()
  } catch (error) {
    // En caso de error, mostrar advertencia y usar español como respaldo
    console.warn(`Failed to load dictionary for locale: ${locale}`, error)
    return dictionaries.es()
  }
}
