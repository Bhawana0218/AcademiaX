import React, { useEffect, useState } from 'react'
import {
  Users,
  CheckSquare,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { dashboardAPI } from '../../../services/api'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const TeacherDashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [taskStatusData, setTaskStatusData] = useState([])
  const [studentGradeData, setStudentGradeData] = useState([])
  const [completionTrend, setCompletionTrend] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  const COLORS = {
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#8b5cf6',
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [
        statsRes,
        taskStatusRes,
        studentGradeRes,
        trendRes,
        performersRes,
        deadlinesRes,
        activityRes,
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTaskStatusDistribution(),
        dashboardAPI.getStudentGradeDistribution(),
        dashboardAPI.getTaskCompletionTrend(),
        dashboardAPI.getTopPerformers(),
        dashboardAPI.getUpcomingDeadlines(),
        dashboardAPI.getActivityFeed({ limit: 10 }),
      ])

      setStats(statsRes.data.data.overview)
      setTaskStatusData(taskStatusRes.data.data)
      setStudentGradeData(studentGradeRes.data.data)
      setCompletionTrend(trendRes.data.data)
      setTopPerformers(performersRes.data.data)
      setUpcomingDeadlines(deadlinesRes.data.data)
      setRecentActivity(activityRes.data.data.activities)

    

    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
  return (
    <div className="space-y-6 bg-slate-50/40 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2"></div>
        <div className="h-4 w-72 bg-slate-100 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="h-4 w-1/2 bg-slate-200 rounded mb-3"></div>
            <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

return (
  <div className="space-y-6 bg-slate-50/40 min-h-screen p-4 sm:p-6 lg:p-8">
    {/* Page Header */}
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
      <p className="text-sm text-slate-500 mt-1 font-medium">Welcome back, {user?.name}! Here's what's happening today.</p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              {stats?.totalStudents || 0}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
            <Users className="w-6 h-6 text-blue-900" />
          </div>
        </div>
      </div>


      <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              {stats?.totalTasks || 0}
            </p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors duration-300">
            <CheckSquare className="w-6 h-6 text-slate-800" />
          </div>
        </div>
      </div>

      <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Tasks</p>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              {stats?.completedTasks || 0}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors duration-300">
            <TrendingUp className="w-6 h-6 text-emerald-800" />
          </div>
        </div>
      </div>

      <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              {stats?.completionRate?.toFixed(1) || 0}%
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors duration-300">
            <Activity className="w-6 h-6 text-amber-800" />
          </div>
        </div>
      </div>
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Status Distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
          <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
          Task Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taskStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {taskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || COLORS.primary} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Student Grade Distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
          <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
          Students by Grade
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentGradeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="grade" tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
            />
            <Bar dataKey="count" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

{/* new code */}
  <div className="bg-white border rounded-2xl p-6 shadow-sm">
  <h3 className="text-lg font-semibold mb-4">Quick Task Summary</h3>

  <div className="flex gap-6">
    <div>
      <p className="text-sm text-slate-500">Completed</p>
      <p className="text-xl font-bold text-green-600">
        {stats?.completedTasks || 0}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">Pending</p>
      <p className="text-xl font-bold text-amber-600">
        {(stats?.totalTasks || 0) - (stats?.completedTasks || 0)}
      </p>
    </div>
  </div>
</div>

    {/* Task Completion Trend */}
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
        <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
        Task Completion Trend (Last 6 Months)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={completionTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{fill: '#64748b', fontSize: 12}} />
          <YAxis tick={{fill: '#64748b', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ color: '#0f172a', fontWeight: 600 }}
          />
          <Line type="monotone" dataKey="completed" stroke={COLORS.success} strokeWidth={3} dot={{r: 4, fill: '#ffffff', strokeWidth: 2}} activeDot={{r: 6, stroke: '#0f172a', strokeWidth: 2}} />
          <Line type="monotone" dataKey="created" stroke={COLORS.primary} strokeWidth={3} dot={{r: 4, fill: '#ffffff', strokeWidth: 2}} activeDot={{r: 6, stroke: '#0f172a', strokeWidth: 2}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)
}
export default TeacherDashboard;
