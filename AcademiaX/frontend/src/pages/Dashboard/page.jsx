import React from 'react'
import { useAuthStore } from '../../store/authStore'
import AdminDashboard from './Admin/AdminDashboard';
import TeacherDashboard from './Teacher/TeacherDashboard';

const Dashboard = () => {
  const { user } = useAuthStore()

  if (!user) return null

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'teacher':
      return <TeacherDashboard />
    default:
      return <div>Unauthorized</div>
  }
}

export default Dashboard;