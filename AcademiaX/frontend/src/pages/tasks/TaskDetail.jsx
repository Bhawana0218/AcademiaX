import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  CheckSquare,
  Edit,
  Trash2,
  FileText,
  Award,
  AlertTriangle,
  Plus,
} from 'lucide-react'
import { tasksAPI } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Input from '../../components/Input'
import toast from 'react-hot-toast'

const TaskDetail = () => {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState(null)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' })
  const [submissionData, setSubmissionData] = useState({ content: '' })
  const [isGrading, setIsGrading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
  if (id && id !== 'create') {
    fetchTask()
  }
}, [id])


  const fetchTask = async () => {
  try {
    if (!id || id === 'create') return  

    setLoading(true)
    const response = await tasksAPI.getTask(id)
    setTask(response.data.data.task)
  } catch (error) {
    toast.error('Failed to fetch task details')
  } finally {
    setLoading(false)
  }
}

  const handleGradeSubmit = async () => {
    try {
      setIsGrading(true)
      await tasksAPI.gradeTask(id, {
        grade: parseInt(gradeData.grade),
        feedback: gradeData.feedback,
      })
      toast.success('Task graded successfully')
      setShowGradeModal(false)
      setGradeData({ grade: '', feedback: '' })
      fetchTask()
    } catch (error) {
      toast.error('Failed to grade task')
    } finally {
      setIsGrading(false)
    }
  }

  const handleSubmitTask = async () => {
    try {
      setIsSubmitting(true)
      await tasksAPI.submitTask(id, submissionData)
      toast.success('Task submitted successfully')
      setShowSubmitModal(false)
      setSubmissionData({ content: '' })
      fetchTask()
    } catch (error) {
      toast.error('Failed to submit task')
    } finally {
      setIsSubmitting(false)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link to="/tasks" className="mr-4">
            <Button variant="ghost" icon={ArrowLeft} />
          </Link>
          <div>
            <div className="skeleton h-8 w-48"></div>
            <div className="skeleton h-4 w-32 mt-2"></div>
          </div>
        </div>
        
        <div className="card p-6 animate-pulse">
          <div className="space-y-4">
            <div className="skeleton h-6 w-32"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (

    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/tasks" className="mr-4">
              <Button variant="ghost" icon={ArrowLeft} className="text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-blue-950 tracking-tight">{task?.title}</h1>
              <p className="text-sm text-blue-600 mt-0.5">Task Details</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {task?.status !== 'completed' && (
              <Button
                onClick={() => setShowSubmitModal(true)}
                icon={Plus}
                className="bg-blue-900 hover:bg-blue-800 text-white font-medium shadow-sm transition-colors"
              >
                Submit Task
              </Button>
            )}
            <Link to={`/tasks/${id}/edit`}>
              <Button icon={Edit} className="bg-blue-900 hover:bg-blue-800 text-white font-medium shadow-sm transition-colors">
                Edit Task
              </Button>
            </Link>
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <Button
                variant="outline"
                onClick={() => setShowGradeModal(true)}
                icon={Award}
                disabled={!task?.submission?.submittedAt}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Grade Task
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-blue-950">
                Task Information
              </h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge(task?.status)}
                {getPriorityBadge(task?.priority)}
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1.5">
                  Description
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {task?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Category</p>
                  <p className="text-sm font-semibold text-blue-900 capitalize">
                    {task?.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Estimated Time</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {task?.estimatedTime} minutes
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {new Date(task?.dueDate).toLocaleDateString()}
                  </p>
                  {isOverdue(task?.dueDate, task?.status) && (
                    <div className="flex items-center text-xs font-medium text-red-600 mt-1">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Overdue
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Created Date</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {new Date(task?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {task?.tags?.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission */}
          {task?.submission?.submittedAt && (
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-blue-950 mb-5">
                Submission
              </h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1.5">Submitted Content</p>
                  <p className="text-sm text-blue-800 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    {task.submission.content}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Submitted At</p>
                    <p className="text-sm font-semibold text-blue-900">
                      {new Date(task.submission.submittedAt).toLocaleDateString()} at{' '}
                      {new Date(task.submission.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Submitted By</p>
                    <p className="text-sm font-semibold text-blue-900">
                      {task.submission.submittedBy?.firstName} {task.submission.submittedBy?.lastName}
                    </p>
                  </div>
                </div>

                {task.submission.grade && (
                  <div className="border-t border-blue-100 pt-5 mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Grade</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {task.submission.grade}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1">Graded By</p>
                        <p className="text-sm font-semibold text-blue-900">
                          {task.submission.gradedBy?.name}
                        </p>
                      </div>
                    </div>
                    
                    {task.submission.feedback && (
                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-500 mb-1.5">Feedback</p>
                        <p className="text-sm text-blue-700 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                          {task.submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned To */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-blue-950 mb-4">
              Assigned To
            </h3>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                <span className="text-sm font-bold text-blue-800">
                  {task?.assignedTo?.firstName?.charAt(0)}{task?.assignedTo?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  {task?.assignedTo?.firstName} {task?.assignedTo?.lastName}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  {task?.assignedTo?.studentId} - Grade {task?.assignedTo?.grade}
                </p>
              </div>
            </div>
          </div>

          {/* Created By */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-blue-950 mb-4">
              Created By
            </h3>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  {task?.assignedBy?.name}
                </p>
                <p className="text-xs text-blue-600 mt-0.5 capitalize">
                  {task?.assignedBy?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-blue-950 mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <Link to={`/students/${task?.assignedTo?._id}`}>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900 font-medium transition-colors" icon={User}>
                  View Student Profile
                </Button>
              </Link>
              
              <Link to={`/tasks/create?student=${task?.assignedTo?._id}`}>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900 font-medium transition-colors" icon={Plus}>
                  Create Similar Task
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Grade Task"
        size="md"
      >
        <div className="space-y-5 p-2">
          <Input
            label="Grade (%)"
            type="number"
            min="0"
            max="100"
            placeholder="Enter grade (0-100)"
            value={gradeData.grade}
            onChange={(e) => setGradeData(prev => ({ ...prev, grade: e.target.value }))}
            className="w-full"
          />
          
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1.5">Feedback</label>
            <textarea
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              rows="4"
              placeholder="Enter feedback..."
              value={gradeData.feedback}
              onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-100">
            <Button
              variant="outline"
              onClick={() => setShowGradeModal(false)}
              disabled={isGrading}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGradeSubmit}
              loading={isGrading}
              disabled={isGrading || !gradeData.grade}
              className="bg-blue-900 hover:bg-blue-800 text-white font-medium shadow-sm"
            >
              Submit Grade
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Task"
        size="md"
      >
        <div className="space-y-5 p-2">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1.5">Submission Content</label>
            <textarea
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              rows="6"
              placeholder="Enter your submission..."
              value={submissionData.content}
              onChange={(e) => setSubmissionData(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-100">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitTask}
              loading={isSubmitting}
              disabled={isSubmitting || !submissionData.content}
              className="bg-blue-900 hover:bg-blue-800 text-white font-medium shadow-sm"
            >
              Submit Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskDetail
