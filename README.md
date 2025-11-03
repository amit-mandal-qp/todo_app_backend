# Todo App Backend

A NestJS-based REST API backend for a todo application with user authentication
and task management.

## Features

- 🔐 User Authentication
  - JWT-based authentication
  - Signup and Login endpoints
  - Password hashing with bcrypt
  - Bloom filter for optimized username checks
  - Redis integration for bloom filter persistence

- ✅ Task Management
  - CRUD operations for tasks
  - Task priorities (LOW, MEDIUM, HIGH)
  - Task statuses (PENDING, IN_PROGRESS, COMPLETED)
  - User-specific task lists
  - Protected routes with JWT middleware

- 🛠️ Technical Features
  - PostgreSQL database with TypeORM
  - Environment-based configuration
  - Request validation using class-validator
  - Comprehensive error handling
  - Unit and E2E testing setup
  - Docker support for development and testing

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- Redis

## Project Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files: Create `src/config/.env.development` and
   `src/config/.env.test` with the following structure:

```env
DB_HOST=localhost
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
NODE_ENV=development/test
ENVIRONMENT=development/test
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. Start development database:

```bash
docker-compose up -d
```

4. Start test database:

```bash
npm run start:docker
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Endpoints

### Auth Module

- POST `/auth/signup` - Create new user
- POST `/auth/login` - User login
- GET `/auth` - Get profile details

### Task Module

- GET `/task/list` - Get all tasks for authenticated user
- POST `/task/create` - Create new task
- PUT `/task/update/:id` - Update task
- DELETE `/task/delete/:id` - Delete task

## Project Structure

```
src/
├── modules/
│   ├── auth/             # Authentication module
│   │   ├── application/  # Application layer (controllers, services, DTOs)
│   │   └── domain/      # Domain layer (entities, repositories)
│   └── task/            # Task management module
│       ├── application/ # Application layer
│       └── domain/     # Domain layer
├── middleware/          # Custom middlewares
├── common/             # Shared utilities and types
└── config/            # Configuration files
```

## Development Tools

- ESLint for code linting
- Prettier for code formatting
- Jest for testing
- TypeORM for database management
- Class Validator for DTO validation

## Docker Support

The project includes Docker configurations for both development and testing
environments:

```bash
# Start test environment
npm run start:docker

# Stop test environment
npm run stop:docker
```
