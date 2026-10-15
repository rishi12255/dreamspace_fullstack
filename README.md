# DreamSpace — Dreams & Hobbies Wall

A full-stack starter website where people can write down their dreams, hobbies, goals, and aspirations.

## Tech stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Features
- Add a dream or hobby with a title, description, author name, and category
- View the community wall
- Search posts
- Filter by Dreams or Hobbies
- Delete a post
- Responsive design

## Run locally

### 1. Requirements
Install Node.js (LTS) and have a MongoDB database available. You can use local MongoDB or MongoDB Atlas.

### 2. Backend
```bash
cd backend
npm install
```
Create `backend/.env` based on `.env.example`, then set `MONGODB_URI`.
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

### 3. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Environment variables
Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dreamspace
CLIENT_URL=http://localhost:5173
```

Frontend `.env` (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## API routes
- `GET /api/posts` — list posts; optional `?category=dream` or `?category=hobby` and `?search=...`
- `POST /api/posts` — create a post
- `DELETE /api/posts/:id` — delete a post
- `GET /api/health` — health check

## Before deploying
Add authentication and authorization before allowing users to manage their own posts. This starter lets anyone delete any post, so the delete feature is suitable for a local demo only. Never commit your `.env` file or database credentials.
