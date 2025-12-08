# Vehicle Rental System — Backend API

> A production-like, modular backend service for managing vehicle rentals using **Node.js**, **TypeScript**, **Express**, and **PostgreSQL** (no ORM — using `pg`).

## 📘 Overview

Vehicle Rental System is a modular backend API that demonstrates real-world backend techniques:

- JWT authentication & role-based authorization
- Booking lifecycle (create → cancel → return)
- PostgreSQL using raw queries (`pg`)
- Feature-based folder structure
- Automatic price calculation
- Prevent overlapping bookings

---

## 🚀 Features

- Vehicle inventory management
- User management (admin + customer)
- Booking create/cancel/return
- Auto-update vehicle availability
- Secure password hashing using bcrypt
- Token-based authentication

---

## 🛠 Tech Stack

| Category       | Technology |
| -------------- | ---------- |
| Runtime        | Node.js    |
| Language       | TypeScript |
| Framework      | Express.js |
| Database       | PostgreSQL |
| Authentication | JWT        |
| Hashing        | bcrypt     |
| Querying       | pg         |

---

## 🗂 Project Structure

```bash
src/
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── vehicles/
 │    └── bookings/
 ├── middlewares/
 ├── utils/
 ├── app.ts
 └── server.ts

 🔐 Authentication & Authorization
Roles

Admin

Customer

Flow

Register → /api/v1/auth/signup

Login → /api/v1/auth/signin

Receive JWT Token

Use token in protected routes:

Authorization: Bearer <token>

🌐 API Endpoints
🔑 Auth
Method	Endpoint	Description
POST	/api/v1/auth/signup	Register
POST	/api/v1/auth/signin	Login
🚗 Vehicles
Method	Endpoint	Access
POST	/api/v1/vehicles	Admin
GET	/api/v1/vehicles	Public
GET	/api/v1/vehicles/:id	Public
PUT	/api/v1/vehicles/:id	Admin
DELETE	/api/v1/vehicles/:id	Admin
👥 Users
Method	Endpoint	Access
GET	/api/v1/users	Admin
PUT	/api/v1/users/:id	Admin or Owner
DELETE	/api/v1/users/:id	Admin
📅 Bookings
Method	Endpoint	Access
POST	/api/v1/bookings	Customer/Admin
GET	/api/v1/bookings	Role-based
PUT	/api/v1/bookings/:id	Role-based
▶️ Quick Start

Install dependencies
npm install

Start development server
npm run dev
```
