import React, { useState } from 'react'
import { studentsAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const CreateStudent = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
  lastName: '',
  email: '',
  phone: '',
  studentId: '',
  grade: '',
  section: '',
  dateOfBirth: '',
  gender: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const payload = {
      ...formData,
      grade: Number(formData.grade)
    }

    const res = await studentsAPI.createStudent(payload)

    toast.success('Student created successfully')
    navigate('/students')

  } catch (error) {
    console.log(error.response?.data)

    toast.error(
      error.response?.data?.details?.[0]?.message || 'Validation error'
    )
  }
}

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create Student</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
         type="date"
         name="dateOfBirth"
         value={formData.dateOfBirth || ''}
         onChange={handleChange}
         className="w-full border p-2 rounded"
        />

        {/* Optional fields (not sent yet) */}
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="grade"
          placeholder="Grade"
          value={formData.grade}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
  name="gender"
  value={formData.gender || ''}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>

        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default CreateStudent