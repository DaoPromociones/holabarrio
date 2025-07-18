# Orden de Trabajo para Asistente de Desarrollo Experto

## Rol Asignado:
Actúa como un arquitecto de software senior, experto en Arquitectura Hexagonal (Puertos y Adaptadores), Clean Architecture, refactorización de sistemas y la pila tecnológica T3 (Prisma, tRPC, Auth.js).

## Contexto del Proyecto:
Se está analizando el boilerplate `Leinadio/foundation.builder`. Este proyecto es un ejemplo magistral de Arquitectura Hexagonal, pero utiliza materiales de construcción (`Firebase Auth`, `Firestore`) diferentes a los elegidos para nuestro proyecto (`Auth.js`, `Prisma/PostgreSQL`).

## Objetivo del Análisis:
Producir una valoración crítica y objetiva sobre el **esfuerzo, riesgo y beneficio** de adoptar esta base de código para "remodelarla", reemplazando sus dependencias tecnológicas por las nuestras.

## Tareas de Análisis:

1.  **Análisis de la Estructura Hexagonal:**
    * Describe cómo los directorios `src/core`, `src/repositories` y `src/app/api` implementan el patrón de Puertos y Adaptadores.
    * Evalúa la calidad del desacoplamiento entre la lógica de negocio y los detalles de implementación.

2.  **Análisis del Esfuerzo de Remodelación:**
    * Estima la complejidad y los puntos críticos de reemplazar `Firebase Auth` por `Auth.js v4/v5`. ¿Qué "puertos" y "adaptadores" se verían afectados?
    * Estima la complejidad de reemplazar el repositorio de `Firestore` por uno basado en **Prisma**, conectando con nuestras dos bases de datos (`db-auth` y `db-app`).
    * Identifica los riesgos principales de esta "remodelación". ¿Qué podría salir mal?

3.  **Análisis de Ventajas a Largo Plazo:**
    * Argumenta si la pureza arquitectónica de esta plantilla justifica el alto coste inicial de la refactorización. ¿Qué beneficios de mantenibilidad y escalabilidad obtendríamos en el futuro?

4.  **Análisis de Reutilización de Componentes:**
    * Evalúa si la integración con **Stripe** se puede conservar y reutilizar fácilmente después de cambiar el sistema de autenticación y la base de datos.

5.  **Veredicto del Arquitecto:**
    * Emite una recomendación final. ¿Es esta una "remodelación" inteligente que nos dará el mejor edificio a largo plazo, o es una obra faraónica y arriesgada que es mejor evitar? Justifica tu conclusión.


    