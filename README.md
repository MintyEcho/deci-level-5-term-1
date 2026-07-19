# Shop Project

## Structure
- `frontend/` — React (Vite) — pages: Home, Products, Cart, Admin
- `backend/` — Node.js + Express — routes/controllers/middlewares
  - PostgreSQL via Prisma (users, products, categories, orders)
  - MongoDB via Mongoose (reviews, activity logs)

## Setup
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cd backend && npm install && npx prisma migrate dev --name init && npm run dev
cd frontend && npm install && npm run dev
```
