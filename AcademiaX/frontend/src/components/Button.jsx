
import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'
  
  const variantClasses = {
    primary: 'bg-[#00072D] text-white hover:bg-[#000A40] focus:ring-[#00072D]/50 shadow-sm',
    secondary: 'bg-blue-50 text-[#00072D] hover:bg-blue-100 focus:ring-blue-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/50 shadow-sm',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500/50 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-sm',
    outline: 'border border-blue-200 bg-white text-[#00072D] hover:bg-blue-50 focus:ring-blue-200',
    ghost: 'text-[#00072D] hover:bg-blue-50 focus:ring-blue-200',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `.trim()
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className={`animate-spin ${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`${iconSizeClasses[size]} ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  )
}

export default Button;