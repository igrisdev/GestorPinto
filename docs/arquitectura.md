# Arquitectura actual del proyecto (Next.js 16)

Esta guia explica que se refactorizo, por que se hizo y como trabajar con la estructura nueva sin romperla.

## Resumen ejecutivo

- Se elimino el enfoque monolitico en `page.tsx` (UI + estado + negocio + integracion externa).
- Se movio la base de codigo a `src/` y el App Router a `src/app`.
- Se separaron responsabilidades por capas: domain, application, infrastructure y presentation.
- La UI ahora consume API routes internas, no Notion directamente.
- Se introdujeron hooks para encapsular estado y efectos (`useAuth`, `useResources`).
- Se removio codigo legado acoplado a `app/lib/notion.ts`.
- Se consolidaron componentes en `src/presentation/components`.
- Se estandarizaron imports con alias `@/* -> src/*`.

## Estructura actual

```txt
src/
  app/
    api/
      auth/login/route.ts
      resources/route.ts
    layout.tsx
    page.tsx
    globals.css

  domain/
    entities/
    repositories/
    shared/

  application/
    use-cases/

  lib/
    server/

  presentation/
    components/
    hooks/
```

## Flujo end-to-end

### Login

1. `src/app/page.tsx` llama `login()` de `useAuth`.
2. `useAuth` hace `POST /api/auth/login`.
3. `src/app/api/auth/login/route.ts` ejecuta `loginUserUseCase`.
4. El caso de uso usa el contrato `AuthRepository`.
5. `NotionAuthRepository` consulta Notion y devuelve `Result<User, string>`.

### Recursos

1. Con `user.clase`, `useResources` llama `GET /api/resources?clase=...`.
2. `src/app/api/resources/route.ts` ejecuta `getResourcesByClassUseCase`.
3. El caso de uso usa `ResourceRepository`.
4. `NotionResourceRepository` consulta Notion y mapea a `Resource[]`.

## Por que se refactorizo

- Para separar UI de negocio.
- Para evitar mezclar cliente y servidor.
- Para proteger credenciales y centralizar acceso externo.
- Para facilitar pruebas y cambios futuros.
- Para escalar sin volver a un archivo unico con demasiadas responsabilidades.

## Decisiones clave

### 1) API routes en vez de Notion desde cliente

- Evita exponer secretos.
- Centraliza validaciones y errores.
- Mantiene estable el contrato del frontend.

### 2) Estructura en `src/`

- Reduce ruido en raiz.
- Hace mas clara la organizacion por dominio tecnico.
- Facilita onboarding del equipo.

### 3) Capas (clean architecture)

- `domain`: reglas y contratos estables.
- `application`: operaciones de negocio.
- `lib/server`: integraciones externas.
- `presentation`: experiencia de UI y estado visual.

## Convenciones que debes mantener

- App Router siempre en `src/app`.
- No volver a crear `app/page.tsx` en raiz.
- No llamar Notion desde componentes o hooks de cliente.
- Nuevas reglas de negocio van en `src/application/use-cases`.
- Nuevas integraciones van en `src/lib/server` implementando contratos de `src/domain`.
- Usa imports con alias `@/...`.

## Errores comunes a evitar

- Meter fetch de Notion en UI.
- Duplicar logica entre hooks y API routes.
- Saltarse contratos de repositorio e importar infraestructura directo en use-cases.
- Mezclar rutas relativas largas cuando ya existe alias `@/*`.

## Guia rapida para contribuir

### Agregar nueva funcionalidad de negocio

1. Define/ajusta entidad o contrato en `src/domain`.
2. Crea caso de uso en `src/application/use-cases`.
3. Implementa repositorio en `src/lib/server`.
4. Expone via `src/app/api/...`.
5. Conecta en hook/componente de `src/presentation`.

### Checklist antes de merge

- La UI no contiene reglas de negocio complejas.
- No hay llamadas directas a Notion desde cliente.
- Use-cases dependen de contratos, no de clases concretas.
- Imports internos usan `@/*`.
- La ruta principal sigue en `src/app/page.tsx`.

## Glosario corto

- **Clean architecture**: separacion por capas con dependencias controladas.
- **Use-case**: accion de negocio concreta.
- **Repository**: contrato/implementacion para acceso a datos.
- **Mapper**: transforma respuesta externa a modelo interno.
- **Hook**: funcion React reutilizable para estado y efectos.

## FAQ

**Donde creo una nueva ruta backend?**  
En `src/app/api/<feature>/route.ts`.

**Donde agrego reglas de negocio?**  
En `src/application/use-cases`.

**Puedo consumir Notion desde un componente?**  
No. Debe pasar por API route + capa de aplicacion.

**Que hago si cambio el proveedor de datos?**  
Crear nueva implementacion en `src/lib/server` manteniendo contratos de `src/domain`.
