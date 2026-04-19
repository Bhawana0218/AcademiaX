

<div align="center">

# 🎓 AcademiaX - School Management System

**A Production-Ready, Enterprise-Grade School Management SaaS Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Docs](#-api-endpoints) • [Demo](#-demo-credentials)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Demo Credentials](#-demo-credentials)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Performance Optimizations](#-performance-optimizations)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AcademiaX** is a comprehensive, production-ready School Management System built with modern technologies and industry best practices. This full-stack SaaS application provides educational institutions with powerful tools for efficient student management, task tracking, and real-time analytics.

Originally developed as an extended solution beyond a technical assignment, AcademiaX demonstrates advanced full-stack development capabilities with features that go far beyond basic CRUD operations.

### 💡 Key Highlights

-  **Beyond Requirements**: Implemented 15+ advanced features beyond the assignment scope
-  **Production-Ready**: Enterprise-grade architecture with security, scalability, and performance
-  **Modern Stack**: Latest versions of React 18, Node.js 18+, Express 5.0, MongoDB
-  **Professional UI/UX**: Responsive design with dark mode and smooth animations
-  **Real-time Features**: Live notifications, activity feeds, and data visualization

---

## 🚀 Features

### 🔐 Core Functionality

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based auth with role-based access control (Admin/Teacher) |
| **Dashboard** | Real-time analytics with interactive charts and KPIs |
| **Student Management** | Complete CRUD with advanced search, filters, and pagination |
| **Task Management** | Assign, track, grade tasks with detailed reporting |
| **User Management** | Admin panel for managing users and permissions |

### ⚡ Advanced Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Dark Mode** | | Full dark/light theme with smooth transitions |
| **CSV Export** | | Export students and tasks data with one click |
| **Real-time Notifications** | | Activity feed and toast notifications |
| **Data Visualization** | | Interactive charts using Recharts |
| **Advanced Search** | | Multi-field search with fuzzy matching |
| **Server-side Pagination** | | Efficient handling of large datasets |
| **Form Validation** | | Client & server-side validation with Zod |
| **Responsive Design** | | Mobile-first, works on all devices |
| **Protected Routes** | | Role-based route protection |
| **Activity Logging** | | Track all user actions and changes |
| **Grade Management** | | Task grading with feedback system |
| **Statistics Dashboard** |  | Real-time stats and insights |
| **File Upload Ready** | | Architecture supports file attachments |
| **Error Handling** | | Comprehensive error handling & logging |
| **API Rate Limiting** | | DDoS protection and request throttling |

---

## 🛠️ Tech Stack

<div align="center">

### Full Stack Architecture

</div>

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 5.0 | Web application framework |
| **MongoDB** | 6+ | NoSQL database |
| **Mongoose** | Latest | MongoDB ODM |
| **JWT** | Latest | Authentication tokens |
| **bcryptjs** | Latest | Password hashing |
| **express-validator** | Latest | Input validation |
| **helmet** | Latest | Security headers |
| **cors** | Latest | Cross-origin resource sharing |
| **morgan** | Latest | HTTP request logger |
| **dotenv** | Latest | Environment variables |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library |
| **Vite** | Latest | Build tool & dev server |
| **React Router** | v6 | Client-side routing |
| **Tailwind CSS** | 3.0 | Utility-first CSS |
| **Zustand** | Latest | State management |
| **React Hook Form** | Latest | Form handling |
| **Zod** | Latest | Schema validation |
| **Axios** | Latest | HTTP client |
| **Recharts** | Latest | Data visualization |
| **React Hot Toast** | Latest | Notifications |

---

## 🏗️ Architecture

### System Architecture Diagram
```bash
┌─────────────────────────────────────────────────────────────┐
│ CLIENT LAYER │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ React 18 │ │ Tailwind │ │ Zustand │ │
│ │ Components │ │ CSS │ │ Store │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
│ REST API (Axios)
┌─────────────────────────▼───────────────────────────────────┐
│ API GATEWAY │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Express.js 5.0 + Middleware (Auth, Validation, CORS)│ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
│
┌─────────────────────────▼───────────────────────────────────┐
│ BUSINESS LOGIC │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────── │
│ │ Students │ │ Tasks │ │ Users │ │Dashboard │ │
│ │Controller│ │Controller│ │Controller│ │Controller│ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────┬───────────────────────────────────┘
│
┌─────────────────────────▼───────────────────────────────────┐
│ DATA LAYER │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ MongoDB + Mongoose ODM │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ │
│ │ │ Student │ │ Task │ │ User │ Models │ │
│ │ └─────────┘ └─────────┘ └─────────┘ │ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```
## 🐳 Docker Architecture

```bash
        ┌───────────────┐
        │   Browser     │
        │ http://localhost │
        └───────┬───────┘
                │
        ┌───────▼────────┐
        │    Nginx       │
        │  (Reverse Proxy)│
        └───────┬────────┘
        │                │
┌───────▼───────┐ ┌──────▼───────┐
│  Frontend     │ │   Backend     │
│ (React + Vite)│ │ (Node + API)  │
└───────────────┘ └──────┬────────┘
                         │
                 ┌───────▼────────┐
                 │   MongoDB       │
                 │ (Atlas / Local) │
                 └────────────────┘
```
---
## Project Structure
```bash
AcademiaX/
│
├── 🐳 docker-compose.yml
├── 🐳 nginx.conf
├── 📄 README.md
│
├── backend/
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── students.js
│   │   ├── tasks.js
│   │   └── users.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── validation.js
│   │
│   ├── models/
│   │   ├── Student.js
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── students.js
│   │   ├── tasks.js
│   │   └── users.js
│   │
│   ├── utils/
│   │   └── jwt.js
│   │
│   ├── 🐳 Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── AcademiaX-Logo.png
│   │   └── AcademiaX-LogoTitle.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Admin/
│   │   │   │   │   └── AdminDashboard.jsx
│   │   │   │   └── Teacher/
│   │   │   │       └── TeacherDashboard.jsx
│   │   │   │
│   │   │   ├── Users/
│   │   │   │   └── User.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── CreateStudent.jsx
│   │   │   │   ├── StudentDetail.jsx
│   │   │   │   └── Students.jsx
│   │   │   │
│   │   │   ├── tasks/
│   │   │   │   ├── CreateTask.jsx
│   │   │   │   ├── TaskDetail.jsx
│   │   │   │   └── Tasks.jsx
│   │   │   │
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── page.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── store/
│   │   │   └── authStore.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── 🐳 Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   └── jsconfig.json
```
## 🚦 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## Installation Guide

## 1. Option - 2

### 1. Clone the Repository

```bash
git clone https://github.com/Bhawana0218/AcademiaX.git
cd AcademiaX
```
### 2 . Install BAckend Dependencies

```bash
cd backend
npm install
```

### 3.  Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Setup
```bash
cd backend
cp .env.example .env

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academiax
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:3000
```

### 5. Frontend Configuration

```bash
cd ../frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 6. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 2. Option - 2 

### 1. Run the full application

```bash
# Clone repo
git clone https://github.com/Bhawana0218/AcademiaX.git
cd AcademiaX

# Run everything
docker compose up --build
check on :-  http://localhost:5173
```

#### 🔸 Backend is working:
Connected to MongoDB 
Server running on port 5000 
#### 🔸 Frontend is working:
nginx started 

### 2. Stop containers

```bash
docker compose down
```

### 7. Access the Application
🌐 Frontend: http://localhost:3000
🔌 Backend API: http://localhost:5000
📊 API Health Check: http://localhost:5000/api/health
📚 MongoDB: mongodb://localhost:27017/academiax

## ⚡ Performance Optimizations
### Backend Optimizations
```bash
Database Indexing: Implemented strategic indexing on frequently queried fields to improve read performance and reduce query latency.
Pagination: Server-side pagination using limit/skip to efficiently handle large datasets.
Query Optimization: Optimized database queries with selective field projection to minimize payload size and improve response time.
Caching Strategy: Designed with Redis-ready architecture to support high-performance response caching.
Compression: Enabled Gzip compression to reduce response payload size and improve network efficiency.
Connection Pooling: Configured MongoDB connection pooling to efficiently manage database connections and improve scalability.
```

### Frontend Optimizations
```bash
Code Splitting: Implemented route-based lazy loading to reduce initial bundle size and improve load time.
Bundle Optimization: Utilized tree shaking and production minification to eliminate unused code and optimize bundle size.
Image Optimization: Applied responsive image handling with lazy loading to improve rendering performance.
Memoization: Used React.memo, useMemo, and useCallback to prevent unnecessary re-renders and optimize expensive computations.
Input Debouncing: Implemented debounced search inputs (300ms) to reduce unnecessary API calls and improve UX.
Virtual Scrolling: Architecture prepared for virtualized rendering to efficiently handle large lists and datasets.
```


## 📞 Support & Contact
Need help or have questions?
📧 Email: bhawana1205bisht1802@gmail.com
📱 Phone: 7078807457
📚 Documentation: View docs


## Technical Excellence
🏆 Clean Architecture: Separation of concerns, SOLID principles
🏆 Scalability: Ready for horizontal scaling
🏆 Security: Industry-standard security practices
🏆 Performance: Optimized for speed and efficiency
🏆 Maintainability: Well-documented, modular code

## Future Roadmap
Real-time collaboration (WebSockets)
Mobile app (React Native)
Advanced analytics (AI-powered insights)
Multi-language support (i18n)
Email notifications
Calendar integration
Parent portal
Attendance tracking
Grade reports
Payment integration

<div align="center">

Made with ❤️ using the MERN Stack
⭐ Star this repo if you find it helpful!
⬆ Back to Top
</div>
```
