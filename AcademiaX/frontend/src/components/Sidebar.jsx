import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  User, 
  Settings, 
  LogOut,
  GraduationCap,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout, isAdmin } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Students',
      href: '/students',
      icon: Users,
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
    ...(isAdmin() ? [{
      name: 'Users',
      href: '/users',
      icon: GraduationCap,
    }] : []),
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ]

  return (
  
    <div className="w-64 bg-[#0B132B] border-r border-blue-900/20 min-h-screen flex flex-col shadow-[4px_0_32px_-12px_rgba(0,0,0,0.5)] overflow-hidden selection:bg-blue-200 selection:text-[#0B132B]">
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="p-5 border-b border-blue-900/20">
    <img src="./AcademiaX-Logo.png" alt="AcademiaX Logo" className='w-48 h-36 '/>
      <div className="flex flex-col items-center group cursor-default">
          <h2 className="text-lg font-bold text-white tracking-tight">AcademiaX</h2>
          <p className="text-xs text-blue-200/60 font-medium">School Management</p>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto pr-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={`group relative flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
              isActive 
                ? 'bg-blue-600/15 text-white ring-1 ring-blue-500/30 shadow-[0_4px_12px_-4px_rgba(59,130,246,0.25)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-blue-100 hover:translate-x-0.5 border border-transparent hover:border-blue-800/30'
            }`}
          >
            {/* Active State Indicator Pill */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            )}
            
            <item.icon className={`w-5 h-5 mr-3 transition-all duration-200 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-300'}`} />
            {item.name}
          </NavLink>
        )
      })}
    </nav>

    {/* User info and logout */}
    <div className="p-4 border-t border-blue-900/20 bg-[#080E22]/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="shrink-0 relative">
          <div className="w-10 h-10 bg-linear-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center ring-2 ring-blue-900/50">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          {/* Active Status Dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-[3px] border-[#0B132B] rounded-full shadow-sm"></span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-blue-200/60 capitalize">{user?.role}</p>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-red-300 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/40 active:scale-[0.98] transition-all duration-200"
      >
        <LogOut className="w-4 h-4 transition-transform duration-200" />
        Logout
      </button>
    </div>
  </div>
</div>
  )
}

export default Sidebar
