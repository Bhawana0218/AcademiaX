import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (

      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-blue-200 selection:text-[#0B132B]">
  {/* Ambient Background Glows for Depth */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/15 rounded-full blur-[100px] pointer-events-none"></div>

  <div className="relative z-10 w-full max-w-md">
    {/* Header Section */}
    <div className="text-center mb-10 space-y-3">
      <div className="bg-white/80 inline-flex items-center justify-center w-[30%] h-28 overflow-hidden backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/30 hover:scale-105 hover:bg-white hover:border-white/20 transition-all duration-300 cursor-pointer group">
         <img
    src="../AcademiaX-Logo.png"
    alt="cover"
    className="w-full h-full object-cover -p-8"
  />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
        School Management System
      </h1>
      <p className="text-sm font-medium text-blue-200/60 tracking-wide">
        Manage students, tasks & operations seamlessly
      </p>
    </div>
    
    {/* Main Content Card */}
    <div className="bg-white rounded-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4)] border border-gray-100 p-8 relative overflow-hidden transform transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(10,19,43,0.5)] hover:-translate-y-1">
      {/* Top Navy-Blue Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#0B132B] via-blue-700 to-[#0B132B]"></div>
      
      {/* Subtle Corner Details */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-100 rounded-full opacity-50"></div>

      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  </div>
</div>
  )
}

export default AuthLayout
