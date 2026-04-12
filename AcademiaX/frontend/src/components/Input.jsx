import React from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  
  const inputType = type === 'password' && showPassword ? 'text' : type
  
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200'
  const stateClasses = error
    ? 'border-danger-500 focus:ring-danger-500 pr-10'
    : isFocused
    ? 'border-primary-500 focus:ring-primary-500'
    : 'border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:bg-[#00072D]  dark:text-white dark:placeholder-gray-400'
  
  const classes = `${baseClasses} ${stateClasses} ${Icon ? 'pl-10' : ''} ${className}`.trim()
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={classes}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-danger-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input
