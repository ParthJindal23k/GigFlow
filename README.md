# Mini-Freelance MarketPlace Platform

A full-stack web application for managing gigs and bids, built with React (Vite) for the frontend and Node.js/Express/MongoDB for the backend.

## Project Structure

```
Assignment_submit/
  backend/    # Node.js, Express, MongoDB API
  frontend/   # React (Vite) client
```

---

## Backend

- **Location:** `backend/`
- **Tech:** Node.js, Express, MongoDB, JWT
- **Main files:**
  - `server.js` - Entry point
  - `app.js` - Express app setup
  - `models/` - Mongoose models (`User.js`, `Gig.js`, `Bid.js`)
  - `routes/` - API routes (`authRoute.js`, `gigRoute.js`, `bidRoute.js`)
  - `middleware/auth.js` - JWT authentication middleware

### Setup

1. Install dependencies:
   ```
   cd backend
   npm install
   ```
2. Create a `.env` file with your MongoDB URI and JWT secret:
   ```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```
   npm start
   ```

---

## Frontend

- **Location:** `frontend/`
- **Tech:** React, Vite, React Router
- **Main files:**
  - `src/App.jsx` - Main app and routes
  - `src/components/ProtectedRoute.jsx` - Route protection
  - `src/pages/` - Page components (auth, dashboard, gigs)

### Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```

---

## Features

- User authentication (register, login, JWT-protected routes)
- Post and view gigs
- Place and manage bids
- Protected frontend and backend routes

---
