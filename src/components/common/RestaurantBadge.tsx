import React from 'react'
import { cn } from '@/lib/utils'

interface RestaurantBadgeProps {
  slug?: string
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const RestaurantBadge: React.FC<RestaurantBadgeProps> = ({
  slug,
  name,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl text-xs',
    md: 'w-14 h-14 rounded-2xl text-sm',
    lg: 'w-16 h-16 rounded-2xl text-base',
  }

  const normalized = (slug || name).toLowerCase()

  // 1. Doce Aroma (Pink badge with cake / cupcake)
  if (normalized.includes('doce aroma') || normalized.includes('doce-aroma')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#FDE2E4] border border-[#FBCFE8] shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#F472B6" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="41" stroke="#DB2777" strokeWidth="2" />
          {/* Cupcake / Cake */}
          <path
            d="M36 54 L64 54 L60 76 L40 76 Z"
            fill="#F472B6"
            stroke="#DB2777"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M33 54 C33 42, 43 38, 50 38 C57 38, 67 42, 67 54 Z"
            fill="#FFFFFF"
            stroke="#DB2777"
            strokeWidth="2.5"
          />
          <circle cx="50" cy="34" r="5" fill="#E11D48" />
          <path d="M50 30 Q54 24 58 25" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" />
          {/* Text Badge */}
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7.5"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            DOCE
          </text>
          <text
            x="50"
            y="73"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="6.5"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            AROMA
          </text>
        </svg>
      </div>
    )
  }

