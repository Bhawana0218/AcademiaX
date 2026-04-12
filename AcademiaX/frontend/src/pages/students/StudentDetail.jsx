import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  CheckSquare,
  Clock,
  Plus,
  Edit,
  Loader2,
} from 'lucide-react'
import { studentsAPI, tasksAPI } from '../../services/api'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [tasks, setTasks] = useState([])
  const [taskStats, setTaskStats] = useState({})
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await studentsAPI.getStudent(id)
      
      const { student, tasks = [], taskStats = {} } = response.data.data || {}
      setStudent(student)
      setTasks(tasks)
      setTaskStats(taskStats)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.response?.data?.message || 'Failed to fetch student data')
      toast.error('Failed to load student information')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = useCallback((task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }, [])

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }, [])

  const StatusBadge = useMemo(() => {
    const config = {
      pending: { className: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Pending' },
      in_progress: { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress' },
      completed: { className: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Completed' },
      overdue: { className: 'bg-red-100 text-red-800 border-red-200', label: 'Overdue' },
    }
    return ({ status }) => {
      const { className, label } = config[status] || config.pending
      return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${className}`}>
          {label}
        </span>
      )
    }
  }, [])

  const PriorityBadge = useMemo(() => {
    const config = {
      low: { className: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Low' },
      medium: { className: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Medium' },
      high: { className: 'bg-red-100 text-red-800 border-red-200', label: 'High' },
    }
    return ({ priority }) => {
      const { className, label } = config[priority] || config.medium
      return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${className}`}>
          {label}
        </span>
      )
    }
  }, [])

  const StatCard = ({ label, value, colorClass }) => (
    <div className="text-center group cursor-default">
      <p className={`text-2xl font-bold ${colorClass} group-hover:opacity-90 transition-opacity`}>
        {value}
      </p>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
        {label}
      </p>
    </div>
  )

  const InfoRow = ({ icon: Icon, label, value, subtext }) => (
    <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group">
      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-4 h-4 text-blue-900" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-800">
          {value}
          {subtext && <span className="text-slate-500 font-normal"> {subtext}</span>}
        </p>
      </div>
    </div>
  )

  // Loading State
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 text-blue-900 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading student data...</p>
      </div>
    )
  }

  // Error State
  if (error || !student) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {error ? 'Error Loading Data' : 'Student Not Found'}
          </h3>
          <p className="text-slate-600 mb-6">
            {error || 'The requested student profile could not be found.'}
          </p>
          <Link to="/students">
            <Button icon={ArrowLeft} className="bg-blue-900 text-white hover:bg-blue-800">
              Back to Students
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Student Profile Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/students/${id}/edit`}>
            <Button 
              variant="outline" 
              icon={Edit}
              className="border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900 hover:bg-blue-50"
            >
              Edit
            </Button>
          </Link>
          <Link to={`/tasks/create?student=${id}`}>
            <Button icon={Plus} className="bg-blue-900 text-white hover:bg-blue-800 shadow-sm">
              Assign Task
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Card */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header linear */}
            <div className="h-24 bg-linear-to-r from-blue-950 via-slate-900 to-blue-900" />
            
            <div className="px-6 pb-6 -mt-12">
              {/* Avatar */}
              <div className="text-center">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white">
                  <span className="text-3xl font-bold text-blue-900">
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-sm text-slate-500 font-medium">{student.email}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 my-6 py-4 bg-slate-50 rounded-xl border border-slate-100">
                <StatCard label="Total" value={taskStats.total || 0} colorClass="text-slate-900" />
                <div className="w-px h-10 bg-slate-200" />
                <StatCard label="Completed" value={taskStats.completed || 0} colorClass="text-emerald-600" />
                <div className="w-px h-10 bg-slate-200" />
                <StatCard label="Pending" value={taskStats.pending || 0} colorClass="text-amber-600" />
              </div>

              {/* Details */}
              <div className="space-y-1 border-t border-slate-100 pt-4">
                <InfoRow icon={GraduationCap} label="Grade" value={`Grade ${student.grade}`} subtext={student.section} />
                <InfoRow icon={Calendar} label="Age" value={`${student.age}`} subtext="years old" />
                <InfoRow icon={User} label="Gender" value={student.gender?.capitalize?.() || student.gender} />
                {student.phone && <InfoRow icon={Phone} label="Phone" value={student.phone} />}
                <InfoRow icon={Mail} label="Email" value={student.email} />
                {student.address?.city && (
                  <InfoRow 
                    icon={MapPin} 
                    label="Location" 
                    value={student.address.city} 
                    subtext={student.address.state && `, ${student.address.state}`} 
                  />
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Tasks Section */}
        <main className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Assigned Tasks</h3>
              <Link to={`/tasks/create?student=${id}`}>
                <Button size="sm" icon={Plus} variant="primary">
                  New Task
                </Button>
              </Link>
            </div>

            <div className="p-5">
              {tasks.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No tasks assigned yet</p>
                  <p className="text-sm text-slate-400 mt-1">Get started by creating a new task</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <article
                      key={task._id}
                      onClick={() => handleTaskClick(task)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
                      tabIndex={0}
                      role="button"
                      className="p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <StatusBadge status={task.status} />
                              <PriorityBadge priority={task.priority} />
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md">
                              <Calendar className="w-3 h-3 mr-1.5" />
                              Due: {formatDate(task.dueDate)}
                            </span>
                            <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md">
                              <Clock className="w-3 h-3 mr-1.5" />
                              Created: {formatDate(task.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-5">
            {/* Task Header */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {selectedTask.title}
              </h4>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <StatusBadge status={selectedTask.status} />
                <PriorityBadge priority={selectedTask.priority} />
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedTask.description}
              </p>
            </div>

            {/* Task Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Due Date', value: formatDate(selectedTask.dueDate) },
                { label: 'Created By', value: selectedTask.assignedBy?.name || 'Unknown' },
                { label: 'Category', value: selectedTask.category?.capitalize?.() || selectedTask.category },
                { label: 'Est. Time', value: `${selectedTask.estimatedTime} min` },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-medium text-slate-400 uppercase">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Submission */}
            {selectedTask.submission?.submittedAt && (
              <div className="border-t border-slate-200 pt-4 bg-blue-50/50 p-4 rounded-xl border">
                <h5 className="text-sm font-bold text-blue-900 mb-2">Submission</h5>
                <p className="text-sm text-slate-700 mb-2 leading-relaxed">
                  {selectedTask.submission.content}
                </p>
                <p className="text-xs text-slate-500">
                  Submitted on {formatDate(selectedTask.submission.submittedAt)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowTaskModal(false)}
              >
                Close
              </Button>
              <Link to={`/tasks/${selectedTask._id}`}>
                <Button className="bg-blue-900 text-white hover:bg-blue-800">
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// Helper to capitalize first letter (safe fallback)
if (!String.prototype.capitalize) {
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  }
}

export default StudentDetail




