import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/Button'
import Input from '../../components/Input'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    const result = await login(data)
    
    if (result.success) {
      toast.success('Login successful!')
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="space-y-7">
  {/* Header Section */}
  <div className="text-center sm:text-left space-y-2">
    <h2 className="text-2xl font-bold text-[#0B132B] tracking-tight">
      Welcome back
    </h2>
    <p className="text-sm text-slate-600">
      Or{' '}
      <Link
        to="/auth/register"
        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline decoration-blue-300 underline-offset-4 transition-colors duration-200"
      >
        create a new account
      </Link>
    </p>
  </div>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        placeholder="••••••••"
        icon={Lock}
        {...register('password')}
        error={errors.password?.message}
        className="focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-400 transition-all duration-200"
      />
    </div>

    {/* Remember & Forgot */}
    <div className="flex items-center justify-between pt-1">
      <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer group/select">
        <div className="relative">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="peer h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all duration-200"
          />
          <div className="absolute inset-0 rounded bg-blue-500/10 scale-0 peer-checked:scale-100 peer-checked:opacity-100 opacity-0 transition-all duration-200 pointer-events-none" />
        </div>
        <span className="text-sm text-slate-700 group-hover/select:text-slate-900 transition-colors">
          Remember me
        </span>
      </label>

      <a 
        href="#" 
        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline decoration-blue-200 underline-offset-4 transition-all duration-200"
      >
        Forgot password?
      </a>
    </div>

    {/* Submit Button */}
    <Button
      type="submit"
      className="w-full bg-linear-to-r from-[#0B132B] to-blue-700 hover:from-[#080E22] hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 active:scale-[0.99] transition-all duration-200 border-0"
      loading={isLoading}
      disabled={isLoading}
    >
      Sign in
    </Button>
  </form>
</div>
  )
}

export default Login
