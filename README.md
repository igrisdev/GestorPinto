# GestorPinto App

Esta rama contiene la implementación inicial de la app móvil Expo para el equipo GestorPinto.

## Qué se hizo

- Se creó la estructura de un proyecto Expo con TypeScript.
- Se añadió la configuración principal de Expo y del proyecto:
  - `package.json`
  - `tsconfig.json`
  - `app.json`
  - `babel.config.js`
  - `.gitignore`
  - `.env.example`
- Se agregaron imágenes placeholder en `assets/`:
  - `icon.png`
  - `adaptive-icon.png`
  - `splash-icon.png`
  - `favicon.png`
- Se implementó el estado global de autenticación con `AuthContext` en `src/context/AuthContext.tsx`.
- Se añadió persistencia local de usuario con `src/store/auth.ts`.
- Se crearon tipos base y utilidades de API en `src/types/index.ts`, `src/lib/api.ts` y `src/lib/notion.ts`.
- Se implementaron servicios simples de login y recursos en `src/services/auth.ts` y `src/services/resources.ts`.
- Se creó un flujo de navegación básico con Expo Router:
  - `app/_layout.tsx` como layout raíz.
  - `app/index.tsx` como pantalla de login.
  - `app/(app)/_layout.tsx` como layout protegido.
  - `app/(app)/index.tsx` como dashboard con lista de recursos.

## Cómo ejecutar

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar Expo:

```bash
npm start
```

3. Seguir las instrucciones de Expo para abrir la app en un emulador o dispositivo.

## Notas importantes

- El login actual valida que la contraseña sea numérica.
- El dashboard carga recursos de ejemplo usando `src/services/resources.ts`.
- La rama actual es `dev_justin` y ya se subió al remoto.

## Estructura principal

```
app/
├── _layout.tsx
├── index.tsx
└── (app)/
    ├── _layout.tsx
    └── index.tsx
src/
├── context/AuthContext.tsx
├── lib/
│   ├── api.ts
│   └── notion.ts
├── services/
│   ├── auth.ts
│   └── resources.ts
├── store/auth.ts
└── types/index.ts
assets/
├── icon.png
├── adaptive-icon.png
├── splash-icon.png
└── favicon.png
```
