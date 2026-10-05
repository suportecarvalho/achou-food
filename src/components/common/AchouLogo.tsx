import React from 'react'

interface AchouLogoProps {
  variant?: 'full' | 'icon' | 'scooter' | 'horizontal'
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const AchouLogo: React.FC<AchouLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { height: 28, text: 'text-lg', iconSize: 28 },
    md: { height: 36, text: 'text-2xl', iconSize: 36 },
    lg: { height: 48, text: 'text-3xl', iconSize: 48 },
    xl: { height: 64, text: 'text-4xl', iconSize: 64 },
  }

  const { iconSize, text } = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center bg-red-base rounded-2xl shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Motion lines */}
          <path d="M6 46 H22 M2 56 H18 M8 66 H20" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          {/* Scooter Body & Wheels */}
          <circle cx="38" cy="74" r="11" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          <circle cx="78" cy="74" r="11" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          <path d="M38 74 L52 74 L64 60 L78 74" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M64 60 L70 38 L80 38" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Cloche */}
          <path d="M30 54 C30 38 42 26 56 26 C70 26 82 38 82 54 Z" fill="#FFFFFF" />
          <circle cx="56" cy="22" r="4.5" fill="#FFFFFF" />
          <rect x="25" y="54" width="62" height="4.5" rx="2" fill="#FFFFFF" />
        </svg>
      </div>
    )
  }

  if (variant === 'scooter') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`inline-block flex-shrink-0 ${className}`}
        style={{ width: iconSize, height: iconSize }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Motion lines */}
        <path d="M6 46 H22 M2 56 H18 M8 66 H20" stroke="#8F141F" strokeWidth="4" strokeLinecap="round" />
        {/* Scooter Body & Wheels */}
        <circle cx="38" cy="74" r="11" stroke="#8F141F" strokeWidth="4" fill="none" />
        <circle cx="78" cy="74" r="11" stroke="#8F141F" strokeWidth="4" fill="none" />
        <path d="M38 74 L52 74 L64 60 L78 74" stroke="#8F141F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M64 60 L70 38 L80 38" stroke="#8F141F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Cloche */}
        <path d="M30 54 C30 38 42 26 56 26 C70 26 82 38 82 54 Z" fill="#8F141F" />
        <circle cx="56" cy="22" r="4.5" fill="#8F141F" />
        <rect x="25" y="54" width="62" height="4.5" rx="2" fill="#8F141F" />
      </svg>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Motion lines */}
        <path d="M6 46 H22 M2 56 H18 M8 66 H20" stroke="#8F141F" strokeWidth="4" strokeLinecap="round" />
        {/* Scooter Wheels & Body */}
        <circle cx="38" cy="74" r="11" stroke="#8F141F" strokeWidth="4" fill="none" />
        <circle cx="78" cy="74" r="11" stroke="#8F141F" strokeWidth="4" fill="none" />
        <path d="M38 74 L52 74 L64 60 L78 74" stroke="#8F141F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M64 60 L70 38 L80 38" stroke="#8F141F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Cloche */}
        <path d="M30 54 C30 38 42 26 56 26 C70 26 82 38 82 54 Z" fill="#8F141F" />
        <circle cx="56" cy="22" r="4.5" fill="#8F141F" />
        <rect x="25" y="54" width="62" height="4.5" rx="2" fill="#8F141F" />
      </svg>
      <span className={`font-bold tracking-tight text-red-base font-sans ${text} leading-none flex items-baseline gap-1`}>
        <span>Achou</span>
        <span className="font-extrabold text-red-dark">Food</span>
      </span>
    </div>
  )
}
