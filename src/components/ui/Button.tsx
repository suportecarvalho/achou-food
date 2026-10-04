import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'remove' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, iconPosition = 'left', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none'

    const sizeStyles = {
      sm: 'text-label-xs px-3 py-1.5 rounded-full gap-1.5 h-8',
      md: 'text-label-xs px-4 py-2 rounded-full gap-2 h-10',
      lg: 'text-title-sm px-6 py-3 rounded-full gap-2.5 h-12',
    }

    const variantStyles = {
      // Primary: Red base button with white text or pill
      primary: 'bg-red-base hover:bg-red-dark text-white shadow-sm hover:shadow active:bg-red-dark',
      // Secondary: Light gray pill with gray-600 text
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-600 border border-transparent hover:border-gray-300',
      // Remove: Red dark button from design spec
      remove: 'bg-red-dark hover:bg-red-base text-white shadow-sm w-full py-2.5 rounded-md font-semibold text-title-sm',
      // Ghost: Minimalist
      ghost: 'bg-transparent hover:bg-gray-200 text-gray-500 hover:text-gray-600',
      // Icon: Circular or rounded pill
      icon: 'bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2 h-9 w-9 flex items-center justify-center',
    }

    if (variant === 'icon') {
      return (
        <button
          ref={ref}
          className={cn(baseStyles, variantStyles.icon, className)}
          {...props}
        >
          {icon || children}
        </button>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
