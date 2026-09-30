# সহজ বাজার — Vite Frontend

React + Vite frontend for the existing সহজ বাজার backend.

## Run

1. Make sure the backend is running.
2. Check `.env`:
   `VITE_API_BASE_URL=http://localhost:5000/api`
3. Install:
   `npm install`
4. Start:
   `npm run dev`
5. Open:
   `http://localhost:5173`

## Backend API paths used

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/profile`
- `POST /auth/addresses`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `POST /orders`
- `GET /orders/my`
- `GET /orders/:id`
- `PATCH /orders/:id/cancel`
- `GET /admin/dashboard`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `GET /admin/customers`

## Important

The frontend does not invent or change backend endpoints. If your backend uses a different base URL, change only `VITE_API_BASE_URL` in `.env`.

Image fields can be either a full URL or a relative path; the frontend handles both.
