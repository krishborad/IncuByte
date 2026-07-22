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
- `GET /api/auth/me` - Protected endpoint returning authenticated user payload (`Bearer <token>`)
- `GET /api/auth/admin-only` - Protected admin-only endpoint (`Bearer <token>`, role: `admin`)

### Features & Security
- **Password Hashing**: Automatic pre-save bcrypt salt & hashing in Mongoose User model (`backend/src/models/user.model.ts`).
- **Duplicate Email Prevention**: Instant lookup & validation rejecting existing email registrations.
- **JWT Authentication Middleware**: `authenticate` middleware (`backend/src/middlewares/auth.middleware.ts`) validates Bearer tokens and populates `req.user`.
- **Role-Based Authorization & Admin Middleware**: `authorize(...roles)` and `requireAdmin` middlewares enforce RBAC and return `403 Forbidden` for unauthorized roles.
- **Input Validation**: Dedicated validator middlewares (`backend/src/validators/auth.validator.ts`).
- **Centralized Error Handling**: Standardized JSON error responses (`backend/src/middlewares/error.middleware.ts`).

## Vehicle Inventory System

### Endpoints
- `POST /api/vehicles` - Add a new vehicle to dealership inventory (**Admin Only**, Requires `Bearer <token>` with `role: 'admin'`)
- `PUT /api/vehicles/:id` - Update an existing vehicle (**Admin Only**, Requires `Bearer <token>` with `role: 'admin'`)
- `DELETE /api/vehicles/:id` - Soft delete an existing vehicle (**Admin Only**, Requires `Bearer <token>` with `role: 'admin'`)
- `POST /api/vehicles/:id/purchase` - Purchase a vehicle and atomically decrease stock (**Authenticated Route**, Requires `Bearer <token>`)
- `GET /api/vehicles` - Fetch paginated, filtered, and sorted list of active vehicles (**Public Route**)


  - **Query Parameters**:
    - `search` / `q`: Global search keyword (case-insensitive `$or` search across `make`, `model`, and `description`)
    - `page` (default: 1): Page number
    - `limit` (default: 10, max: 100): Results per page
    - `sortBy` (default: `createdAt`): Field to sort by (`price`, `year`, `mileage`, `createdAt`)
    - `sortOrder` (default: `desc`): `asc` or `desc`
    - `make`: Filter by manufacturer (case-insensitive search)
    - `model`: Filter by model name (case-insensitive search)
    - `minPrice` / `maxPrice`: Numeric price range filter
    - `minYear` / `maxYear`: Numeric manufacture year range filter
    - `fuelType`: Exact fuel type match (`Gasoline`, `Diesel`, `Electric`, `Hybrid`, `Plug-in Hybrid`)
    - `transmission`: Exact transmission match (`Automatic`, `Manual`, `CVT`, `Dual-Clutch`)


### Data Model & Validation
The Vehicle schema (`backend/src/models/vehicle.model.ts`) defines the core data model for dealership inventory items with comprehensive validation constraints:

| Field | Type | Validation Rules | Description |
| :--- | :--- | :--- | :--- |
| `make` | String | Required, Trimmed | Manufacturer (e.g. Toyota, Honda) |
| `model` | String | Required, Trimmed | Vehicle model (e.g. Camry, Civic) |
| `year` | Number | Required, Min: 1900, Max: Current Year + 1 | Model manufacture year |
| `price` | Number | Required, Min: 0 | Listing price in USD |
| `mileage` | Number | Required, Min: 0 | Odometer reading |
| `fuelType` | String | Required, Enum: `Gasoline`, `Diesel`, `Electric`, `Hybrid`, `Plug-in Hybrid` | Fuel type |
| `transmission` | String | Required, Enum: `Automatic`, `Manual`, `CVT`, `Dual-Clutch` | Transmission type |
| `stock` | Number | Required, Min: 0, Default: 1 | Available inventory quantity |
| `image` | String | Optional, Placeholder default | Primary image URL |
| `description` | String | Optional, Trimmed | Additional vehicle details |
| `isDeleted` | Boolean | Default: `false`, Indexed | Soft delete state flag |


## Running the Application
- Backend development server: `npm run dev` (from `backend/` directory)
- Frontend development server: `npm run dev` (from `frontend/` directory)

## Running Tests
- Backend tests: `npm test` (from `backend/` directory)
- Frontend tests: `npm test` (from `frontend/` directory)






