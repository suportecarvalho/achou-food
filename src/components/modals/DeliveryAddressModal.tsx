import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlass,
  Crosshair,
  X,
  MapPin,
  Check,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface DeliveryAddressModalProps {
  isOpen: boolean
  onClose: () => void
  currentAddress: string
  onSelectAddress: (address: string) => void
}

const SUGGESTIONS = [
  'Vila Claudia, Canela - RS',
  'Av. das Estrelas, 567 - Canela, RS',
  'Rua Felisberto Soares, 120 - Canela, RS',
  'Av. Osvaldo Aranha, 890 - Canela, RS',
  'Rua Borges de Medeiros, 230 - Gramado, RS',
]

export const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [searchInput, setSearchInput] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  const navigate = useNavigate()

  if (!isOpen) return null

  const handleUseCurrentLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false)
          onSelectAddress('Próximo de Vila Claudia, Canela - RS')
          onClose()
        },
        () => {
          setIsLocating(false)
          onSelectAddress('Próximo de Vila Claudia, Canela - RS')
          onClose()
        },
        { timeout: 2500 }
      )
    } else {
      setIsLocating(false)
      onSelectAddress('Próximo de Vila Claudia, Canela - RS')
      onClose()
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSelectAddress(searchInput.trim())
      onClose()
    }
  }

  const filteredSuggestions = searchInput.trim()
    ? SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchInput.toLowerCase())
      )
    : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-delivery-title"
    >
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-[420px] bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 animate-scaleUp overflow-hidden select-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors active:scale-95"
          aria-label="Fechar"
        >
          <X size={16} weight="bold" />
        </button>

        {/* ===================================================================== */}
        {/* ILUSTRAÇÃO: PESSOA CARREGANDO PINO VERMELHO GIGANTE COM CIDADE */}
        {/* ===================================================================== */}
        <div className="w-full flex justify-center mb-4">
          <svg viewBox="0 0 240 140" className="w-48 h-28" fill="none">
            {/* Silhueta suave dos prédios ao fundo */}
            <path
              d="M30 110 L30 80 L50 80 L50 65 L70 65 L70 110"
              fill="#FDE8EA"
              opacity="0.8"
            />
            <path
              d="M75 110 L75 55 L95 55 L95 70 L115 70 L115 110"
              fill="#FCE4E6"
              opacity="0.9"
            />
            <path
              d="M130 110 L130 50 L155 50 L155 110"
              fill="#FCE4E6"
              opacity="0.9"
            />
            <path
              d="M165 110 L165 75 L185 75 L185 60 L205 60 L205 110"
              fill="#FDE8EA"
              opacity="0.8"
            />

            {/* Pinos flutuantes pequenos no horizonte */}
            <g transform="translate(42, 60) scale(0.6)">
              <path
                d="M10 0 C4.5 0 0 4.5 0 10 C0 17.5 10 25 10 25 C10 25 20 17.5 20 10 C20 4.5 15.5 0 10 0 Z"
                fill="#F87171"
                opacity="0.7"
              />
              <circle cx="10" cy="10" r="3.5" fill="#FFFFFF" />
            </g>
            <g transform="translate(185, 52) scale(0.6)">
              <path
                d="M10 0 C4.5 0 0 4.5 0 10 C0 17.5 10 25 10 25 C10 25 20 17.5 20 10 C20 4.5 15.5 0 10 0 Z"
                fill="#F87171"
                opacity="0.7"
              />
              <circle cx="10" cy="10" r="3.5" fill="#FFFFFF" />
            </g>

            {/* Chão suave em sombra elíptica */}
            <ellipse cx="120" cy="128" rx="70" ry="8" fill="#F1F1F4" />

            {/* Pessoa carregando o pino */}
            {/* Pernas e pés */}
            <path
              d="M108 105 L106 126 L98 126"
              stroke="#D1B2A5"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M116 102 L128 122 L136 122"
              stroke="#D1B2A5"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Shorts */}
            <path
              d="M104 96 L122 96 L124 105 L113 105 L113 103 L104 105 Z"
              fill="#D1D5DB"
            />

            {/* Camisa listrada */}
            <path
              d="M106 82 L124 82 L122 98 L104 98 Z"
              fill="#FFFFFF"
            />
            <line x1="105" y1="86" x2="123" y2="86" stroke="#EF4444" strokeWidth="2" />
            <line x1="104" y1="91" x2="123" y2="91" stroke="#EF4444" strokeWidth="2" />
            <line x1="104" y1="96" x2="122" y2="96" stroke="#EF4444" strokeWidth="2" />

            {/* Braço segurando o pino */}
            <path
              d="M114 85 C108 85, 96 85, 100 75"
              stroke="#D1B2A5"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Cabeça e cabelo */}
            <circle cx="125" cy="74" r="5.5" fill="#D1B2A5" />
            <path
              d="M121 72 C121 68, 129 68, 130 72 Z"
              fill="#9CA3AF"
            />
            <circle cx="126" cy="75" r="1.5" fill="#3B82F6" /> {/* Fone de ouvido */}

            {/* PINO VERMELHO GIGANTE */}
            <g transform="translate(108, 12)">
              {/* Sombra suave interna do pino */}
              <path
                d="M14 0 C6.3 0 0 6.3 0 14 C0 24.5 14 38 14 38 C14 38 28 24.5 28 14 C28 6.3 21.7 0 14 0 Z"
                fill="#EA1D2C"
                className="filter drop-shadow-md"
              />
              {/* Brilho superior esquerdo do pino */}
              <path
                d="M14 2 C8 2 3 7 3 13 C3 16 4 19 6 22"
                stroke="#FF8A93"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Círculo branco central */}
              <circle cx="14" cy="14" r="5" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        {/* ===================================================================== */}
        {/* TÍTULO PRINCIPAL */}
        {/* ===================================================================== */}
        <h2
          id="modal-delivery-title"
          className="text-title-lg font-bold text-gray-700 text-center mb-6 leading-snug"
        >
          Onde você quer receber seu pedido?
        </h2>

        {/* ===================================================================== */}
        {/* CAMPO DE BUSCA DE ENDEREÇO */}
        {/* ===================================================================== */}
        <div className="relative mb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-red-base pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar endereço e número"
                className="w-full pl-11 pr-4 py-3 bg-[#F8F8F9] hover:bg-[#F2F2F4] focus:bg-white border border-transparent focus:border-gray-300 rounded-xl text-body-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-base/20 transition-all"
              />
            </div>
          </form>

          {/* Sugestões inteligentes ao digitar */}
          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-gray-50">
              {filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectAddress(item)
                    onClose()
                  }}
                  className="w-full px-4 py-2.5 text-left text-body-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                >
                  <MapPin size={16} className="text-red-base flex-shrink-0" weight="fill" />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* OPÇÃO: USAR MINHA LOCALIZAÇÃO */}
        {/* ===================================================================== */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="w-full text-left p-3.5 bg-white hover:bg-gray-50 border border-gray-200/80 hover:border-gray-300 rounded-2xl flex items-center gap-3 transition-all duration-200 group active:scale-98 shadow-sm mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0 transition-colors">
            <Crosshair size={22} weight="regular" className={isLocating ? 'animate-spin' : ''} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-body-sm font-semibold text-gray-700 group-hover:text-red-base transition-colors leading-tight">
              Usar minha localização
            </h3>
            <p className="text-body-xs text-gray-400 truncate mt-0.5">
              Próximo de Vila Claudia
            </p>
          </div>
        </button>

        {/* ===================================================================== */}
        {/* FOOTER: JÁ TEM UM ENDEREÇO SALVO? */}
        {/* ===================================================================== */}
        <div className="text-center pt-2 border-t border-gray-100/60">
          <p className="text-body-xs font-semibold text-gray-600">
            Já tem um endereço salvo?
          </p>
          <p className="text-body-xs text-gray-400 mt-0.5 mb-2.5">
            Entre na sua conta para selecionar seu endereço.
          </p>
          <button
            type="button"
            onClick={() => {
              navigate('/login')
              onClose()
            }}
            className="text-body-sm font-bold text-red-base hover:text-red-dark transition-colors inline-block active:scale-95 cursor-pointer"
          >
            Entrar ou cadastrar
          </button>
        </div>
      </div>
    </div>
  )
}
