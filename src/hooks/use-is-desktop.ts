// hooks/use-is-desktop.ts

import { useState, useEffect } from 'react';

/**
 * Hook personalizado que detecta si el dispositivo del usuario
 * es de tipo escritorio (pantalla grande y con un puntero fino como un ratón).
 * @returns {boolean} `true` si es un dispositivo de escritorio, `false` en caso contrario.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    // Definimos "escritorio" como una pantalla de al menos 1024px de ancho
    // y con un "puntero fino", que generalmente excluye las pantallas táctiles.
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (pointer: fine)");

    const handleResize = () => {
      setIsDesktop(mediaQuery.matches);
    };

    // Comprobar el estado inicial al montar el componente
    handleResize();

    // Añadir un listener para los cambios (ej: si el usuario rota una tablet)
    mediaQuery.addEventListener('change', handleResize);

    // Limpiar el listener al desmontar el componente para evitar fugas de memoria
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []); // El array vacío asegura que este efecto se ejecuta solo una vez (al montar)

  return isDesktop;
}