import axios from 'axios'
import toast from 'react-hot-toast'

// Create base axios instance
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/auth/login'
          toast.error('Session expired. Please login again.')
          break
        case 403:
          toast.error('Access denied. You don\'t have permission to perform this action.')
          break
        case 404:
          toast.error('Resource not found.')
          break
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          // Show server-provided error message if available
          const errorMessage = data?.error || data?.message || 'An error occurred'
          toast.error(errorMessage)
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other errors
      toast.error('An unexpected error occurred.')
    }

    return Promise.reject(error)
  }
)

// API methods for different resources
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
}

export const studentsAPI = {
  getStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getStudentStats: () => api.get('/students/stats/overview'),
  exportStudents: () => api.get('/students/export', { responseType: 'blob' }),
}

export const tasksAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  submitTask: (id, submissionData) => api.post(`/tasks/${id}/submit`, submissionData),
  gradeTask: (id, gradeData) => api.put(`/tasks/${id}/grade`, gradeData),
  getTaskStats: () => api.get('/tasks/stats/overview'),
  getStudentTasks: (studentId, params) => api.get(`/tasks/student/${studentId}`, { params }),
  exportTasks: () => api.get('/tasks/export', { responseType: 'blob' }),
}

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getTaskStatusDistribution: () => api.get('/dashboard/tasks/status'),
  getTaskPriorityDistribution: () => api.get('/dashboard/tasks/priority'),
  getStudentGradeDistribution: () => api.get('/dashboard/students/grades'),
  getTaskCompletionTrend: () => api.get('/dashboard/tasks/trend'),
  getTopPerformers: () => api.get('/dashboard/students/top-performers'),
  getUpcomingDeadlines: () => api.get('/dashboard/tasks/upcoming-deadlines'),
  getActivityFeed: (params) => api.get('/dashboard/activity', { params }),
}


export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),

  createUser: (userData) => api.post('/users', userData),

  updateUser: (id, userData) =>
    api.put(`/users/${id}`, userData),

  deleteUser: (id) => api.delete(`/users/${id}`),

  resetUserPassword: (id, passwordData) =>
    api.put(`/users/${id}/reset-password`, passwordData),

  getUserStats: () => api.get('/users/stats'),
}

export default api
