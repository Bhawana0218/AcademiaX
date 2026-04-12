import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  AlertTriangle,
} from 'lucide-react'
import { tasksAPI } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const Tasks = () => {
  const { user } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({})

  const [filters, setFilters] = useState({
  search: searchParams.get('search') || '',
  status: searchParams.get('status') || '',
  priority: searchParams.get('priority') || '',
  category: searchParams.get('category') || '',
  assignedTo: searchParams.get('assignedTo') || '',
  student: searchParams.get('student') || '',   
  page: parseInt(searchParams.get('page')) || 1,
  limit: 10,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [filters])

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
  if (filters[key]) {
    if (key === 'student') {
      params.append('assignedTo', filters[key]) 
    } else {
      params.append(key, filters[key])
    }
  }
})
    setSearchParams(params)
  }, [filters, setSearchParams])

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const cleanFilters = {}

   Object.keys(filters).forEach(key => {
  if (filters[key]) {
    if (key === 'student') {
      cleanFilters['assignedTo'] = filters[key]
    } else {
      cleanFilters[key] = filters[key]
    }
  }
})

const response = await tasksAPI.getTasks(cleanFilters)

      setTasks(response.data.data.tasks)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleDeleteClick = (task) => {
    setSelectedTask(task)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await tasksAPI.deleteTask(selectedTask._id)
      toast.success('Task deleted successfully')
      setShowDeleteModal(false)
      setSelectedTask(null)
      fetchTasks()
    } catch (error) {
      toast.error('Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await tasksAPI.exportTasks()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'tasks_export.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Tasks exported successfully')
    } catch (error) {
      toast.error('Failed to export tasks')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'badge-warning', text: 'Pending' },
      in_progress: { class: 'badge-info', text: 'In Progress' },
      completed: { class: 'badge-success', text: 'Completed' },
      overdue: { class: 'badge-danger', text: 'Overdue' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`badge ${config.class}`}>{config.text}</span>
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { class: 'badge-info', text: 'Low' },
      medium: { class: 'badge-warning', text: 'Medium' },
      high: { class: 'badge-danger', text: 'High' },
    }
    const config = priorityConfig[priority] || priorityConfig.medium
    return <span className={`badge ${config.class}`}>{config.text}</span>
  }

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed'
  }

  return (

    <div className="space-y-6">
  {/* Page Header */}
  <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Tasks</h1>
        <p className="text-sm text-blue-600 mt-1">Manage and track all tasks</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={handleExport}
          icon={Download}
          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900"
        >
          Export
        </Button>
        <Link to={`/tasks/create${filters.student ? `?student=${filters.student}` : ''}`}>
          <Button icon={Plus} className="bg-blue-900 hover:bg-blue-800 text-white shadow-sm">
            Create Task
          </Button>
        </Link>
      </div>
    </div>
  </div>

  {/* Filters */}
  <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2">
        <Input
          placeholder="Search tasks..."
          icon={Search}
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
      <div>
        <select
          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div>
        <select
          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <select
          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="assignment">Assignment</option>
          <option value="project">Project</option>
          <option value="quiz">Quiz</option>
          <option value="exam">Exam</option>
          <option value="homework">Homework</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  </div>

  {/* Tasks Table */}
  <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-blue-50 border-b border-blue-200">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Task</th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Assigned To</th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Category</th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Due Date</th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Priority</th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Status</th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-blue-800">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="animate-pulse rounded-md bg-blue-200 h-4 w-32 mb-2"></div>
                    <div className="animate-pulse rounded-md bg-blue-200 h-4 w-48"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="animate-pulse rounded-md bg-blue-200 h-4 w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="animate-pulse rounded-md bg-blue-200 h-4 w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="animate-pulse rounded-md bg-blue-200 h-4 w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="animate-pulse rounded-md bg-blue-200 h-4 w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="animate-pulse rounded-md bg-blue-200 h-4 w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse rounded-md bg-blue-200 h-4 w-8"></div>
                    <div className="animate-pulse rounded-md bg-blue-200 h-4 w-8"></div>
                  </div>
                </td>
              </tr>
            ))
          ) : tasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <CheckSquare className="w-12 h-12 text-blue-300 mb-4" />
                  <p className="text-lg font-semibold text-blue-800">No tasks found</p>
                  <p className="text-sm text-blue-600 mt-1">Try adjusting your filters or create a new task</p>
                </div>
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-blue-950">{task.title}</div>
                    <div className="text-sm text-blue-600 mt-0.5 line-clamp-2">
                      {task.description?.length > 50 
                        ? `${task.description.substring(0, 50)}...` 
                        : task.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">
                        {task.assignedTo?.firstName} {task.assignedTo?.lastName}
                      </div>
                      <div className="text-xs text-blue-500">
                        {task.assignedTo?.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-blue-800 capitalize">
                    {task.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      {isOverdue(task.dueDate, task.status) && (
                        <div className="flex items-center text-xs font-semibold text-red-600 mt-0.5">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Overdue
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getPriorityBadge(task.priority)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(task.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link to={`/tasks/${task._id}`}>
                      <Button variant="ghost" size="sm" icon={Eye} className="text-blue-700 hover:bg-blue-100 hover:text-blue-900" />
                    </Link>
                    <Link to={`/tasks/${task._id}/edit`}>
                      <Button variant="ghost" size="sm" icon={Edit} className="text-blue-700 hover:bg-blue-100 hover:text-blue-900" />
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'teacher') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteClick(task)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {pagination.pages > 1 && (
      <div className="px-6 py-4 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="text-sm font-medium text-blue-700">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={ChevronLeft}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex items-center space-x-1">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  pagination.page === i + 1
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-blue-700 hover:bg-blue-100 border border-transparent hover:border-blue-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ChevronRight}
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    )}
  </div>

  {/* Delete Modal */}
  <Modal
    isOpen={showDeleteModal}
    onClose={() => setShowDeleteModal(false)}
    title="Delete Task"
    size="sm"
  >
    <div className="space-y-4 p-2">
      <div className="text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-blue-950 mb-2">
          Delete "{selectedTask?.title}"?
        </h3>
        <p className="text-sm text-blue-600 max-w-sm mx-auto">
          This action cannot be undone. The task and all associated data will be permanently deleted.
        </p>
      </div>
      
      <div className="flex justify-end space-x-3  border-t border-blue-100 pt-4">
        <Button
          variant="outline"
          onClick={() => setShowDeleteModal(false)}
          disabled={isDeleting}
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteConfirm}
          loading={isDeleting}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
        >
          Delete Task
        </Button>
      </div>
    </div>
  </Modal>
</div>
  )
}

export default Tasks
