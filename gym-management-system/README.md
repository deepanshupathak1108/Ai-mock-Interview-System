# MERN Gym Management System

This is a standalone multi-tenant gym management app scaffolded under `gym-management-system`.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, simulated OTP email helper
- Frontend: React, Vite, Tailwind CSS, Chart.js

## Run Locally

1. Open `gym-management-system/server` and copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and `JWT_SECRET`.
3. Open `gym-management-system/client` and copy `.env.example` to `.env`.
4. From `gym-management-system`, run `npm run install:all`.
5. Run the API with `npm run dev:server`.
6. Run the client with `npm run dev:client`.

The API defaults to `http://localhost:5001`.
The client defaults to `http://localhost:5174`.

## Demo Data

After configuring MongoDB and installing dependencies:

```bash
npm run seed
```

Demo login:

- Username: `fitforge`
- Password: `password123`

## Deploy To Vercel

Use `gym-management-system` as the Vercel project root directory.

Set these environment variables in Vercel:

- `MONGODB_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a long random production secret
- `JWT_EXPIRES_IN`: `7d`
- `SIMULATE_EMAIL`: `true`
- `CLIENT_URL`: your Vercel app URL, for example `https://your-app.vercel.app`
- `VITE_API_URL`: `/api`

The included `vercel.json` builds the Vite client from `client/` and exposes the Express API through the serverless handler in `api/[...path].js`.

For MongoDB, use Atlas instead of `mongodb://127.0.0.1:27017/...` because Vercel cannot reach your local database.

## Implemented Features

- Owner registration and login with JWT protection
- Multi-gym tenant scoping for members and plans
- Forgot password OTP request, verify, and reset flow
- Dynamic plan creation and active/paused toggles
- Member registration with tenant-relative IDs such as `M1`, `M2`
- 9-item server-side pagination with name/mobile search
- Date filters for monthly joined, expiring in 3 days, expiring in 4-7 days, expired, and inactive
- Member inspector, status toggle, and renewal modal
- Renewal dates calculated from today
- Dashboard metric cards and Chart.js doughnut composition
