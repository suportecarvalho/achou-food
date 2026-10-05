import React from 'react'
import {
  Sparkle,
  ForkKnife,
  Coffee,
  Cake,
  Hamburger,
  CookingPot,
  Wine,
  Motorcycle,
  Clock,
  ShieldCheck,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface DesktopHomeHeroProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  totalRestaurants: number
}

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Locais', icon: ForkKnife },
  { id: 'sobremesas', label: 'Doces & Sobremesas', icon: Cake },
  { id: 'cafes', label: 'Cafés & Confeitarias', icon: Coffee },
  { id: 'hamburgueres', label: 'Hambúrgueres & Lanches', icon: Hamburger },
  { id: 'refeicoes', label: 'Bistrôs & Almoço', icon: CookingPot },
  { id: 'bebidas', label: 'Bebidas & Vinhos', icon: Wine },
]

export const DesktopHomeHero: React.FC<DesktopHomeHeroProps> = ({
  selectedCategory,
  onSelectCategory,
  totalRestaurants,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner Principal com Gradiente Achou Food */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#A5131E] via-[#EA1D2C] to-[#FF4D5A] text-white p-8 lg:p-10 shadow-xl border border-red-400/20">
        {/* Elementos Decorativos de Fundo */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block opacity-15 pointer-events-none">
          <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor">
            <path d="M6 46 H22 M2 56 H18 M8 66 H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="38" cy="74" r="11" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="78" cy="74" r="11" stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M38 74 L52 74 L64 60 L78 74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M64 60 L70 38 L80 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 54 C30 38 42 26 56 26 C70 26 82 38 82 54 Z" />
            <circle cx="56" cy="22" r="4.5" />
            <rect x="25" y="54" width="62" height="4.5" rx="2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-white/90 mb-4 border border-white/20">
            <Sparkle size={14} weight="fill" className="text-yellow-300" />
            <span>Gastronomia em Canela - Serra Gaúcha</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Descubra os sabores autênticos de Canela
          </h1>

          <p className="mt-3 text-base text-white/90 leading-relaxed font-normal">
            Peça dos melhores cafés coloniais, doces artesanais, bistrôs e confeitarias da região com entrega rápida na sua porta.
          </p>

          {/* Pílulas de Vantagens */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Clock size={15} className="text-yellow-300" />
              <span>Entrega média em 25 minutos</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Motorcycle size={15} className="text-yellow-300" />
              <span>Rastreamento em tempo real</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck size={15} className="text-emerald-300" />
              <span>Restaurantes 100% verificados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros por Categoria com Pílulas Estilizadas */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2.5 flex-nowrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 border cursor-pointer select-none',
                  isSelected
                    ? 'bg-red-base text-white border-red-base shadow-md shadow-red-base/20'
                    : 'bg-white text-gray-700 border-gray-200/90 hover:border-red-300 hover:bg-red-50/40 hover:text-red-base shadow-xs'
                )}
              >
                <Icon size={16} weight={isSelected ? 'bold' : 'regular'} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
