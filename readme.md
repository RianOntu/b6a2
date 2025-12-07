🚗 Vehicle Rental System – Backend API

A fully-featured backend service for managing vehicle rentals, built with a strong emphasis on modular architecture, security, and scalability.
This project demonstrates real-world backend system design using Node.js, TypeScript, Express, and PostgreSQL without ORM tools like Prisma.

📌 Overview

The Vehicle Rental System provides a robust API that supports:

Vehicle inventory management

Customer and admin user management

Booking creation, cancellation, and return flow

Automatic price calculation

Token-based authentication

Role-based access control

Clean, maintainable feature-based architecture

It is designed to mirror a production-grade backend system while maintaining clarity and simplicity.

🛠️ Tech Stack
Category	Technology
Runtime	Node.js
Language	TypeScript
Framework	Express.js
Database	PostgreSQL
Authentication	JWT
Password Hashing	bcrypt
Querying	pg (PostgreSQL client)
📁 Project Architecture

The system follows a modular, feature-driven architecture with a clean separation of concerns:

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


Each module contains its own routes, controllers, and services, making the codebase scalable and easy to maintain.

🗄️ Database Schema
Users

id

name

email (unique)

password (hashed)

phone

role → admin | customer

Vehicles

id

vehicle_name

type → car, bike, van, SUV

registration_number (unique)

daily_rent_price

availability_status → available | booked

Bookings

id

customer_id

vehicle_id

rent_start_date

rent_end_date

total_price

status → active | cancelled | returned

🔐 Authentication & Authorization
Roles

Admin

Manage vehicles

View all users & bookings

Update/delete users

Mark bookings as returned

Customer

View all vehicles

Create bookings

Cancel bookings before start date

View & update own profile

Auth Flow

Register → /api/v1/auth/signup

Login → /api/v1/auth/signin

Receive JWT token

Protected routes require:

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
PUT	/api/v1/users/:id	Admin or Own
DELETE	/api/v1/users/:id	Admin
📅 Bookings
Method	Endpoint	Access
POST	/api/v1/bookings	Customer/Admin
GET	/api/v1/bookings	Role-based
PUT	/api/v1/bookings/:id	Role-based
📅 Booking Functionality
✔ For Customers

Create new booking

Auto-calculated total price (daily_rent × days)

Cancel only before the start date

View own bookings

✔ For Admins

Full booking access

Mark bookings as returned

Vehicle automatically becomes available

✔ Automatic System Behavior

Auto-return booking when end date passes

Auto-update vehicle availability

Prevents overlapping active bookings

▶️ Installation & Setup
1. Install Dependencies
npm install

2. Environment Variables

Create .env:

PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/vehicle_rental
JWT_SECRET=your_secret_key

3. Start Application
npm run dev