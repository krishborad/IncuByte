# Car Dealership Inventory System

A professional, production-ready full-stack Car Dealership Inventory System built with Node.js, Express, TypeScript, MongoDB, React, Vite, and Tailwind CSS. The project is developed using strict Test-Driven Development (TDD) principles.

## Project Structure

```text
car-dealership/
├── backend/
│   ├── src/
│   │   ├── config/          # App and Database configuration
│   │   ├── controllers/     # Controller layer (routes handling, sends responses)
│   │   ├── middlewares/     # Middlewares (Auth, Error handling, etc.)
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API Route definitions
│   │   ├── services/        # Service layer (business logic)
│   │   ├── repositories/    # Data access layer
│   │   ├── validators/      # Input validation schemas
│   │   └── utils/           # Utilities
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/      # UI components
    │   ├── contexts/        # React context (Auth Context)
    │   ├── hooks/           # Custom React hooks
    │   ├── layouts/         # Layout components (Navbar, Footer, etc.)
    │   ├── pages/           # Pages (Dashboard, Login, Register, etc.)
    │   ├── routes/          # App routes (Protected, Admin, Public)
    │   ├── services/        # API service calls
    │   ├── styles/          # Styling
    │   ├── utils/           # Helper utilities
    │   └── main.tsx
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── jest.config.cjs
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Database Configuration

The system uses Mongoose to manage MongoDB Atlas / MongoDB connection logic (`backend/src/config/db.ts`).

- Environment Variable: `MONGO_URI`
- Supports connection & disconnection lifecycle handling with full unit test coverage (`src/tests/db.test.ts`).

## Authentication System

Full-stack authentication system built using Repository → Service → Controller architecture, bcrypt password hashing, JWT tokens, and strict input validation.

### Endpoints
- `POST /api/auth/register` - Register a new user (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` - Authenticate user and receive JWT token (`email`, `password`)

### Features & Security
- **Password Hashing**: Automatic pre-save bcrypt salt & hashing in Mongoose User model (`backend/src/models/user.model.ts`).
- **Duplicate Email Prevention**: Instant lookup & validation rejecting existing email registrations.
- **JWT Authorization**: Utility for signing and verifying tokens (`backend/src/utils/jwt.utils.ts`).
- **Input Validation**: Dedicated validator middlewares (`backend/src/validators/auth.validator.ts`).
- **Centralized Error Handling**: Standardized JSON error responses (`backend/src/middlewares/error.middleware.ts`).

## Running the Application
- Backend development server: `npm run dev` (from `backend/` directory)
- Frontend development server: `npm run dev` (from `frontend/` directory)

## Running Tests
- Backend tests: `npm test` (from `backend/` directory)
- Frontend tests: `npm test` (from `frontend/` directory)


