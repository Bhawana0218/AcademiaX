# School Management System

A production-ready School Management System built with modern technologies and best practices. This comprehensive SaaS application provides efficient student and task management for educational institutions.

## Features

### Core Functionality
- **Authentication System**: Secure JWT-based authentication with role-based access control
- **Dashboard**: Real-time analytics with interactive charts and statistics
- **Student Management**: Complete CRUD operations with advanced filtering and search
- **Task Management**: Assign, track, and grade student tasks with detailed reporting
- **User Management**: Admin panel for managing users and permissions

### Advanced Features
- **Dark Mode**: Full dark/light theme support with smooth transitions
- **Export Functionality**: CSV export for students and tasks data
- **Real-time Notifications**: Activity feed and notification system
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Visualization**: Interactive charts using Recharts
- **Search & Filtering**: Advanced search with multiple filter options
- **Pagination**: Efficient data handling with server-side pagination

## Tech Stack

### Backend
- **Node.js** + **Express.js** (v5)
- **MongoDB** + **Mongoose** ODM
- **JWT Authentication** with bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting
- **Logging**: morgan

### Frontend
- **React** (v18) with **Vite**
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Zustand** for state management
- **React Hook Form** + **Zod** for forms
- **Axios** for API calls
- **Recharts** for data visualization
- **React Hot Toast** for notifications

## Architecture

### Backend Structure
```
backend/
|-- controllers/     # Request handlers
|-- models/         # Database models
|-- routes/         # API routes
|-- middleware/     # Custom middleware
|-- utils/          # Utility functions
|-- config/         # Configuration files
|-- server.js       # Server entry point
```

### Frontend Structure
```
frontend/
|-- src/
|   |-- components/  # Reusable components
|   |-- pages/       # Page components
|   |-- layouts/     # Layout components
|   |-- services/    # API services
|   |-- store/       # State management
|   |-- hooks/       # Custom hooks
|   |-- utils/       # Utility functions
```

school-management-system/
├── backend/                 # Node.js API
│   ├── controllers/         # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
├── frontend/               # React application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── layouts/        # Layout components
│       ├── services/       # API services
│       └── store/          # State management
├── README.md              # Complete documentation
├── POSTMAN_COLLECTION.md  # API testing guide
└── DEPLOYMENT_GUIDE.md    # Production deployment


## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd school-management-system
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
# Create .env file if needed
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
mongod
```

6. **Run the application**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/health

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - Logout

### Students
- `GET /api/students` - Get all students (with pagination, search, filters)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats/overview` - Get student statistics
- `GET /api/students/export` - Export students to CSV

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination, search, filters)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/submit` - Submit task
- `PUT /api/tasks/:id/grade` - Grade task
- `GET /api/tasks/stats/overview` - Get task statistics
- `GET /api/tasks/student/:studentId` - Get student tasks
- `GET /api/tasks/export` - Export tasks to CSV

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/tasks/status` - Task status distribution
- `GET /api/dashboard/tasks/priority` - Task priority distribution
- `GET /api/dashboard/students/grades` - Student grade distribution
- `GET /api/dashboard/tasks/trend` - Task completion trend
- `GET /api/dashboard/students/top-performers` - Top performing students
- `GET /api/dashboard/tasks/upcoming-deadlines` - Upcoming deadlines
- `GET /api/dashboard/activity` - Recent activity feed

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/reset-password` - Reset user password
- `GET /api/users/stats` - Get user statistics

## Test Credentials

### Admin Account
- **Email**: admin@sms.com
- **Password**: admin123
- **Role**: Admin

### Teacher Account
- **Email**: teacher@sms.com
- **Password**: teacher123
- **Role**: Teacher

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/teacher),
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  studentId: String (unique),
  grade: String (1-12),
  section: String,
  dateOfBirth: Date,
  gender: String,
  phone: String,
  address: Object,
  parentInfo: Object,
  enrollmentDate: Date,
  isActive: Boolean,
  avatar: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  assignedTo: ObjectId (Student),
  assignedBy: ObjectId (User),
  status: String (pending/in_progress/completed/overdue),
  priority: String (low/medium/high),
  category: String (assignment/project/quiz/exam/homework/other),
  dueDate: Date,
  estimatedTime: Number,
  actualTime: Number,
  attachments: Array,
  submission: Object,
  tags: Array,
  isActive: Boolean,
  completedAt: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevent brute force attacks
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive input validation and sanitization
- **Role-Based Access**: Granular permission system
- **Helmet.js**: Security headers configuration

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexing
- **Pagination**: Server-side pagination for large datasets
- **Caching**: Response caching for frequently accessed data
- **Lazy Loading**: Component-level code splitting
- **Image Optimization**: Responsive image handling
- **Bundle Optimization**: Optimized build configuration

## Deployment

### Production Build

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Start Backend in Production**
```bash
cd backend
NODE_ENV=production npm start
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety (optional)
- **Jest**: Unit testing (optional)
- **Husky**: Git hooks for code quality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Email: support@sms.com
- Phone: +1 (555) 123-4567
- Documentation: [Link to documentation]

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Complete authentication system
- Student and task management
- Dashboard with analytics
- Dark mode support
- Export functionality
- Responsive design
- Production-ready architecture
#   A c a d e m i a X  
 