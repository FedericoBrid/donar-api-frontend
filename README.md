# Donar+ Frontend

Frontend application for **Donar+**, a blood donation management system that connects users, blood centers, and administrators to facilitate blood request management and donation registration.

This project is part of the migration of the original PHP application to a modern architecture based on **React and Spring Boot**, with an independent REST API.

## Technologies

- **React 19** – User interface library.
- **TypeScript** – Static typing for JavaScript.
- **Vite 8** – Development and build tool.
- **Material UI 9.5** – UI component library.
- **Material React Table** – Data tables and management.
- **MUI X Date Pickers** – Date selection components.
- **React Router 7** – Routing and navigation.
- **Axios** – HTTP client for API communication.
- **Emotion** – Styling and component customization.
- **Docker** – Application containerization.
- **Nginx** – Production web server.

## Project Structure

The frontend is organized by responsibilities, separating pages, API communication services, authentication management, and route configuration.

```text
src/
├── constants/       # Catalogs and application constants
├── context/         # Authentication context and state
├── layouts/         # Application layouts
├── pages/           # Application pages and functional modules
│   ├── Auth/         # Password recovery and reset
│   ├── BloodCenters/ # Blood center management
│   ├── Dashboard/    # Main dashboard
│   ├── Donations/    # Donation management
│   ├── Landing/      # Public landing page
│   ├── Login/        # User login
│   ├── Register/     # User registration
│   ├── Request/      # Blood requests
│   └── Users/        # User and role management
├── routes/          # Route configuration and protection
├── services/        # REST API communication
├── theme/           # Material UI theme
├── types/           # TypeScript types and interfaces
└── utils/            # Utility functions
```

## Authentication and Authorization

Authentication is handled through React Context API and JWT tokens.

- User login is performed through the backend REST API.
- JWT tokens are stored in `localStorage`.
- Axios automatically includes the token in HTTP requests through the `Authorization: Bearer` header.
- Routes are protected according to authentication status and user roles.

### System Roles

- **ADMIN:** Full administrative access and system management.
- **HEMOADMIN:** Operational management of blood centers and blood requests.
- **USER:** Access to blood requests and personal donation management.

## Features

- Public landing page.
- User registration and login.
- Password recovery and reset.
- JWT-based authentication.
- Main dashboard.
- Blood request management.
- Donation management.
- Blood center management.
- User and role administration.
- Role-based access control.

## Backend Integration

The frontend consumes a REST API developed with **Java and Spring Boot**.

Communication is handled through Axios, using JSON for data exchange.

API services are organized under `src/services/`:

- `userService.ts`: User-related operations.
- `bloodCenterService.ts`: Blood center operations.
- `bloodRequestService.ts`: Blood request operations.
- `donationService.ts`: Donation operations.
- `api.tsx`: Axios configuration and authentication integration.

Backend repository:

[Donar+ API – Spring Boot](https://github.com/FedericoBrid/donar-api)

## Docker Deployment

The Docker Compose configuration is located in the backend repository. It builds and runs the three application services:

| Service | Technology | URL |
|---|---|---|
| Frontend | React + Nginx | http://localhost:3000 |
| Backend | Spring Boot | http://localhost:8080 |
| Database | MySQL 8.4 | localhost:3306 |

### Requirements

- Git.
- Docker Desktop.
- Docker Compose.

### 1. Clone the repositories

Both repositories must be cloned into the same parent directory:

```text
donar-plus/
├── donar-api/
└── donar-api-frontend/
```

Run:

```bash
mkdir donar-plus
cd donar-plus

git clone https://github.com/FedericoBrid/donar-api.git
git clone https://github.com/FedericoBrid/donar-api-frontend.git
```

### 2. Configure environment variables

Navigate to the backend repository:

```bash
cd donar-api
```

Create the `.env` file using the backend `.env.example` as a reference.

Configure the required database, JWT, email, and initial administrator variables.

The frontend URL must be configured as:

```env
FRONTEND_URL=http://localhost:3000
```

Do not commit the `.env` file or expose sensitive credentials.

### 3. Build and start the application

From the `donar-api` directory, run:

```bash
docker compose up --build -d
```

Docker Compose builds the backend and frontend images and starts MySQL, Spring Boot, and Nginx.

The backend waits for MySQL to become healthy before starting.

### 4. Access the application

Once all services are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api/v1
- **Swagger UI:** http://localhost:8080/swagger-ui/index.html

### 5. Check container status

```bash
docker compose ps
```

View service logs:

```bash
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mysql
```

### 6. Stop the application

```bash
docker compose down
```

This stops and removes the containers while preserving the MySQL data volume.

To also remove the database volume:

```bash
docker compose down -v
```

**Warning:** The `-v` option deletes the persistent database volume and all stored data.

## Development Mode

The frontend can also be executed independently using Vite.

### Requirements

- Node.js.
- npm.
- Donar+ backend running.

### 1. Install dependencies

From the frontend directory:

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

The backend must be available at `http://localhost:8080`, and the frontend API configuration must point to that address.

### 3. Build for production

```bash
npm run build
```

The production files are generated in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

### 4. Run code analysis

```bash
npm run lint
```

## Repositories

Donar+ is divided into two independent projects that work together:

| Project | Technology | Repository |
|---|---|---|
| Frontend | React, TypeScript and Vite | [donar-api-frontend](https://github.com/FedericoBrid/donar-api-frontend) |
| Backend | Java and Spring Boot | [donar-api](https://github.com/FedericoBrid/donar-api) |

The frontend handles the user interface and user experience, while the backend manages business logic, data persistence, security, and REST API services.

## Author

**Federico Brid**

- GitHub: [FedericoBrid](https://github.com/FedericoBrid)
- Frontend: [donar-api-frontend](https://github.com/FedericoBrid/donar-api-frontend)
- Backend: [donar-api](https://github.com/FedericoBrid/donar-api)
