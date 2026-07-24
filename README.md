# 🚗 Car Dealership Inventory System

A full-stack Car Dealership Inventory Management System built using **FastAPI**, **React (Vite)**, **SQLite**, and **JWT Authentication**.

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Role-Based Access (Admin/User)

### Vehicle Management
- View all vehicles
- Search vehicles by make
- Add new vehicle (Admin)
- Update vehicle details (Admin)
- Delete vehicle (Admin)
- Restock vehicle (Admin)
- Purchase vehicle (User)

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Passlib (bcrypt)

### Frontend
- React
- Vite
- Axios
- Bootstrap
- React Router DOM

## Project Structure

```
car-dealership-system/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── dealership.db
│   └── make_admin.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger API:

```
http://127.0.0.1:8000/docs
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

## Admin Access

Promote an existing user to admin by running:

```bash
python make_admin.py
```

## API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Vehicles

- GET `/api/vehicles`
- GET `/api/vehicles/search`
- POST `/api/vehicles`
- PUT `/api/vehicles/{id}`
- DELETE `/api/vehicles/{id}`
- POST `/api/vehicles/{id}/purchase`
- POST `/api/vehicles/{id}/restock`

# Car Dealership Inventory System

## Live Demo
Frontend:
https://car-dealership-system-sooty.vercel.app/

Backend API:
https://car-dealership-system-1.onrender.com

Swagger Docs:
https://car-dealership-system-1.onrender.com/docs

## Author

**Karan Kamaliya**

## co author
 **chatgpt**
