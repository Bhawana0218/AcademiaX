import React, { useEffect, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { dashboardAPI } from '../services/api'
import toast from 'react-hot-toast'

const Header = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  // REAL DATA STATE
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true)

      const res = await dashboardAPI.getActivityFeed({ limit: 10 })

      setNotifications(res?.data?.data?.activities || [])

    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setLoadingNotifications(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="bg-[#00072D] border-b border-blue-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* SEARCH */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-400" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-blue-200 bg-white pl-10 pr-3 py-2 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Search students, tasks..."
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200 relative"
              >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* DROPDOWN */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-blue-100 z-50">

                  {/* HEADER */}
                  <div className="p-4 border-b border-blue-100">
                    <h3 className="text-sm font-semibold text-blue-950">
                      Notifications
                    </h3>
                  </div>

                  {/* BODY */}
                  <div className="max-h-96 overflow-y-auto space-y-2 p-3">

                    {/* LOADING */}
                    {loadingNotifications ? (
                      <div className="p-3 text-sm text-slate-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-3 text-sm text-slate-500">
                        No notifications found
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id || n.id}
                          className={`p-3 rounded-xl border transition-all duration-200 hover:bg-blue-50 ${
                            !n.read
                              ? 'bg-blue-50/60 border-blue-100'
                              : 'bg-white border-transparent'
                          }`}
                        >
                          <div className="flex items-start">

                            {/* DOT (same style as activity UI) */}
                            <div
                              className={`w-2 h-2 rounded-full mt-2 mr-3 shrink-0 ${
                                n.type === 'task'
                                  ? 'bg-blue-900 ring-4 ring-blue-100'
                                  : n.type === 'student'
                                  ? 'bg-emerald-700 ring-4 ring-emerald-100'
                                  : 'bg-slate-400 ring-4 ring-slate-100'
                              }`}
                            ></div>

                            {/* CONTENT */}
                            <div className="flex-1 min-w-0">

                              <p className="text-sm font-semibold text-blue-950 truncate">
                                {n.title || 'Activity'}
                              </p>

                              <p className="text-sm text-slate-600 mt-1">
                                {n.description || n.message}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {new Date(n.createdAt || n.timestamp).toLocaleString()}
                              </p>
                            </div>

                            {/* UNREAD DOT */}
                            {!n.read && (
                              <div className="ml-2 mt-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}

                          </div>
                        </div>
                      ))
                    )}

                  </div>

                  {/* FOOTER */}
                  <div className="p-3 border-t border-blue-100">
                    <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                      View all notifications
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* USER */}
            <div className="flex items-center">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-white/80 capitalize">
                  {user?.role}
                </p>
              </div>

              <div className="ml-3 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                <span className="text-sm font-bold text-blue-800">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}

export default Header