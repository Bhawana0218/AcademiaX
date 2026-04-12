import React, { useEffect, useState } from 'react'
import { Users, Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const UsersPage = () => {
  const { user } = useAuthStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await usersAPI.getUsers()
      setUsers(res.data.data.users)
    } catch (err) {
           console.log(err.response?.data || err.message)
           toast.error(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())

    const matchesRole =
      roleFilter === 'all' || u.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6 bg-slate-50/40 min-h-screen p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all users in your system
          </p>
        </div>

        <button className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute top-2.5 left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-slate-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {u.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {u.email}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : u.role === 'teacher'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      Active
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-100">
                      <Edit className="w-4 h-4 text-slate-600" />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersPage