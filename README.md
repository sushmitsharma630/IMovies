# IMovies - Movie Ticket Booking Made Simple

A MERN-stack online movie ticket booking platform: browse movies, pick a showtime, select seats with live availability, and manage bookings.

## Tech Stack
- **Frontend:** React 18, React Router, Axios, Bootstrap 5, Vite
- **Backend:** Node.js, Express.js, JWT authentication, bcrypt
- **Database:** MongoDB with Mongoose

## Features
- User registration and login (JWT, hashed passwords)
- Browse, search and filter movies by genre
- Showtimes grouped by date and theatre
- Interactive seat map with real-time availability (auto-refresh every 5 s)
- Atomic seat booking that prevents double-booking
- My Bookings page with cancellation (seats are released)
- Auto-seeded demo data on first start

## Prerequisites
Node.js v16+, npm v8+, MongoDB running locally (or a MongoDB Atlas URI).

## Run the project
**1. Backend**
```
cd backend
npm install
npm start
```
Runs on http://localhost:5000. Demo movies/shows are seeded automatically on first start (or run `npm run seed` to reset them).
Edit `backend/.env` to change the MongoDB URI or JWT secret.

**2. Frontend** (new terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | - | Register |
| POST | /api/auth/login | - | Login, returns JWT |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/movies?search=&genre= | - | List movies |
| GET | /api/movies/:id | - | Movie details |
| GET | /api/shows/movie/:movieId | - | Upcoming shows |
| GET | /api/shows/:id | - | Show with booked seats |
| POST | /api/bookings | Yes | Book seats `{showId, seats}` |
| GET | /api/bookings/mine | Yes | My bookings |
| DELETE | /api/bookings/:id | Yes | Cancel booking |

## Project Structure
```
IMovies/
├── backend/   (config, models, middleware, routes, server.js, seed.js)
└── frontend/  (src/pages, components, context, api.js)
```
