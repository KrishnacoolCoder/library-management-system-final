# Library Management System — Final

A placement-oriented backend project combining **OOP + DBMS + REST APIs + Software Engineering**.

## Features

- TypeScript + Node.js + Express
- MySQL relational database
- OOP: abstraction, inheritance, polymorphism, encapsulation
- Repository / Service / Controller architecture
- JWT authentication + bcrypt
- Role-based authorization
- OTP email verification
- Book CRUD and search
- Pagination and sorting
- Borrow/return workflows
- Fine calculation
- MySQL transactions + row-level locking
- Audit logs
- Swagger/OpenAPI
- Helmet, rate limiting, CORS and compression
- Jest automated tests
- Docker + Docker Compose
- Browser demo UI
- Postman-compatible REST API

## Local setup

### Option A — Local MySQL

1. Install Node.js 20+ and MySQL 8+.
2. Run:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure MySQL.
4. Run:
   ```bash
   npm run db:init
   npm run db:seed
   npm run dev
   ```
5. Visit:
   - App: http://localhost:3000
   - Swagger: http://localhost:3000/api/docs

### Option B — Docker

```bash
docker compose up --build
```

The API runs on port 3000 and MySQL on port 3306.

For the Docker database, credentials are defined in `docker-compose.yml`.

## Demo accounts

Password:

`Password@123`

- admin@library.local
- librarian@library.local
- student@library.local

## API

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/verify-email`
- POST `/api/auth/login`

### Books
- GET `/api/books?q=&page=1&limit=20&sort=title`
- GET `/api/books/:id`
- POST `/api/books`
- PUT `/api/books/:id`
- DELETE `/api/books/:id`

### Loans
- POST `/api/loans/borrow`
- POST `/api/loans/:id/return`
- GET `/api/loans/my`
- GET `/api/loans`

### Admin
- GET `/api/users`
- PATCH `/api/users/:id/status`
- GET `/api/users/audit-logs`

## Testing

```bash
npm test
npm run lint
npm run build
```

## Architecture

```text
Client
  |
REST API
  |
Middleware
  |
Controllers
  |
Services
  |
Domain Objects + Repositories
  |
MySQL
```

## OOP design

```text
              User
                |
       +--------+--------+
       |        |        |
    Student Librarian  Admin
```

The project is designed so the OOP concepts are part of actual business logic rather than decorative classes.
