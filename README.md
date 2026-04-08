# OpenCare Backend API

<a name="table-of-contents"></a>

A production-grade Node.js backend service for OpenCare, a multi-role booking and service provider platform. Built with Express.js, MongoDB, and JWT authentication.

**Version:** 1.0.0 | **Node:** 14.0+ | **NPM:** 6.0+

---

## 📋 Table of Contents

- [Overview](backend/README.md#overview)
- [Tech Stack](backend/README.md#tech-stack)
- [Features](backend/README.md#features)
- [Project Structure](backend/README.md#project-structure)
- [Installation](backend/README.md#installation)
- [Environment Setup](backend/README.md#environment-setup)
- [Running the Application](backend/README.md#running-the-application)
- [API Documentation](backend/README.md#api-documentation)
- [Database Models](backend/README.md#database-models)
- [Middleware & Architecture](backend/README.md#middleware--architecture)
- [Error Handling](backend/README.md#error-handling)
- [Development Guidelines](backend/README.md#development-guidelines)
- [Deployment](backend/README.md#deployment)

---

## Overview

OpenCare is a service booking platform that connects users with service providers. The backend handles:

- **User Management** → Registration, authentication, profile management
- **Service Management** → CRUD operations with filtering and search
- **Bookings** → Request management with status tracking
- **Reviews** → Rating system with automatic aggregation
- **Provider Dashboard** → Analytics and earnings tracking
- **Role-Based Access** → User, Provider, and Admin roles

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js 5.1.0 |
| Database | MongoDB + Mongoose 8.17.0 |
| Authentication | JWT (jsonwebtoken 9.0.2) |
| Password Hashing | bcrypt 6.0.0 |
| Request Validation | express-validator 7.2.1 |
| CORS | cors 2.8.5 |
| Environment | dotenv 17.2.1 |
| Development | Nodemon 3.1.10 |

---

## Features

✅ **Authentication & Authorization**
- JWT-based authentication with configurable expiry
- Role-based access control (RBAC): user, provider, admin
- Secure password hashing with bcrypt

✅ **User Management**
- User registration with email validation
- Profile management (name, location, email)
- Provider listing with filtering

✅ **Service Management**
- Full CRUD operations for services
- Advanced filtering: category, price range, location, keyword search
- Pagination and sorting
- Service status management

✅ **Bookings System**
- Create bookings for services
- Double-booking prevention
- Status tracking: pending, accepted, rejected, completed
- User and provider views

✅ **Review & Rating System**
- Post-booking reviews (5-star)
- Automatic service rating aggregation
- One review per user-service combination
- Review deletion with cascade updates

✅ **Provider Dashboard**
- Booking statistics
- Earnings breakdown by month
- Service management
- Revenue tracking

---

## Project Structure

```
backend/
├── config/
│   └── db.js                          # MongoDB connection setup
├── controllers/                       # Business logic layer
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── service.controller.js
│   ├── booking.controller.js
│   ├── review.controller.js
│   └── provider.controller.js
├── models/                            # Data schemas
│   ├── user.model.js
│   ├── service.model.js
│   ├── booking.model.js
│   └── review.model.js
├── routes/                            # API endpoints
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── service.routes.js
│   ├── booking.routes.js
│   ├── review.routes.js
│   └── provider.routes.js
├── middlewares/                       # Request handlers
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── role.middleware.js
├── utils/                             # Helper functions
│   ├── generateToken.js
│   └── apiResponse.js
├── app.js                             # Express app configuration
├── server.js                          # Server entry point
├── package.json
└── .env                               # Environment variables (not committed)
```

---

## Installation

### Prerequisites

- Node.js >= 14.0
- npm >= 6.0 or yarn
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)

### Setup Steps

1. **Clone the repository:**

```bash
git clone <repository-url>
cd OpenCare/backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file:**

```bash
cp .env.example .env  # If provided
# OR manually create .env
```

---

## Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/opencare
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/opencare

# JWT
JWT_SECRET=your_super_secret_jwt_key_changeme
JWT_EXPIRE=7d

# Optional: Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Security Note:** Never commit `.env` to version control. Use `.env.example` for reference.

---

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Uses `nodemon` to watch for file changes and automatically restart the server.

### Production Mode

```bash
npm start
```

Runs the server directly without file watchers.

### Output

```
server is listening at http://localhost:8000
connected to DB
```

---

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

Include JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",  // Optional: defaults to "user"
  "location": "New York"
}

Response (201):
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "eyJhbGci...",
    "user": { "_id", "name", "email", "role", "location" }
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful.",
  "data": { "token": "...", "user": {...} }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "User fetched successfully.",
  "data": { "user": {...} }
}
```

---

### User Endpoints

#### Get Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "location": "Boston",
  "password": "newPassword123"  // Optional
}
```

#### Get Providers

```http
GET /users/providers?location=New%20York&name=John
```

---

### Service Endpoints

#### Get All Services (Public)

```http
GET /services?category=plumbing&minPrice=50&maxPrice=500&location=NYC&keyword=urgent&page=1&limit=10&sortBy=createdAt&order=desc
```

**Query Parameters:**
- `category` - plumbing, electrical, tutoring, cleaning, carpentry, other
- `minPrice`, `maxPrice` - Price range filter
- `location` - Location filter
- `keyword` - Search across title and description
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `order` - asc or desc (default: desc)

#### Create Service

```http
POST /services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Plumbing Repair",
  "description": "Professional plumbing services",
  "category": "plumbing",
  "price": 75,
  "location": "New York"
}

Response (201): { "success": true, "data": { "service": {...} } }
```

#### Get Service by ID (Public)

```http
GET /services/:id
```

#### Update Service

```http
PUT /services/:id
Authorization: Bearer <token>
Content-Type: application/json

{ "title": "...", "price": "...", ... }
```

#### Delete Service

```http
DELETE /services/:id
Authorization: Bearer <token>
```

---

### Booking Endpoints

#### Create Booking

```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439011",
  "date": "2026-04-15T10:00:00Z",
  "note": "Please bring materials"
}

Response (201): { "success": true, "data": { "booking": {...} } }
```

#### Get My Bookings (User)

```http
GET /bookings/my-bookings
Authorization: Bearer <token>
```

#### Get Provider Bookings

```http
GET /bookings/provider
Authorization: Bearer <token>
```

#### Update Booking Status (Provider)

```http
PUT /bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted"  // pending, accepted, rejected, completed
}
```

---

### Review Endpoints

#### Add Review

```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent service!"
}
```

#### Get Service Reviews (Public)

```http
GET /reviews/service/:serviceId
```

#### Delete Review

```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

---

### Provider Endpoints

#### Get Provider Dashboard

```http
GET /providers/dashboard
Authorization: Bearer <token>
```

Returns: Total bookings, pending/accepted/completed/rejected counts, earnings, services count, average rating.

#### Get My Services

```http
GET /providers/my-services
Authorization: Bearer <token>
```

#### Get Earnings Breakdown

```http
GET /providers/earnings
Authorization: Bearer <token>
```

Returns: Monthly earnings breakdown.

---

## Database Models

### User

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'provider', 'admin'], default: 'user'),
  location: String,
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `{ email: 1 }`

---

### Service

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (required, enum: ['plumbing', 'electrical', 'tutoring', 'cleaning', 'carpentry', 'other']),
  price: Number (required, >= 0),
  provider: ObjectId (ref: User),
  location: String (required),
  rating: Number (0-5, default: 0),
  numReviews: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `{ provider: 1 }`, `{ isActive: 1 }`

---

### Booking

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  provider: ObjectId (ref: User, required),
  service: ObjectId (ref: Service, required),
  date: Date (required),
  status: String (enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending'),
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Index:** `{ user: 1, service: 1, date: 1 }` (prevents duplicate bookings)

---

### Review

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  service: ObjectId (ref: Service, required),
  rating: Number (required, 1-5),
  comment: String (max 500 chars),
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Index:** `{ user: 1, service: 1 }` (one review per user per service)
**Post-Hooks:** Auto-updates service rating and numReviews on save/delete.

---

## Middleware & Architecture

### Authentication Flow

1. Client sends request with `Authorization: Bearer <token>` header
2. `auth.middleware.js` extracts and verifies JWT
3. User is loaded from DB and attached to `req.user`
4. Request proceeds to next middleware/controller

### Role-Based Access Control

```javascript
// Protect provider routes
router.use(authMiddleware, roleMiddleware('provider'));

// Or inline
router.post('/', authMiddleware, roleMiddleware('provider', 'admin'), controller);
```

### Error Handling

The `error.middleware.js` centralizes error responses:

- **CastError** → 404 (invalid ObjectId)
- **ValidationError** → 400 (schema validation)
- **Duplicate Key** → 400 (unique constraint)
- **JWT Errors** → 401 (invalid/expired token)
- **Generic Errors** → 500 (uncaught server errors)

All errors return standardized JSON:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## Development Guidelines

### Code Style

- Use async/await for asynchronous operations
- Validate inputs with `express-validator`
- Always use the `successResponse` and `errorResponse` utilities
- Keep controllers lean; move logic to models when appropriate

### Adding New Routes

1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Mount route in `app.js`: `app.use('/api/endpoint', routes)`
4. Apply middleware as needed (`authMiddleware`, `roleMiddleware`)

### Password Handling

- Passwords are hashed with bcrypt before saving (pre-save hook)
- Use `.select('+password')` when explicitly needing the password field
- Always exclude password from response objects

### Best Practices

- Use connection pooling (configured in `config/db.js`)
- Handle timeout gracefully (6s selection, 45s socket)
- Validate all user inputs before DB queries
- Log errors with context (timestamp, endpoint, user ID)
- Test all endpoints with different roles (user, provider, admin)

---

## Error Handling Examples

### User-Friendly Errors

```javascript
// Bad ❌
if (!user) throw new Error('Not found');

// Good ✅
if (!user) return errorResponse(res, 404, 'User not found');
```

### Consistent Responses

```javascript
// Always use utilities
return successResponse(res, 200, 'Success message', { data });
return errorResponse(res, 400, 'Error message');
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All environment variables set in production
- [ ] MongoDB connection string configured for production cluster
- [ ] JWT_SECRET is a strong, random value
- [ ] Error logging configured (e.g., Sentry, LogRocket)
- [ ] Rate limiting enabled
- [ ] CORS configured for frontend domain
- [ ] All tests passing

### Deploy to Production

```bash
# Build/prepare
npm ci  # Install exact versions from package-lock.json
NODE_ENV=production npm start

# Or use a process manager like PM2:
npm install -g pm2
pm2 start server.js --name "opencare-api"
pm2 save
pm2 startup
```

### Environment for Production

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/opencare
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
```

### Health Check

```bash
curl http://localhost:8000/
# Expected: "hey new project"
```

---

## Support & Maintenance

- Monitor error logs regularly
- Keep dependencies updated: `npm audit` and `npm update`
- Review slow queries in MongoDB
- Maintain database indexes for performance
- Document API changes in this README

---

**Last Updated:** April 9, 2026  
**Maintainers:** OpenCare Team  
**License:** ISC
