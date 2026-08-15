# Gym Management System API

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and `JWT_SECRET`.
3. Install dependencies with `npm install`.
4. Run `npm run dev`.

The API runs on `http://localhost:5001` by default.

## Core Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password/request-otp`
- `POST /api/auth/forgot-password/verify-otp`
- `POST /api/auth/forgot-password/reset`
- `GET /api/auth/me`
- `POST /api/members/register`
- `GET /api/members/list?page=1&search=&filter=all`
- `GET /api/members/metrics`
- `PUT /api/members/update-status/:id`
- `POST /api/members/renew/:id`
- `GET /api/plans`
- `POST /api/plans`
- `PATCH /api/plans/:id/toggle`