  // 2. Restaurante Sabor & Arte (Red badge with chef hat and utensils)
  if (normalized.includes('sabor & arte') || normalized.includes('sabor-arte')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#B81723] text-white shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
          <circle cx="50" cy="50" r="40" stroke="#FFFFFF" strokeWidth="2" opacity="0.85" />
          {/* Chef Hat */}
          <path
            d="M38 42 C33 42 32 32 40 30 C41 24 50 22 55 26 C60 22 69 25 68 31 C74 33 73 42 67 42 Z"
            fill="#FFFFFF"
          />
          <rect x="38" y="42" width="29" height="5" rx="1.5" fill="#FFFFFF" />
          {/* Text */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7.5"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            SABOR
          </text>
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            &amp; ARTE
          </text>
          {/* Crossed Fork & Spoon */}
          <path d="M37 77 L63 67 M63 77 L37 67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // 3. Bistrô do Pão (Warm golden beige with bread)
  if (normalized.includes('bistrô do pão') || normalized.includes('bistro-pao')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#FDE68A] text-[#78350F] shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#92400E" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="40" stroke="#92400E" strokeWidth="2.5" />
          {/* Bread loaf */}
          <ellipse cx="50" cy="52" rx="24" ry="12" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          <path d="M38 50 Q41 53 43 56 M48 48 Q50 53 52 57 M57 49 Q59 53 61 56" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          <text
            x="50"
            y="35"
            textAnchor="middle"
            fill="#78350F"
            fontSize="7"
            fontWeight="bold"
            letterSpacing="1"
            fontFamily="Noto Sans, sans-serif"
          >
            PADARIA
          </text>
          <text
            x="50"
            y="74"
            textAnchor="middle"
            fill="#78350F"
            fontSize="7.5"
            fontWeight="bold"
            letterSpacing="0.8"
            fontFamily="Noto Sans, sans-serif"
          >
            BISTRÔ
          </text>
        </svg>
      </div>
    )
  }

  // 4. Cafeteria do Vale (Purple badge with coffee cup)
  if (normalized.includes('cafeteria do vale') || normalized.includes('cafeteria-vale')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#A855F7] text-white shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
          <circle cx="50" cy="50" r="39" stroke="#FFFFFF" strokeWidth="2" />
          {/* Steam */}
          <path d="M44 32 Q46 26 44 22 M50 31 Q52 25 50 20 M56 32 Q58 26 56 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Coffee cup */}
          <path
            d="M34 38 L62 38 L58 58 C58 64 42 64 42 58 Z"
            fill="#FFFFFF"
          />
          {/* Handle */}
          <path d="M60 42 C67 42 67 52 58 52" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Saucer */}
          <path d="M30 63 L70 63" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Text banner */}
          <text
            x="50"
            y="76"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="bold"
            letterSpacing="0.5"
            fontFamily="Noto Sans, sans-serif"
          >
            CAFETERIA
          </text>
        </svg>
      </div>
    )
  }

  // 5. Sabor Tropical (Orange badge with tropical fruits)
  if (normalized.includes('sabor tropical') || normalized.includes('sabor-tropical')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#EA580C] text-white shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="50" cy="50" r="39" stroke="#FFFFFF" strokeWidth="2" />
          {/* Tropical fruit & leaves */}
          <circle cx="44" cy="40" r="10" fill="#FACC15" />
          <circle cx="56" cy="42" r="9" fill="#FB923C" />
          <path d="M50 26 Q46 32 48 35 M50 26 Q54 32 52 35" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />
          {/* Text */}
          <text
            x="50"
            y="61"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7.5"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            SABOR
          </text>
          <text
            x="50"
            y="71"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="6.5"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            TROPICAL
          </text>
        </svg>
      </div>
    )
  }

  // 6. Hamburger da Esquina (Dark charcoal badge with burger icon)
  if (normalized.includes('hamburger da esquina') || normalized.includes('hamburger-esquina')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#1F1818] text-white shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#5C5656" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="39" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />
          {/* Top bun */}
          <path d="M30 46 C30 33, 70 33, 70 46 Z" fill="#FFFFFF" opacity="0.95" />
          {/* Sesame seeds */}
          <circle cx="44" cy="38" r="1.5" fill="#1F1818" />
          <circle cx="52" cy="36" r="1.5" fill="#1F1818" />
          <circle cx="58" cy="39" r="1.5" fill="#1F1818" />
          {/* Lettuce wavy line */}
          <path d="M28 50 Q34 47 40 50 Q46 53 52 50 Q58 47 64 50 Q70 53 72 50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Patty */}
          <rect x="29" y="55" width="42" height="6" rx="3" fill="#FFFFFF" opacity="0.9" />
          {/* Bottom bun */}
          <path d="M31 65 C31 69, 69 69, 69 65 Z" fill="#FFFFFF" opacity="0.95" />
          {/* Mini stars */}
          <circle cx="50" cy="76" r="1.5" fill="#FFFFFF" />
          <circle cx="43" cy="76" r="1.2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="57" cy="76" r="1.2" fill="#FFFFFF" opacity="0.6" />
        </svg>
      </div>
    )
  }

  // 7. Cafeteria das Nuvens (Forest green badge with coffee & leaves)
  if (normalized.includes('cafeteria das nuvens') || normalized.includes('cafeteria-nuvens')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#2D5A27] text-white shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="50" cy="50" r="39" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />
          {/* Steam & leaves */}
          <path d="M46 27 Q48 22 46 18 M54 27 Q56 22 54 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Cup */}
          <path d="M36 34 L64 34 L60 52 C60 57 44 57 44 52 Z" fill="#FFFFFF" />
          <path d="M62 38 C68 38 68 47 60 47" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 56 L68 56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Text */}
          <text
            x="50"
            y="69"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            CAFÉ
          </text>
          <text
            x="50"
            y="78"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="6"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            DAS NUVENS
          </text>
        </svg>
      </div>
    )
  }

  // 8. Veg & Cia (Soft cream/gold badge with fresh green sprout)
  if (normalized.includes('veg & cia') || normalized.includes('veg-cia')) {
    return (
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center bg-[#FEF08A] text-[#14532D] shadow-sm select-none',
          sizeClasses[size],
          className
        )}
      >
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#84CC16" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="39" stroke="#16A34A" strokeWidth="2.5" />
          {/* Sprout */}
          <path
            d="M50 64 L50 42 C50 42 42 35 34 38 C32 46 42 45 48 45"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2"
          />
          <path
            d="M50 44 C50 44 58 35 66 38 C68 46 58 45 52 45"
            fill="#4ADE80"
            stroke="#15803D"
            strokeWidth="2"
          />
          <path d="M50 42 L50 64" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          {/* Text */}
          <text
            x="50"
            y="76"
            textAnchor="middle"
            fill="#14532D"
            fontSize="7.5"
            fontWeight="bold"
            fontFamily="Noto Sans, sans-serif"
          >
            VEG &amp; CIA
          </text>
        </svg>
      </div>
    )
  }

  // Fallback generic badge
  return (
    <div
      className={cn(
        'flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-600 font-bold shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  )
}
