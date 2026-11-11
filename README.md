# Donar+ Frontend

Aplicación web frontend de **Donar+**, un sistema de gestión de donaciones de sangre que conecta a usuarios, hemocentros y administradores para facilitar la publicación y gestión de solicitudes de sangre y el registro de donaciones.

Este proyecto forma parte de la migración del sistema original desarrollado en PHP hacia una arquitectura moderna basada en **React y Spring Boot**, con una API REST independiente.

## Tecnologías utilizadas

- **React 19** – Biblioteca para construir interfaces de usuario.
- **TypeScript** – Tipado estático para JavaScript.
- **Vite 8** – Herramienta de desarrollo y construcción.
- **Material UI 9.5** – Componentes de interfaz.
- **Material React Table** – Tablas y gestión de datos.
- **MUI X Date Pickers** – Selectores de fechas.
- **React Router 7** – Navegación y gestión de rutas.
- **Axios** – Comunicación HTTP con el backend.
- **Emotion** – Estilos y personalización de componentes.

## Arquitectura del frontend

El proyecto está organizado por responsabilidades, separando las páginas, los servicios de comunicación con la API, la gestión del estado de autenticación y la configuración de rutas.

```text
src/
├── constants/       # Catálogos y constantes
├── context/         # Contexto y gestión de autenticación
├── layouts/         # Estructura general de la aplicación
├── pages/           # Páginas y módulos funcionales
│   ├── Auth/         # Recuperación y restablecimiento de contraseña
│   ├── BloodCenters/ # Gestión de hemocentros
│   ├── Dashboard/   # Panel principal
│   ├── Donations/   # Donaciones y gestión de donaciones
│   ├── Landing/     # Página pública de inicio
│   ├── Login/       # Inicio de sesión
│   ├── Register/    # Registro de usuarios
│   ├── Request/     # Solicitudes de sangre
│   └── Users/       # Gestión de usuarios y roles
├── routes/          # Configuración y protección de rutas
├── services/        # Comunicación con la API REST
├── theme/           # Tema visual de Material UI
├── types/           # Tipos e interfaces TypeScript
└── utils/           # Funciones auxiliares
```

### Autenticación y autorización

La autenticación se gestiona mediante Context API y tokens JWT.

- El inicio de sesión se realiza a través de la API.
- El token JWT se almacena en `localStorage`.
- Axios incorpora automáticamente el token en las solicitudes HTTP mediante el encabezado `Authorization: Bearer`.
- Las rutas se protegen mediante componentes específicos para usuarios autenticados, invitados y roles autorizados.

### Roles del sistema

- **ADMIN:** acceso a las funcionalidades administrativas y gestión general del sistema.
- **HEMOADMIN:** gestión operativa de hemocentros y solicitudes de sangre.
- **USER:** consulta de solicitudes y gestión de sus propias donaciones.

## Funcionalidades

- Landing page pública.
- Registro e inicio de sesión.
- Recuperación y restablecimiento de contraseña.
- Autenticación mediante JWT.
- Panel principal.
- Consulta y gestión de solicitudes de sangre.
- Consulta y gestión de donaciones.
- Gestión de hemocentros.
- Administración de usuarios y roles.
- Control de acceso según roles y permisos.

## Integración con el backend

El frontend consume los servicios de una API REST desarrollada con **Java y Spring Boot**.

La comunicación se realiza mediante Axios y utiliza JSON para el intercambio de información.

Los servicios se encuentran organizados en `src/services/`:

- `userService.ts`: operaciones relacionadas con usuarios.
- `bloodCenterService.ts`: operaciones relacionadas con hemocentros.
- `bloodRequestService.ts`: operaciones relacionadas con solicitudes de sangre.
- `donationService.ts`: operaciones relacionadas con donaciones.
- `api.tsx`: configuración de Axios e integración de autenticación.

### Repositorio backend

[Donar+ API – Spring Boot](https://github.com/FedericoBrid/donar-api)

## Configuración y ejecución

### Requisitos previos

- Node.js.
- npm.
- Backend Donar+ configurado y en ejecución.

### Clonar el repositorio

```bash
git clone https://github.com/FedericoBrid/donar-api-frontend.git
```

Ingresar al directorio:

```bash
cd donar-api-frontend
```

### Instalar dependencias

```bash
npm install
```

### Configuración de la API

Actualmente, la URL del backend se encuentra configurada en `src/services/api.tsx`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    "Content-Type": "application/json",
  },
});
```

Por lo tanto, para utilizar el frontend en desarrollo, el backend debe estar disponible en:

`http://localhost:8080`

### Ejecutar en desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para acceder a la aplicación.

### Compilar para producción

```bash
npm run build
```

Los archivos compilados se generan en el directorio `dist/`.

Para previsualizar la compilación:

```bash
npm run preview
```

### Análisis de código

```bash
npm run lint
```

## Relación entre los repositorios

Donar+ está dividido en dos proyectos independientes que trabajan en conjunto:

| Proyecto | Tecnología | Repositorio |
|---|---|---|
| Frontend | React, TypeScript y Vite | [donar-api-frontend](https://github.com/FedericoBrid/donar-api-frontend) |
| Backend | Java y Spring Boot | [donar-api](https://github.com/FedericoBrid/donar-api) |

El frontend es responsable de la interfaz y la experiencia de usuario, mientras que el backend gestiona la lógica de negocio, la persistencia de datos y la seguridad mediante su API REST.

## Estado del proyecto

El frontend forma parte del proceso de migración y modernización del sistema Donar+.

La contenerización mediante Docker y las instrucciones para ejecutar ambos proyectos en conjunto se incorporarán posteriormente.