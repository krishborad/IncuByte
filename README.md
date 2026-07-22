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

## Running the Application
- Backend development server: `npm run dev` (from `backend/` directory)
- Frontend development server: `npm run dev` (from `frontend/` directory)

## Running Tests
- Backend tests: `npm test` (from `backend/` directory)
- Frontend tests: `npm test` (from `frontend/` directory)
