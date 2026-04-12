import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { tasksAPI, studentsAPI } from '../../services/api'
import Button from '../../components/Button'
import Input from '../../components/Input'
import toast from 'react-hot-toast'

const CreateTask = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: searchParams.get('student') || '',
    priority: 'medium',
    category: 'assignment',
    dueDate: '',
    estimatedTime: ''
  })

  // Fetch students for dropdown
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await studentsAPI.getStudents()
      setStudents(res.data.data.students || [])
    } catch (err) {
      toast.error('Failed to load students')
    }
  }

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.title || !formData.description || !formData.assignedTo || !formData.dueDate) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)

      await tasksAPI.createTask({
        ...formData,
        estimatedTime: formData.estimatedTime ? Number(formData.estimatedTime) : undefined
      })

      toast.success('Task created successfully')

      // redirect to tasks list
      navigate('/tasks')
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950 tracking-tight">Create Task</h1>
        <p className="text-sm text-blue-600 mt-1">Fill in the details below to create a new task</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm space-y-5">

        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title"
          className="w-full"
        />

        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-1.5">Description</label>
          <textarea
            className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
            rows="4"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        {/* Student Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-1.5">Assign To (Student)</label>
          <select
            className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 pr-8 text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
            value={formData.assignedTo}
            onChange={(e) => handleChange('assignedTo', e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName} ({s.studentId})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1.5">Priority</label>
            <select
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 pr-8 text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1.5">Category</label>
            <select
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 pr-8 text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="assignment">Assignment</option>
              <option value="project">Project</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
              <option value="homework">Homework</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />

          <Input
            label="Estimated Time (minutes)"
            type="number"
            value={formData.estimatedTime}
            onChange={(e) => handleChange('estimatedTime', e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-blue-100">
          <Button
            variant="outline"
            onClick={() => navigate('/tasks')}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900 font-medium"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            className="bg-blue-900 hover:bg-blue-800 text-white font-medium shadow-sm"
          >
            Create Task
          </Button>
        </div>

      </form>
    </div>
  )
}

export default CreateTask