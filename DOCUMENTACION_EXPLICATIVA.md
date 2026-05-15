# Documentación Explicativa del Proyecto: GestorPinto

Este documento está diseñado para explicar detalladamente la estructura, arquitectura, flujos y funciones principales del proyecto **GestorPinto**. Te servirá como guía principal para entender el código y poder explicarlo a tu docente con total claridad.

---

## 1. Arquitectura del Proyecto (Clean Architecture)

El proyecto ha sido refactorizado para seguir los principios de la **Arquitectura Limpia (Clean Architecture)** y **Arquitectura Hexagonal**. Esto significa que el código está dividido en **capas**, donde las dependencias siempre apuntan hacia el interior (hacia el dominio).

Esto soluciona el problema de tener un código "monolítico" donde la Interfaz de Usuario (UI), las reglas de negocio y las llamadas a la base de datos (Notion) estaban mezcladas en un solo archivo.

### Las 4 Capas Principales:
1. **Domain (Dominio):** Es el núcleo de la aplicación. Contiene las entidades base (`User`, `Resource`) y las interfaces o contratos (Repositorios). **No depende de ninguna otra capa ni tecnología (ni de React ni de Notion).**
2. **Application (Aplicación - Casos de Uso):** Contiene la lógica de negocio específica (ej. "Iniciar Sesión" o "Obtener recursos de una clase"). Orquesta el flujo de datos usando los contratos del dominio.
3. **Infrastructure / Lib Server (Infraestructura):** Aquí viven las implementaciones reales. Es donde nos conectamos a servicios externos (la API de Notion). Implementa los contratos definidos en el Dominio.
4. **Presentation (Presentación):** Es la capa visible. Contiene los componentes de React, los Hooks personalizados y la interfaz de usuario en general. Solo se preocupa por mostrar datos y capturar eventos del usuario.

---

## 2. Flujos Principales de la Aplicación

Existen dos flujos principales en la aplicación. Ambos siguen el mismo patrón: **Cliente -> API Route -> Caso de Uso -> Repositorio -> Base de Datos (Notion)**.

### Flujo A: Inicio de Sesión (Login)
1. **Capa de Presentación:** El usuario ingresa sus datos en `LoginForm.tsx` y se envía la información a través de la función `login()` del hook `useAuth`.
2. **API Route:** El hook realiza una petición `POST` a `/api/auth/login`.
3. **Capa de Aplicación:** El endpoint `/api/auth/login/route.ts` ejecuta el caso de uso `loginUserUseCase`.
4. **Infraestructura:** El caso de uso utiliza la clase `NotionAuthRepository` (que implementa el contrato `AuthRepository`). Este repositorio se comunica con la API de Notion, busca el correo y contraseña, y si coinciden, mapea los datos de Notion a nuestra entidad `User`.
5. **Respuesta:** Se devuelve un objeto de tipo `Result` con el estado (`ok: true`) y los datos del usuario, los cuales se guardan en el estado del cliente, permitiendo el paso al Dashboard.

### Flujo B: Obtención de Recursos (Enlaces)
1. **Capa de Presentación:** Una vez el usuario inicia sesión (tenemos el dato `user.clase`), el componente principal renderiza el Dashboard y dispara el hook `useResources(user.clase)`.
2. **API Route:** El hook hace una petición `GET` a `/api/resources?clase=NombreDeClase`.
3. **Capa de Aplicación:** La ruta recibe la petición y ejecuta el caso de uso `getResourcesByClassUseCase`.
4. **Infraestructura:** El caso de uso llama a `NotionResourceRepository`, el cual se conecta a Notion filtrando la base de datos por los recursos que estén en estado "Listo" y pertenezcan a la "Clase" del usuario.
5. **Respuesta:** La API devuelve un array de tipo `Resource[]`, el cual es recibido por la UI y renderizado por el componente `ResourcesGrid.tsx`.

---

## 3. Estructura de Carpetas y Código Detallado

A continuación, se detalla qué hace cada parte dentro de la carpeta `src/`.

