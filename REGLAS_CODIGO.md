## CONTEXTO Y REGLAS OBLIGATORIAS PARA HOLABARRIO

## Contexto
Este proyecto es una compilación repetitiva en Next.js que sigue los principios de la ARQUITECTURA HEXAGONAL. 
Arquitectura Limpia / Puertos y Adaptadores). 
El objetivo es separar claramente la lógica de negocio de los detalles técnicos y las dependencias externas.

## Glosario
- usuario: Se refiere al usuario final que interactúa con la aplicación.
- aplicación: Se refiere a la carpeta src/app; esta es la interfaz que ve el usuario.
- componentes: Se refiere a la carpeta src/components. Estos son los componentes básicos de la interfaz gráfica.

## Estructura de carpetas
- src/core/services: Contiene la lógica de negocio de la aplicación (casos de uso, reglas de negocio). Implementa la lógica de negocio ([Entidad]Service).

- src/core/ports/in: Interfaces de contrato para los casos de uso entrantes (aplicación). Define las interfaces de los servicios ([Entidad]Port).

- src/core/ports/out: Interfaces de contrato para las dependencias salientes (base de datos, servicios externos). Define las interfaces de los repositorios ([Entidad]

- src/core/models: Contiene las entidades de negocio. Define las entidades de negocio puras (interfaces TypeScript).

- src/repositories: Implementaciones concretas de las interfaces definidas en ports/out. - src/lib/di-container: Utiliza la inyección de dependencias para invertir el control. Implementa los repositorios, conectando el core con la base de datos.

- src/lib/di-container: Gestiona la inyección de dependencias.

- src/hooks: Hooks personalizados de React.

## Regla específica de la arquitectura hexagonal.
- Los repositorios deben devolver una interfaz que corresponda a las interfaces en src/core/ports/out.
- La carpeta adapters/out no existe. Se reemplaza por la implementación concreta correspondiente a la carpeta src/repositories/
- La carpeta adapters/in no existe
- La aplicación (src/app, src/hooks, src/components) nunca debe llamar directamente a la carpeta repositories, sino que siempre debe hacerlo a través de src/core/ports/in, que llamará a src/core/services/
- La implementación de dependencias externas debe realizarse siempre y únicamente en repositorios

## Regla de codificación
- Respetar el principio de responsabilidad única
- Dividir siempre las funciones en funciones más pequeñas
- Nunca usar "if {} else {}" o "if {} else if {} else", priorizar siempre las sentencias "return early"
- Priorizar la inmutabilidad en src/core
- Gestionar errores explícitamente
- Usar tipos estrictos (TypeScript)
- Usar siempre clases en src/core/services y src/repositories
- Usar composición en lugar de herencia
- Nunca usar ternarios
- Usar siempre la inmutabilidad
- Especificar siempre modificadores de acceso en Clases
- La aplicación siempre debe llamar a las abstracciones de src/core
- La aplicación nunca debe llamar a una implementación directa
- No cree un gancho personalizado; llame a src/services directamente a través de su puerto src/ports/in
- Las páginas de la aplicación siempre deben ser componentes del servidor

## Reglas de codificación de la interfaz de usuario
- Respete el diseño atómico por tipo de componente (átomos, moléculas, organismos, plantillas) y no por características
- Los componentes de diseño atómico nunca deben llamar directamente al negocio (src/services). Estos son componentes puros.
- Use shadcn integrándolo en el diseño atómico.
- Las bibliotecas de interfaz de usuario externas deben abstraerse integrándolas en el diseño atómico.

## Regla de codificación: Proceso de refactorización
- **ANTES** de iniciar cualquier modificación, realice una búsqueda exhaustiva de TODOS los patrones prohibidos en el archivo. - **Búsqueda sistemática**: `if.*{.*}.*else`, `if.*{.*}.*else if`, `.*\?.*:.*` (ternario)
- **Revise cada línea** del archivo para identificar todos los casos a corregir.
- **Nunca realice modificaciones parciales**: corrija TODOS los patrones prohibidos a la vez.
- **Priorice la corrección completa** sobre las correcciones visibles.

## Regla de codificación - Metodología
- **Paso 1**: Identificar todos los patrones prohibidos (if/else, (ternario)
- **Paso 2**: Planificar todas las correcciones necesarias
- **Paso 3**: Aplicar todas las correcciones en un solo cambio
- **Paso 4**: Comprobar que no queden patrones prohibidos

## Regla de codificación - Verificación
- **Después de cada cambio**, releer todo el archivo para asegurarse de que no se hayan omitido patrones prohibidos
- **Nunca considerar un cambio completo** hasta que se hayan corregido todos los patrones prohibidos

## Regla de codificación específica para Next.js
- Al crear un componente, priorizar la creación de un componente de servidor
- Si el componente es un componente cliente, añadir "use client" al principio del archivo

## Nomenclatura de clases
Servicios: [Entidad]Servicio (p. ej., localidad.service.t)
Puertos de entrada: [Entidad]Puerto de entrada (p. ej., localidad.port.tsUserPortIn)
Puertos de salida: [Entidad]Repositorio (ej.: localidad.repository.ts)
Repositorios: [Tecnología][Entidad]RepositoryImpl (ej.: prisma.localidad.repository.impl.ts)

## Nombre de archivo
Servicios: [Entidad].service.ts (ej.: usuario.service.ts)
Puertos de entrada: [Entidad].port.ts (ej.: usuario.port.ts)
Puertos de salida: [Entidad].repository.ts (ej.: usuario.repository.ts)
Modelos: [Entidad].ts (ej.: usuario.ts)
Repositorios: [Tecnología].[Entidad].repository.ts

Reglas de Arquitectura
Dirección de las Dependencias: Las capas externas (repositories, app) dependen del core, pero el core nunca debe depender de las capas externas.

Prohibido el Acceso Directo: La aplicación (app, components) nunca debe llamar a un repositorio directamente. Siempre debe hacerlo a través de la interfaz de un servicio (puerto de entrada).

Implementaciones Aisladas: La lógica de tecnologías externas (Prisma, Stripe, Resend) vive únicamente dentro de la carpeta repositories.

Reglas de Codificación
Principio de Responsabilidad Única: Cada clase y función debe tener un único propósito.

Evitar else y Ternarios: Usar siempre el patrón "return early". No usar if/else ni operadores ternarios (? :).

Inmutabilidad: Los datos dentro del core deben ser tratados como inmutables.

Tipos Estrictos: Usar TypeScript de forma estricta. Evitar el uso de any.

Clases y Modificadores: Usar class para Servicios e Implementaciones de Repositorios, especificando siempre los modificadores de acceso (public, private).

Alias de Ruta: Usar siempre alias de ruta (@/) para las importaciones, nunca rutas relativas (../).


Nomenclatura y Nombres de Ficheros (Estándar Único)
Concepto	        Nombre de Clase / Interfaz	    Nombre del Fichero	            Ejemplo

Modelo del Core	    User	                        user.ts	                        src/core/models/user.ts

Puerto de Salida	UserRepository	                user.repository.ts	            src/core/ports/out/user.repository.ts
Puerto de Entrada	UserPort	                    user.port.ts	                src/core/ports/in/user.port.ts
Servicio	        UserService	                    user.service.ts	                src/core/services/user.service.ts
Implementación	    PrismaUserRepositoryImpl	    prisma.user.repository.impl.ts	src/repositories/prisma.user.repository.impl.ts


