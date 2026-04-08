# OpenCare Backend

This README describes the files and structure of the `backend/` folder for the OpenCare project.

## Overview

The backend is an Express.js application using MongoDB via Mongoose. It provides authentication and foundational models for users, services, reviews, and bookings.

## Top-level files

- `app.js`
  - Main Express application setup.
  - Loads environment variables, connects to the database, configures middleware, and mounts routes.
  - Exports the Express app for the server.

- `server.js`
  - Starts the HTTP server at `process.env.PORT` or `8000`.
  - Imports the Express app from `app.js`.

- `package.json`
  - Defines backend dependencies and scripts.
  - Important scripts:
    - `npm start` → starts the backend with `node server.js`
    - `npm run dev` → starts the backend with `nodemon server.js`
    - `npm run create-admin` → runs `node scripts/createAdmin.js` (if this helper exists)

- `package-lock.json`
  - Locks the installed package versions.

- `.env`
  - Environment variable file used by `dotenv`.
  - Should include values like `MONGODB_URI` and `JWT_SECRET`.

- `.gitignore`
  - Excludes files and directories that should not be committed, such as `node_modules` and environment files.

## Configuration

- `config/db.js`
  - Connects to MongoDB using Mongoose.
  - Reads `MONGODB_URI` from the environment.
  - Sets database connection options and logs success or failure.

## Controllers

- `controllers/auth.controller.js`
  - Handles authentication-related operations:
    - `register` → creates a new user and returns a JWT.
    - `login` → authenticates an existing user and returns a JWT.
    - `getMe` → returns the currently authenticated user's details.
  - Uses shared response utilities for consistent API responses.

## Routes

- `routes/auth.routes.js`
  - Defines authentication routes mounted under `/api/auth`:
    - `POST /register`
    - `POST /login`
    - `GET /me`
  - Applies `auth.middleware` to protect the `/me` route.

## Middleware

- `middlewares/auth.middleware.js`
  - Verifies JWT tokens from the `Authorization` header.
  - Loads the authenticated user and attaches it to `req.user`.
  - Returns standard error responses for missing, invalid, or expired tokens.

- `middlewares/role.middleware.js`
  - Provides role-based access control.
  - Accepts allowed roles and blocks requests when the authenticated user's role is not permitted.

## Models

- `models/user.model.js`
  - Defines the User schema.
  - Fields include `name`, `email`, `password`, `role`, `location`, and `isVerified`.
  - Hashes passwords before saving.
  - Provides a `comparePassword` method for login validation.

- `models/service.model.js`
  - Defines the Service schema.
  - Fields include `title`, `description`, `category`, `price`, `provider`, `location`, and rating summary fields.
  - Associates each service with a `provider` user.

- `models/review.model.js`
  - Defines the Review schema.
  - Fields include `user`, `service`, `rating`, and `comment`.
  - Enforces one review per user/service combination.
  - Automatically updates the related service rating when reviews are saved or deleted.

- `models/booking.model.js`
  - Defines the Booking schema.
  - Fields include `user`, `provider`, `service`, `date`, `status`, and `note`.
  - Prevents duplicate bookings for the same user, service, and date.

## Utilities

- `utils/generateToken.js`
  - Creates JWT tokens using `userId` and `role`.
  - Reads `JWT_SECRET` and `JWT_EXPIRE` from environment variables.

- `utils/apiResponse.js`
  - Provides helper functions for standardized API responses:
    - `successResponse`
    - `errorResponse`

## How to Run

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file with the required environment variables, for example:

```env
MONGODB_URI=mongodb://localhost:27017/opencare
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
PORT=8000
```

3. Start the server:

```bash
npm run dev
```

4. The backend will be available at `http://localhost:8000`.

## Notes

- The current backend exposes authentication routes and foundational models.
- Additional controllers and routes should be added under `controllers/` and `routes/` as new features are implemented.
- Middleware and utility helpers are designed for reuse across future features.