### `src/domain/` (Reglas del Negocio)
- **`entities/user.ts` & `resource.ts`**: Definen cómo es la estructura de los datos en TypeScript (ej. un `User` tiene `nombre`, `clase` y `estado`).
- **`repositories/auth-repository.ts`**: Es una "interfaz" (contrato). Dice: *"Cualquier base de datos que usemos, debe tener una función `login` que reciba un email y un password"*.
- **`shared/result.ts`**: Un patrón para manejar éxitos y errores sin usar `try/catch` de forma desordenada en la UI. Devuelve `{ ok: true, value: Datos }` o `{ ok: false, error: "Mensaje" }`.

### `src/application/` (Orquestación)
- **`use-cases/login-user.ts`**: Es una función sencilla que recibe los datos del cliente, se los pasa al Repositorio y devuelve el resultado. Encapsula la acción específica de "Loguear Usuario".
- **`use-cases/get-resources-by-class.ts`**: Ejecuta la lógica para pedir los recursos según la clase indicada.

### `src/lib/server/` (Infraestructura / Conexión Externa)
- **`notion-client.ts`**: Un archivo central que contiene la función genérica `notionRequest` para hacer peticiones HTTP (fetch) a los endpoints de Notion inyectando el Token de seguridad.
- **`notion-auth.repository.ts`**: Contiene la clase `NotionAuthRepository`. Es aquí donde se arma la consulta específica para la API de Notion (`filter: { and: [...] }`) buscando el correo y la contraseña.
- **`notion-resource.repository.ts`**: Similar al de Auth, pero consulta la base de datos de los links.
- **`notion-mappers.ts`**: Funciones auxiliares que toman los datos crudos y sucios que entrega Notion y los transforman en los objetos limpios que requiere nuestro Dominio (`User` y `Resource`).

### `src/presentation/` (Interfaz Gráfica)
- **`hooks/use-auth.ts` & `use-resources.ts`**: Hooks de React que manejan los estados locales (`loading`, `error`, `user`, `resources`) y contienen la lógica para hacer las peticiones `fetch` a nuestras API Routes internas.
- **`components/`**: Los fragmentos visuales modulares:
  - `LoginForm.tsx`: El formulario de inicio de sesión visual.
  - `DashboardHeader.tsx`: La barra superior una vez logueado.
  - `ResourcesGrid.tsx` y `ResourceCard.tsx`: Se encargan de iterar y pintar las tarjetas de los recursos.
  - `EmptyResourcesState.tsx`: Lo que se muestra si la consulta a Notion devuelve cero recursos.

### `src/app/` (Enrutamiento de Next.js)
- **`page.tsx`**: Es la página principal. Orquesta los componentes de presentación y los hooks. Decide si mostrar el `LoginForm` (si no hay usuario) o el contenido del Dashboard (si ya hay usuario).
- **`api/auth/login/route.ts` & `api/resources/route.ts`**: Son las funciones "Backend" de Next.js. Exponen URLs de nuestra aplicación para que el cliente (React) se comunique de forma segura sin exponer los Tokens de Notion al navegador.

---

## 4. Decisiones Clave de Diseño para Explicar

Si el docente pregunta el *"Por qué"* de esta estructura, puedes darle estos argumentos técnicos:

1. **Seguridad (Secreto de APIs):** Al mover la llamada a Notion a `src/lib/server` y usar API Routes (`src/app/api/...`), el Token de Notion y la lógica de validación nunca viajan al navegador del cliente. Es un entorno backend seguro.
2. **Desacoplamiento:** Si el día de mañana GestorPinto deja de usar Notion y migra a Firebase, PostgreSQL o MongoDB, **ni un solo componente de React cambiará**. Solo se crearía un `FirebaseRepository` que cumpla con los contratos de `domain`, demostrando alta escalabilidad.
3. **Mantenibilidad y Single Responsibility Principle (SRP):** Antes, un solo archivo (`page.tsx`) hacía el fetching, manejaba el estado, validaba datos y pintaba el HTML. Ahora cada archivo tiene una única responsabilidad clara (ej. el mapper solo mapea, el botón solo se pinta, el hook solo llama a la API).
4. **Patrón Result:** El uso de un tipo `Result` (`{ ok: true, value: T } | { ok: false, error: string }`) evita el uso excesivo de `try-catch` anidados en la capa de UI, haciendo que el flujo de control de errores sea más declarativo y limpio.
