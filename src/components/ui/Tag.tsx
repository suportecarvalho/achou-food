import React from 'react'
import { cn } from '@/lib/utils'

export interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  icon?: React.ReactNode
  label: string
}

export const Tag: React.FC<TagProps> = ({
  selected = false,
  icon,
  label,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-label-xs font-semibold tracking-wide transition-all duration-150 select-none whitespace-nowrap active:scale-95',
        selected
          ? 'bg-red-base text-white shadow-sm'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 border border-gray-200/80',
        className
      )}
      {...props}
    >
      {icon && <span className={cn('text-sm', selected ? 'text-white' : 'text-gray-400')}>{icon}</span>}
      <span>{label}</span>
    </button>
  )
}
