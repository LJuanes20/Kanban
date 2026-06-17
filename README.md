# Kanban App — Angular 20 + ASP.NET Core + SQL Server

Aplicación Kanban con autenticación JWT, gestión de tableros y tareas con columnas de status.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | ASP.NET Core Web API (.NET 9) |
| ORM | Entity Framework Core + SQL Server |
| Autenticación | ASP.NET Identity + JWT Bearer |
| Frontend | Angular 20 (standalone components, signals) |
| Estilos e iconos | Bootstrap 5 + FontAwesome |

## Estructura del proyecto
Kanban/

├── Backend/

│   └── TDAPI/                   ← ASP.NET Core Web API

│       ├── Controllers/         ← AuthController, BoardsController, TasksController

│       ├── Models/              ← Entidades: Board, TaskItem, Status, BoardMember, ApplicationUser

│       ├── Models/Dtos/         ← DTOs de request y response

│       ├── Infraestructure/     ← AppDbContext + configuraciones EF

│       ├── Services/            ← JwtTokenService

│       └── Migrations/

└── Frontend/

└── TDUI/todo-app/

└── src/app/

├── features/auth/   ← Login, Register

├── features/boards/ ← Lista de boards, detalle

├── features/tasks/  ← Vista Kanban

├── services/        ← AuthService, BoardService, TaskService

├── guards/          ← authGuard

└── interceptors/    ← JwtInterceptor

## Requisitos previos

- .NET 9 SDK
- Node.js 20+
- SQL Server (local o Docker)
- Angular CLI (`npm install -g @angular/cli`)

## Configuración

### Backend

Editá `Backend/TDAPI/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=kanban;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Issuer": "TDAPI",
    "Audience": "TDAPI.Client",
    "Key": "CLAVE_SECRETA",
    "ExpirationMinutes": 60
  }
}
```

Aplicar migraciones:

```bash
cd Backend/TDAPI
dotnet ef database update
```

Iniciar el backend:

```bash
dotnet run
```

API disponible en `https://localhost:7053`. Swagger en `https://localhost:7053/swagger`.

### Frontend

```bash
cd Frontend/TDUI/todo-app
npm install
ng serve
```

App disponible en `http://localhost:4200`.

## Endpoints de la API

### Auth
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | Registro de usuario |
| POST | `/api/auth/login` | ❌ | Login, devuelve JWT |
| GET | `/api/auth/me` | ✅ | Usuario actual |
| POST | `/api/auth/logout` | ✅ | Logout |

### Boards
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/boards` | ✅ | Listar todos los boards |
| GET | `/api/boards/{id}` | ✅ | Obtener board por ID |
| POST | `/api/boards` | ✅ | Crear board |

### Tasks
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/boards/{id}/tasks` | ✅ | Listar tareas de un board |
| POST | `/api/boards/{id}/tasks` | ✅ | Crear tarea (va a Backlog) |
| PATCH | `/api/boards/{id}/tasks/{taskId}/status` | ✅ | Mover tarea entre columnas |

## Columnas Kanban

| ID | Nombre | Orden |
|----|--------|-------|
| 1 | Backlog | 1 |
| 2 | In Progress | 2 |
| 3 | Review | 3 |
| 4 | Done | 4 |

## Estado de desarrollo

### ✅ Completado
- Autenticación completa (register, login, JWT, guard, interceptor)
- CRUD de boards (backend + servicio Angular)
- CRUD de tareas + cambio de status (backend + servicio Angular)
- Bootstrap 5 integrado

### 🔲 Pendiente
- BoardsPage: lista visual de boards con cards
- Modal para crear board
- Ruta y página de detalle `/boards/:id`
- Vista Kanban con 4 columnas
- Modal para crear tarea
- Drag & drop + botones para mover tareas entre columnas

## Autor
**Luis Osvaldo Juanes Hinostroza**

- GitHub: [@LJuanes20](https://github.com/LJuanes20)
- LinkedIn: [in/ljuanes25](https://www.linkedin.com/in/ljuanes25/)