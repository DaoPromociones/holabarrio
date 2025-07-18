# Orden de Trabajo para Asistente IA (Gemini CLI)

## Rol Asignado:

Actúa como un arquitecto de software experto en monorepos, Prisma ORM y la pila T3. Tu tarea es generar la estructura de directorios y los archivos de configuración necesarios para una arquitectura de doble base de datos.

## Contexto del Proyecto:

Estamos reestructurando un proyecto `create-t3-turbo INFO en README.md` para utilizar dos bases de datos separadas: una para autenticación (`db-auth`) y otra para los datos de la aplicación (`db-app`). Esto se hace para maximizar la seguridad y el aislamiento de los datos.

Proporciona la salida para cada paso de forma clara y separada.

---

# Orden de Trabajo para Asistente IA (Gemini CLI)

## Rol Asignado:

Actúa como un sistema de diagnóstico de código. Tu única función es leer archivos y mostrar su contenido tal cual, sin interpretarlo ni modificarlo.

## Objetivo de la Tarea:

Realizar una auditoría completa de un proyecto monorepo para un análisis de arquitectura. Debes mostrar la estructura de directorios y el contenido exacto de una lista de archivos críticos.

## Pasos a Ejecutar:

1.  **Muestra la estructura de directorios:** Ejecuta el comando `ls -R` en la raíz del proyecto y muestra la salida completa para que se vea la estructura de todos los archivos y carpetas.

2.  **Muestra el contenido de los siguientes archivos:** Para cada uno de los archivos de la siguiente lista, muestra primero la ruta completa del archivo y luego un bloque de código con su contenido exacto y sin modificar.

    **Lista de Archivos a Auditar:**

    - `pnpm-workspace.yaml`
    - `turbo.json`
    - `package.json` (el de la raíz del proyecto)
    - `packages/db-auth/package.json`
    - `packages/db-auth/index.ts`
    - `packages/db-auth/prisma/schema.prisma`
    - `packages/db-app/package.json`
    - `packages/db-app/index.ts`
    - `packages/db-app/prisma/schema.prisma`
    - `packages/auth/package.json`
    - `packages/auth/env.mjs`
    - `packages/auth/src/auth-options.ts`
    - `packages/auth/src/get-session.ts`
    - `packages/auth/index.ts`
    - `packages/api/package.json`
    - `packages/api/src/trpc.ts`
    - `packages/api/src/root.ts`
    - `apps/nextjs/package.json`
    - `apps/nextjs/src/env.mjs`
    - `apps/nextjs/src/pages/api/auth/[...nextauth].ts`

No añadas comentarios, análisis ni sugerencias. Limítate a presentar los datos brutos solicitados.
