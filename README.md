# 🕒 Attendance Hub | Ultimate Management System

[![Frontend Status](https://img.shields.io/website?url=https%3A%2F%2Fmini-attendance-orcin.vercel.app&label=Frontend&style=for-the-badge)](https://mini-attendance-orcin.vercel.app)
[![Backend Status](https://img.shields.io/website?url=https%3A%2F%2Fmini-attendance-dig9.onrender.com%2Fapi%2Fv1%2Fhealth&label=Backend&style=for-the-badge)](https://mini-attendance-dig9.onrender.com/api/v1/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Success-brightgreen.svg?style=for-the-badge)](#)

A flagship, production-ready full-stack application featuring real-time attendance tracking and task management. Engineered with a premium **Glassmorphism UI**, secured with **JWT Authentication**, and powered by a highly resilient **Firebase Firestore** backend.

---

## 🚀 Live Demo
Experience the professional workflow instantly:
*   **Web Portal**: [https://mini-attendance-orcin.vercel.app](https://mini-attendance-orcin.vercel.app)
*   **API Gateway**: [https://mini-attendance-dig9.onrender.com/api/v1](https://mini-attendance-dig9.onrender.com/api/v1)

---

## ✨ Key Features

### 🏢 Attendance Excellence
*   **Real-time Clock-In/Out**: Precision tracking of working hours with session persistence.
*   **Today's Logs**: Dynamic visual history of all attendance sessions for the current day.
*   **Automatic Overlap Prevention**: Intelligent guards prevent duplicate or overlapping check-ins.
*   **Status Indicators**: Live "Currently Working" or "Off-Duty" status synced with your profile.

### 📋 Smart Task Management
*   **Attendance-Locked Productivity**: Tasks can only be managed (created/deleted/completed) while you are clocked in, ensuring disciplined workflows.
*   **Full CRUD**: Blazing-fast task creation, completion toggles, and secure deletions.
*   **Real-time Updates**: Instant state synchronization across your dashboard.

### 🛡️ Enterprise Security
*   **JWT-Based Auth**: Secure token management stored locally for a seamless login experience.
*   **Password Hashing**: Industry-standard encryption using `bcryptjs`.
*   **Data Isolation**: Strict Firestore rules and server-side filtering ensure users only see their own private data.
*   **Input Validation**: Comprehensive sanitization using `express-validator`.

---

## 🛠️ Tech Stack

### Backend Infrastructure
*   **Runtime**: Node.js & Express.js
*   **Database**: Firebase Firestore (NoSQL)
*   **Auth**: JSON Web Tokens (JWT) & bcryptjs
*   **Logging**: Morgan & custom console logging

### Frontend Experience
*   **Framework**: React.js 19 (Vite)
*   **Styling**: Modern CSS Design System (Glassmorphism, CSS Variables, Flexbox/Grid)
*   **Interaction**: Axios, SweetAlert2 (Premium Notifications)

---

## 🏗️ Technical Architecture

```mermaid
graph TD
    User((User))
    subgraph "Frontend (Vercel)"
        React[React Dashboard]
        Axios[Axios Client / Interceptors]
    end
    subgraph "Backend (Render)"
        API[Express.js API Gateway]
        Middle[Auth Middleware / Validator]
    end
    subgraph "Database (Firebase)"
        DB[(Firestore NoSQL)]
    end

    User --> React
    React --> Axios
    Axios --> API
    API --> Middle
    Middle --> DB
```

---

## ⚙️ Detailed Configuration Guide

### � Firebase Setup (Backend)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. **Firestore Database**: Create a database in "Production" mode. Choose a location close to you.
4. **Service Account**:
   - Go to **Project Settings** > **Service accounts**.
   - Click **Generate new private key**.
   - Download the `.json` file.
5. **Environment Mapping**:
   - `FIREBASE_PROJECT_ID`: Find this in the JSON file.
   - `FIREBASE_CLIENT_EMAIL`: Find this in the JSON file.
   - `FIREBASE_PRIVATE_KEY`: Copy the entire text starting with `"-----BEGIN PRIVATE KEY-----\n..."`.

### 🔐 Authentication Setup
- Generate a strong `JWT_SECRET` string for token signing (e.g., using `openssl rand -base64 32`).

---

## �📂 Folder Structure

```text
Attendance/
├── backend/
│   ├── src/
│   │   ├── config/         # Firebase Admin SDK Configuration
│   │   ├── controllers/    # Business Logic (Auth, Attendance, Task)
│   │   ├── middleware/     # JWT Auth & Error Handling
│   │   ├── routes/         # Express API Route Definitions
│   │   └── app.js          # Main App Config & Middlewares
│   ├── .env                # Server Secrets (Ignored)
│   └── server.js           # Production Entry Point
├── frontend/
│   ├── src/
│   │   ├── api/            # API Client + Token Interceptors
│   │   ├── pages/          # Premium UI Views (Login, Dashboard, 404)
│   │   ├── App.jsx         # Routing & Protection Logic
│   │   └── main.jsx        # Client Runtime Entry
│   └── .env                # App Config (Ignored)
└── README.md               # Master Documentation
```

---

## 📊 Database Schema (Firestore)

| Collection | Description | Primary Fields |
| :--- | :--- | :--- |
| **users** | Member Profiles | `email`, `name`, `password` (hashed) |
| **attendance** | Daily Records | `userEmail`, `date`, `checkIns` (array) |
| **tasks** | Work Items | `userId`, `title`, `description`, `status` |

---

## 🛣️ API Documentation

All routes are prefixed with `/api/v1`.

### 🔐 Authentication
| Action | Endpoint | Method |
| :--- | :--- | :--- |
| Register | `/auth/register` | `POST` |
| Login | `/auth/login` | `POST` |

### ⌚ Attendance (JWT Protected)
| Action | Endpoint | Method |
| :--- | :--- | :--- |
| Clock In | `/attendance/checkin` | `POST` |
| Clock Out | `/attendance/checkout` | `POST` |
| Fetch Logs | `/attendance/my` | `GET` |

### 📝 Tasks (JWT Protected)
| Action | Endpoint | Method |
| :--- | :--- | :--- |
| List Tasks | `/tasks` | `GET` |
| Create Task | `/tasks` | `POST` |
| Update/Toggle | `/tasks/:id` | `PUT` |
| Remove Task | `/tasks/:id` | `DELETE` |

---

## 🛠️ Local Development

### 1️⃣ Clone the repository
```bash
git clone https://github.com/suborazz/mini-attendance.git
cd mini-attendance
```

### 2️⃣ Backend Startup
```bash
cd backend
npm install
# Configure .env based on the table below
npm run dev 
```

### 3️⃣ Frontend Startup
```bash
cd ../frontend
npm install
# Configure .env with VITE_API_URL=http://localhost:5000/api/v1
npm run dev
```

---

## � Troubleshooting Guide

| Issue | Solution |
| :--- | :--- |
| **Infinite Loading** | Check if the backend server is running and `VITE_API_URL` is correct. |
| **CORS Error** | Ensure the frontend domain is added to the backend CORS whitelist in `app.js`. |
| **Invalid Date in Logs** | Fixed! The system now automatically handles Firestore Timestamps. |
| **401 Unauthorized** | Token might be expired. Try logging out and logging back in. |
| **Firestore Index Error** | Fixed! Results are now sorted in-memory to avoid manual console configuration. |

---

## 🚀 Deployment

### Render (Backend)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Port, Firestore secrets, JWT secret.

### Vercel (Frontend)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_URL`.

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

Developed with ❤️ by [Subodh](https://github.com/suborazz)
