import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'

const Layout = () => {
  const { user } = useAuthStore()

  return (

    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden selection:bg-blue-200 selection:text-[#0B132B]">
  {/* Ambient Background Depth Layers */}
  <div className="absolute top-0 left-0 w-full h-full bg-[radial-linear(circle_at_top_right,var(--tw-linear-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-150 h-150 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute top-1/4 left-1/4 w-100 h-100 bg-slate-200/30 rounded-full blur-2xl pointer-events-none" />
  
  <div className="flex relative z-10 min-h-screen">
    {/* Sidebar Container - Premium Navy Theme */}
    <aside className="shrink-0 w-64 lg:w-72 bg-[#0B132B] border-r border-blue-900/30 shadow-[8px_0_40px_-12px_rgba(11,19,43,0.5)] flex flex-col relative transition-all duration-500 hover:shadow-[12px_0_50px_-10px_rgba(11,19,43,0.6)] group">
      {/* Top linear Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-90" />
      
      {/* Subtle Inner Glow Effect */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-800/50 scrollbar-track-transparent">
        <Sidebar />
      </div>
      
      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-700/50 to-transparent opacity-60" />
    </aside>
    
    {/* Main Content Wrapper */}
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Sticky Header with Premium Glass Effect */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(11,19,43,0.06)] transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-b from-white/90 to-white/70 pointer-events-none" />
        <div className="relative z-10">
          <Header user={user} />
        </div>
      </header>
      
      {/* Page Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-400 mx-auto">
        <div className="relative bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(11,19,43,0.1)] border border-slate-100/80 p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_-12px_rgba(11,19,43,0.18)] hover:-translate-y-0.5 hover:border-blue-100/60 group">
          {/* Premium Corner Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50/80 to-transparent rounded-bl-3xl opacity-70 pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-slate-50/60 to-transparent rounded-tr-3xl opacity-50 pointer-events-none" />
          
          {/* Subtle Top Border linear */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-200/60 to-transparent opacity-60" />
          
          <Outlet />
          
          {/* Bottom Fade Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200/40 to-transparent opacity-40" />
        </div>
      </main>
      
      {/* Subtle Footer linear Bar */}
      <div className="h-px bg-linear-to-r from-transparent via-blue-200/30 to-transparent opacity-50" />
    </div>
  </div>
  
  {/* Interactive Cursor Glow Effect (Optional Enhancement) */}
  <div className="fixed inset-0 pointer-events-none z-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
    <div className="absolute w-150 h-150 bg-blue-900/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply" 
         style={{ background: 'radial-linear(circle, rgba(11,19,43,0.08) 0%, transparent 70%)' }} />
  </div>
</div>
  )
}

export default Layout
