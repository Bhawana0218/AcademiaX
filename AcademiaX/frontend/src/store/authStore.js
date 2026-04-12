import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'

 const token = localStorage.getItem('token')

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,

     

      token,
      isAuthenticated: !!token,
      isLoading: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(credentials)
          const { user, token } = response.data.data
          
          localStorage.setItem('token', token)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            // error: error.response?.data?.error || 'Login failed'
            error: error.response?.data || error.message 
          }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.register(userData)
          const { user, token } = response.data.data
          
          localStorage.setItem('token', token)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            // error: error.response?.data?.error || 'Registration failed' 
            error: error.response?.data || error.message
          }
        }
      },

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API call failed:', error)
        }
        
        // localStorage.removeItem('token')
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      getProfile: async () => {
        try {
          const response = await authAPI.getMe()
          const { user } = response.data.data
          
          set({ user })
          return { success: true }
        } catch (error) {
          // If profile fetch fails, user might not be authenticated
          if (error.response?.status === 401) {
            get().logout()
          }
          return { success: false }
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.updateProfile(userData)
          const { user } = response.data.data
          
          set({ 
            user,
            isLoading: false,
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Profile update failed' 
          }
        }
      },

      changePassword: async (passwordData) => {
        set({ isLoading: true })
        try {
          await authAPI.changePassword(passwordData)
          
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Password change failed' 
          }
        }
      },

      refreshToken: async () => {
        try {
          const response = await authAPI.refreshToken()
          const { token } = response.data.data
          
          localStorage.setItem('token', token)
          
          set({ token })
          return { success: true }
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          return { success: false }
        }
      },

      // Initialize auth state from localStorage
      initializeAuth: async () => {
        const token = localStorage.getItem('token')
        if (token) {
          set({ token, isAuthenticated: true })
          
          // Verify token by fetching user profile
          const result = await get().getProfile()
          if (!result.success) {
            // Token is invalid, clear auth state
            get().logout()
          }
        }
      },

      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const { user } = get()
        return roles.includes(user?.role)
      },

      // Check if user is admin
      isAdmin: () => {
        return get().hasRole('admin')
      },

      // Check if user is teacher
      isTeacher: () => {
        return get().hasRole('teacher')
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export { useAuthStore }
