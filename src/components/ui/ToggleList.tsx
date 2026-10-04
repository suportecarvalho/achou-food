import React from 'react'
import { Rows, MapTrifold } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export type ViewMode = 'list' | 'map'

interface ToggleListProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  className?: string
}

export const ToggleList: React.FC<ToggleListProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-gray-200/90 rounded-full border border-gray-300/40 shadow-inner',
        className
      )}
      role="group"
      aria-label="Alternar visualização em lista ou mapa"
    >
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
          value === 'list'
            ? 'bg-white text-red-base shadow-sm font-semibold'
            : 'text-gray-400 hover:text-gray-600'
        )}
        title="Visualização em Lista"
      >
        <Rows size={18} weight={value === 'list' ? 'bold' : 'regular'} />
      </button>

      <button
        type="button"
        onClick={() => onChange('map')}
        aria-pressed={value === 'map'}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
          value === 'map'
            ? 'bg-white text-red-base shadow-sm font-semibold'
            : 'text-gray-400 hover:text-gray-600'
        )}
        title="Visualização no Mapa"
      >
        <MapTrifold size={18} weight={value === 'map' ? 'bold' : 'regular'} />
      </button>
    </div>
  )
}
