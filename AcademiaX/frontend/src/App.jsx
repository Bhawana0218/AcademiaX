import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuthStore } from './store/authStore'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Main pages
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard'
import TeacherDashboard from './pages/Dashboard/Teacher/TeacherDashboard'
import Students from './pages/students/Students'
import StudentDetail from './pages/students/StudentDetail'
import CreateStudent from './pages/students/CreateStudent'
import Tasks from './pages/tasks/Tasks'
import TaskDetail from './pages/tasks/TaskDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

// Protected route component
import ProtectedRoute from './components/ProtectedRoute'
import CreateTask from './pages/tasks/CreateTask'
import UsersPage from './pages/Users/User'
import Dashboard from './pages/Dashboard/page'

function App() {

 useEffect(() => {
    // SET TITLE
    document.title = "AcademiaX - School Management System"

    // SET FAVICON
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link")

    link.type = "image/png"
    link.rel = "icon"
    link.href = "../AcademiaX-LogoTitle.png"

    document.head.appendChild(link)
  }, [])



  const { isAuthenticated, initializeAuth} = useAuthStore()
   //  user 
  const { user } = useAuthStore()

   useEffect(() => {
    initializeAuth()
  }, [])

  const DashboardRedirect = () => {
  if (user?.role === 'admin') return <AdminDashboard />
  if (user?.role === 'teacher') return <TeacherDashboard />
  
  return <Navigate to="/auth/login" />
}

  return (
    <>
      <Helmet>
        <title>School Management System</title>
        <meta name="description" content="AcademiaX - School Management System" />
      </Helmet>

      <Routes>
        {/* Public auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="dashboard" element={<Dashboard />} />
          
          
          {/* Student routes */}
          <Route path="students">
            <Route index element={<Students />} />
             <Route path="create" element={<CreateStudent />} />
            <Route path=":id" element={<StudentDetail />} />
          </Route>
          
          {/* Task routes */}
          <Route path="tasks">
            <Route index element={<Tasks />} />
             <Route path="create" element={<CreateTask />} />
            <Route path=":id" element={<TaskDetail />} />
          </Route>

          <Route path="/users" element={<UsersPage />} />
          
          {/* User routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App
