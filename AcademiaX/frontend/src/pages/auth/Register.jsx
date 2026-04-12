import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/Button'
import Input from '../../components/Input'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'teacher']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'teacher',
    },
  })

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data

    console.log("REGISTER PAYLOAD:", registerData)
    
    const result = await registerUser(registerData)
    console.log(result);

    if (!result.success) {
  console.log("FULL ERROR:", result.error)
  // toast.error(result.error)
  toast.error(
  typeof result.error === "string"
    ? result.error
    : result.error?.error || "Registration failed"

    
)
console.log("VALIDATION DETAILS >>>", result.error.details)
alert(JSON.stringify(result.error.details, null, 2))
}

    if (result.success) {
      toast.success('Registration successful!')
      navigate('/dashboard')
    } else {
      // toast.error(result.error)
      toast.error(
  typeof result.error === "string"
    ? result.error
    : result.error?.error || "Registration failed"
)
    }
  }

  return (


    <div className="space-y-7">
  {/* Header Section */}
  <div className="text-center sm:text-left space-y-2">
    <h2 className="text-2xl font-bold text-[#0B132B] tracking-tight">
      Create your account
    </h2>
    <p className="text-sm text-slate-600">
      Or{' '}
      <Link
        to="/auth/login"
        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline decoration-blue-300 underline-offset-4 transition-colors duration-200"
      >
        sign in to your existing account
      </Link>
    </p>
  </div>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Full Name Input */}
    <div className="group">
      <Input
        label="Full name"
        type="text"
        placeholder="Alex Johnson"
        icon={User}
        {...register('name')}
        error={errors.name?.message}
        className="focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-400 transition-all duration-200"
      />
    </div>

    {/* Email Input */}
    <div className="group">
      <Input
        label="Email address"
        type="email"
        placeholder="you@school.edu"
        icon={Mail}
        {...register('email')}
        error={errors.email?.message}
        className="focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-400 transition-all duration-200"
      />
    </div>

    {/* Password Input */}
    <div className="group">
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Create a strong password"
        icon={Lock}
        {...register('password')}
        error={errors.password?.message}
        className="focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-400 transition-all duration-200"
      />
    </div>

    {/* Confirm Password Input */}
    <div className="group">
      <Input
        label="Confirm password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        icon={Lock}
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        className="focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-400 transition-all duration-200"
      />
    </div>

    {/* Role Selection */}
    <div>
      <label className="block text-sm font-medium text-[#0B132B] mb-3">
        Account type
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Teacher Option */}
        <label className="relative group/role cursor-pointer">
          <input
            {...register('role')}
            type="radio"
            value="teacher"
            className="peer sr-only"
          />
          <div className="p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 
            border-slate-200 
            peer-checked:border-blue-600 peer-checked:bg-blue-50/60 peer-checked:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.25)]
            hover:border-blue-300 hover:bg-blue-50/30 hover:-translate-y-0.5
            bg-white">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover/role:scale-110 transition-transform duration-300">
                <User className="w-5 h-5 text-blue-700" />
              </div>
              <p className="text-sm font-semibold text-[#0B132B]">Teacher</p>
              <p className="text-xs text-slate-500 mt-1">Manage students & tasks</p>
            </div>
          </div>
          {/* Checked Indicator */}
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity duration-200 shadow-sm">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>

        {/* Admin Option */}
        <label className="relative group/role cursor-pointer">
          <input
            {...register('role')}
            type="radio"
            value="admin"
            className="peer sr-only"
          />
          <div className="p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 
            border-slate-200 
            peer-checked:border-blue-600 peer-checked:bg-blue-50/60 peer-checked:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.25)]
            hover:border-blue-300 hover:bg-blue-50/30 hover:-translate-y-0.5
            bg-white">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-linear-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center group-hover/role:scale-110 transition-transform duration-300">
                <User className="w-5 h-5 text-indigo-700" />
              </div>
              <p className="text-sm font-semibold text-[#0B132B]">Admin</p>
              <p className="text-xs text-slate-500 mt-1">Full system access</p>
            </div>
          </div>
          {/* Checked Indicator */}
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity duration-200 shadow-sm">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>
      </div>
      {errors.role && (
        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errors.role.message}
        </p>
      )}
    </div>

    {/* Submit Button */}
    <Button
      type="submit"
      className="w-full bg-linear-to-r from-[#0B132B] to-blue-700 hover:from-[#080E22] hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 active:scale-[0.99] transition-all duration-200 border-0"
      loading={isLoading}
      disabled={isLoading}
    >
      Create account
    </Button>
  </form>

  {/* Footer Section */}
  <div className="pt-2">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-white text-slate-500 font-medium">
          Or continue with
        </span>
      </div>
    </div>

    <div className="mt-5 text-center">
      <p className="text-xs text-slate-500">
        By registering, you agree to our{' '}
        <a href="#" className="font-medium text-blue-600 hover:text-blue-700 hover:underline decoration-blue-200 underline-offset-4 transition-colors duration-200">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="font-medium text-blue-600 hover:text-blue-700 hover:underline decoration-blue-200 underline-offset-4 transition-colors duration-200">
          Privacy Policy
        </a>
      </p>
    </div>
  </div>
</div>

  )
}

export default Register
