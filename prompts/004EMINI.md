TAREAS A REALIZAR;


* Utiliza el @/ en las importaciones

* Los modelos del core no deben importar nunca de @prisma/client.

* Los campos Json de Prisma se deben mapear a nuestro tipo Json del core, no a any.

* Los campos Decimal de Prisma se deben mapear a number en el core.

Objetivo: Crear el servicio CRUD completo para la entidad 'Negocio', replicando el patrón establecido por la entidad 'Localidad' y siguiendo estrictamente las reglas del contexto anterior.

Pasos:

1. Analiza el modelo Negocio en prisma-app/schema.prisma.

2. Crea la interfaz Negocio en src/core/models/negocio.ts.

3. Crea la interfaz del repositorio NegocioRepository en src/core/ports/out/negocio.repository.ts.

4. Crea la clase PrismaNegocioRepositoryImpl en src/repositories/prisma.negocio.repository.impl.ts, usando el cliente prismaApp y un 'mapper'.

5. Crea el puerto de entrada NegocioPort y la clase NegocioService.

6. Proporciona las líneas para registrar el NegocioService en src/lib/di-container.ts.

7. Proporciona el código para las rutas de API: src/app/api/negocios/route.ts y src/app/api/negocios/[id]/route.ts.