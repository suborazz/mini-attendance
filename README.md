# Mini Attendance + Task Management System

A professional, production-ready full-stack application featuring real-time attendance tracking and task management.

**Live Project Links:**
- **Frontend App**: [https://mini-attendance-orcin.vercel.app](https://mini-attendance-orcin.vercel.app)
- **Backend API**: [https://mini-attendance-dig9.onrender.com/api/v1](https://mini-attendance-dig9.onrender.com/api/v1)

## Tech Stack

### Backend
- Node.js & Express.js
- Firebase Firestore (NoSQL Database)
- JWT Authentication (jsonwebtoken)
- bcryptjs (Password Hashing)
- express-validator (Input Validation)
- morgan (Logging)

### Frontend
- React.js (Vite)
- Axios (API Integration)
- SweetAlert2 (Professional Notifications)
- Vanilla CSS (Glassmorphism UI)

## Folder Structure

```text
Attendance/
├── backend/
│   ├── src/
│   │   ├── config/         # Firebase initialization
│   │   ├── controllers/    # Request handlers (Auth, Attendance, Task)
│   │   ├── middleware/     # Auth & Error handling
│   │   ├── routes/         # API Route definitions
│   │   └── app.js          # Express app configuration
│   ├── .env                # Environment variables
│   └── server.js           # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance configuration
│   │   ├── pages/          # UI Components & Page views
│   │   ├── App.jsx         # Routing & Protected routes
│   │   └── main.jsx        # Entry point
│   └── index.html
└── README.md
```

## Firestore Schema Design

- **users**: Stores user profiles.
  - `email` (Document ID)
  - `name`: User's full name
  - `password`: Hashed password (bcrypt)
  - `createdAt`: ISO Timestamp

- **attendance**: Stores daily attendance records.
  - `userEmail`: Reference to user
  - `date`: YYYY-MM-DD
  - `checkIns`: Array of `{ checkInTime: Timestamp, checkOutTime: Timestamp | null }`
  - `createdAt`: Timestamp

- **tasks**: Stores user-specific tasks.
  - `userId`: Reference to user email
  - `title`: Task heading
  - `description`: Detailed notes
  - `status`: "pending" | "completed"
  - `createdAt`: ServerTimestamp
  - `updatedAt`: ServerTimestamp

## API Documentation

All routes are prefixed with `/api/v1`.

### Authentication
- `POST /auth/register`: Create a new account.
- `POST /auth/login`: Authenticate and receive JWT.

### Attendance (Protected)
- `POST /attendance/checkin`: Start a new session (prevents duplicate open sessions).
- `POST /attendance/checkout`: End the current active session.
- `GET /attendance/my`: Retrieve all attendance records for the logged-in user.

### Tasks (Protected)
- `GET /tasks`: Fetch personal tasks.
- `POST /tasks`: Create a new task.
- `PUT /tasks/:id`: Update task title, description, or status.
- `DELETE /tasks/:id`: Permanently remove a task.

### System
- `GET /health`: Returns `{ status: "OK" }` for monitoring.

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Local Setup Instructions

1. **Clone the repository.**
2. **Backend Setup**:
   - `cd backend`
   - `npm install`
   - Configure `.env` with your Firebase credentials.
   - `npm run dev` (Runs on port 5000).
3. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm run dev` (Runs on port 5173).

## Deployment Steps

### Backend (Render)
1. Create a new **Web Service** on Render.
2. Connect your repository.
3. Set **Build Command**: `npm install` (in backend dir).
4. Set **Start Command**: `node server.js`.
5. Add all Environment Variables in the Render dashboard.

### Frontend (Vercel)
1. Create a new project in Vercel.
2. Set **Build Command**: `npm run build`.
3. Set **Output Directory**: `dist`.
4. Add **Environment Variable**: `VITE_API_URL=https://mini-attendance-dig9.onrender.com/api/v1`.

## Security Implementation

- **Data Privacy**: All Firestore queries use strict `.where('userId', '==', ...)` filters to ensure users only access their own data.
- **Password Security**: Passwords are never stored in plain text; they are hashed with a salt factor of 10 using `bcryptjs`.
- **JWT Protection**: All sensitive routes are protected by a middleware that verifies the JWT and rejects invalid or expired tokens (1-day expiration).
- **Validation**: `express-validator` ensures all incoming data meets the required structure before processing.

## Evaluation Criteria Covered

- [x] Full CRUD for tasks.
- [x] Multiple attendance sessions per day.
- [x] No duplicate/overlapping check-in sessions.
- [x] JWT-protected private routes.
- [x] Responsive "Flagship" UI with glassmorphism.
- [x] Production-ready configuration.
