# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Architecture

This is a Node.js/Express REST API with PostgreSQL database using Drizzle ORM. The application follows a layered architecture with clear separation of concerns:

- **Controllers** (`src/controllers/`) - Handle HTTP requests/responses and coordinate between services
- **Services** (`src/services/`) - Contain business logic and interact with the database
- **Models** (`src/models/`) - Define database schema using Drizzle ORM
- **Routes** (`src/routes/`) - Define API endpoints and route handlers
- **Middleware** (`src/middleware/`) - Custom middleware for validation and error handling
- **Utils** (`src/utils/`) - Utility functions for JWT, password hashing, cookies
- **Config** (`src/config/`) - Configuration files for database and logging
- **Validations** (`src/validations/`) - Zod schemas for input validation
- **Exceptions** (`src/exceptions/`) - Custom exception classes


## Tree Structure

```bash
├── api.http
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Dockerfile.prod
├── DOCKER_SETUP.md
├── drizzle
│   ├── 0000_melted_retro_girl.sql
│   └── meta
│       ├── 0000_snapshot.json
│       └── _journal.json
├── drizzle.config.js
├── eslint.config.js
├── index.js
├── jest.config.js
├── jsconfig.json
├── logs
│   ├── combined.log
│   └── error.log
├── package.json
├── package-lock.json
├── README.md
├── scripts
│   ├── dev.sh
│   └── prod.sh
├── src
│   ├── app.js
│   ├── common
│   │   ├── http-status
│   │   │   └── index.js
│   │   └── validations
│   │       └── id.validation.js
│   ├── config
│   │   ├── arcject.js
│   │   ├── database.js
│   │   └── logger.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── exceptions
│   │   ├── exception.js
│   │   └── index.js
│   ├── index.js
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── security.middleware.js
│   │   └── validation-error.middleware.js
│   ├── models
│   │   └── user.model.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── server.js
│   ├── services
│   │   ├── auth.service.js
│   │   └── users.service.js
│   ├── tests
│   │   └── app.spec.js
│   ├── utils
│   │   ├── compare-password.js
│   │   ├── cookies.js
│   │   ├── hash-password.js
│   │   └── jwt.js
│   └── validations
│       ├── auth.validation.js
│       ├── format.js
│       └── users
│           └── update-user.validation.js
└── WARP.md
```

## Path Imports System

The project uses Node.js import maps (defined in `package.json`) for clean imports:

- `#config/*` → `./src/config/*.js`
- `#models/*` → `./src/models/*.js`
- `#utils/*` → `./src/utils/*.js`
- `#controllers/*` → `./src/controllers/*.js`
- `#routes/*` → `./src/routes/*.js`
- `#services/*` → `./src/services/*.js`
- `#middleware/*` → `./src/middleware/*.js`
- `#validations/*` → `./src/validations/*.js`
- `#exceptions/*` → `./src/exceptions/*.js`
- `#common/*` → `./src/common/*.js`

Always use these path aliases when importing from these directories.

## Database

- **ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Serverless PostgreSQL
- **Connection**: Configured in `src/config/database.js`
- **Models**: Located in `src/models/` directory
- **Migrations**: Generated SQL files in `drizzle/` directory

## Development Commands

```bash
# Start development server with file watching
npm run dev

# Database operations
npm run db:generate   # Generate Drizzle migrations
npm run db:migrate    # Run database migrations
npm run db:studio     # Open Drizzle Studio (database GUI)

# Code quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues automatically
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## Authentication System

The project implements JWT-based authentication:

- User registration endpoint: `POST /api/auth/register`
- JWT tokens are set as HTTP-only cookies via `cookies.set()`
- Password hashing using bcrypt
- User model includes: id, name, email, password, role, timestamps

## Logging

Uses Winston logger configured in `src/config/logger.js`:

- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console logging enabled in non-production environments
- HTTP request logging via Morgan middleware

## Error Handling

- Custom exception classes in `src/exceptions/`
- Global error middleware in `app.js`
- Validation errors handled via Zod schemas
- Structured error responses with appropriate HTTP status codes

## API Testing

Use the `api.http` file with REST Client extensions for testing endpoints. Base URL: `http://localhost:3000/api`

## Key Dependencies

- **Framework**: Express.js 5.x
- **Database**: Drizzle ORM + Neon PostgreSQL
- **Security**: Helmet, CORS, bcrypt, JWT
- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Dev Tools**: ESLint, Prettier, Drizzle Kit
