import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react'
import { studentsAPI } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const Students = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    section: '',
    page: 1,
    limit: 10,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [filters])


  const fetchStudents = async () => {
  try {
    setLoading(true)

    const response = await studentsAPI.getStudents(filters)

    setStudents(response.data.data.students)
    setPagination(response.data.data.pagination)

  } catch (error) {
    console.log(error.response?.data)
    toast.error('Failed to fetch students')
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

  const handleDeleteClick = (student) => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await studentsAPI.deleteStudent(selectedStudent._id)
      toast.success('Student deleted successfully')
      setShowDeleteModal(false)
      setSelectedStudent(null)
      fetchStudents()
    } catch (error) {
      toast.error('Failed to delete student')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await studentsAPI.exportStudents()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'students_export.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Students exported successfully')
    } catch (error) {
      toast.error('Failed to export students')
    }
  }

  const getStatusBadge = (stats) => {
    const total = stats.total || 0
    const completed = stats.completed || 0
    const overdue = stats.overdue || 0
    
    if (overdue > 0) {
      return <span className="badge badge-danger">Overdue Tasks</span>
    }
    if (total > 0 && completed === total) {
      return <span className="badge badge-success">All Complete</span>
    }
    if (total > 0) {
      return <span className="badge badge-warning">In Progress</span>
    }
    return <span className="badge badge-info">No Tasks</span>
  }

  return (
   <div className="space-y-6 bg-slate-50/50 min-h-screen px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
  {/* Page Header */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Students</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and view all students in your dashboard</p>
      </div>
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={handleExport}
          icon={Download}
          className="border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 rounded-lg shadow-sm"
        >
          Export
        </Button>
        <Link to="/students/create">
          <Button icon={Plus} className="bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md rounded-lg">
            Add Student
          </Button>
        </Link>
      </div>
    </div>
  </div>

  {/* Filters */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <Input
          placeholder="Search students by name or email..."
          icon={Search}
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border-slate-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 rounded-xl bg-slate-50 hover:bg-white transition-all duration-200 placeholder:text-slate-400"
        />
      </div>
      <div>
        <select
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 outline-none cursor-pointer hover:bg-white hover:border-slate-300 transition-all duration-200"
          value={filters.grade}
          onChange={(e) => handleFilterChange('grade', e.target.value)}
        >
          <option value="">All Grades</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Grade {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 outline-none cursor-pointer hover:bg-white hover:border-slate-300 transition-all duration-200"
          value={filters.section}
          onChange={(e) => handleFilterChange('section', e.target.value)}
        >
          <option value="">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>
      </div>
    </div>
  </div>

  {/* Students Table */}
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="w-full overflow-x-auto">
      <table className="m-full text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Student ID</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Grade</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Tasks</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                      <div className="h-3 w-32 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))
          ) : students.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-900/60" />
                  </div>
                  <p className="text-slate-600 font-medium">No students found</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Try adjusting your filters or add a new student
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id} className="group hover:bg-blue-50/40 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-900 to-slate-800 rounded-full flex items-center justify-center mr-3 shadow-sm ring-2 ring-white group-hover:ring-blue-100 transition-all">
                      <span className="text-sm font-bold text-white">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block border border-slate-100">
                    {student.studentId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    Grade {student.grade} - {student.section}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 space-y-1.5">
                    {student.phone && (
                      <div className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        <span className="text-slate-700">{student.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      <span className="text-slate-500">{student.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-800">
                    {student.taskStats?.total || 0} <span className="text-slate-400 font-normal text-xs uppercase tracking-wide">tasks</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(student.taskStats)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Link to={`/students/${student._id}`}>
                      <Button variant="ghost" size="sm" icon={Eye} className="text-slate-900 hover:text-blue-300 hover:bg-blue-400/50 rounded-lg transition-all" />
                    </Link>
                    <Link to={`/students/${student._id}/edit`}>
                      <Button variant="ghost" size="sm" icon={Edit} className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" />
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'teacher') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteClick(student)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 font-medium">
          Showing <span className="text-slate-900 font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
          <span className="text-slate-900 font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
          <span className="text-slate-900 font-semibold">{pagination.total}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={ChevronLeft}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="border-slate-200 text-slate-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
          />
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-md font-medium transition-all duration-200 ${
                  pagination.page === i + 1
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
            className="border-slate-200 text-slate-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
          />
        </div>
      </div>
    )}
  </div>

  {/* Delete Modal */}
  <Modal
    isOpen={showDeleteModal}
    onClose={() => setShowDeleteModal(false)}
    title="Delete Student"
    size="sm"
  >
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Delete {selectedStudent?.firstName} {selectedStudent?.lastName}?
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          This action cannot be undone. The student and all associated tasks will be permanently deleted.
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <Button
          variant="outline"
          onClick={() => setShowDeleteModal(false)}
          disabled={isDeleting}
          className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all rounded-lg"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteConfirm}
          loading={isDeleting}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all rounded-lg"
        >
          Delete Student
        </Button>
      </div>
    </div>
  </Modal>
</div>
  )
}

export default Students
