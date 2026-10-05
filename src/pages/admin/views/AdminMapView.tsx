import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import * as maplibregl from 'maplibre-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  MapPin,
  Storefront,
  Crosshair,
  MagnifyingGlass,
  CheckCircle,
  Copy,
  SlidersHorizontal,
  Compass,
} from '@phosphor-icons/react'
import { useAdmin } from '@/context/AdminContext'
import { AdminRestaurant } from '@/types/admin'
import { createCanelaMapStyle, CANELA_CENTER } from '@/components/map/canelaMapboxStyle'
import { formatCurrency } from '@/lib/utils'

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''
const hasValidMapboxToken = Boolean(
  mapboxToken &&
    mapboxToken.startsWith('pk.') &&
    !mapboxToken.includes('your-token') &&
    !mapboxToken.includes('pk.eyJ1I... ')
)

if (hasValidMapboxToken) {
  mapboxgl.accessToken = mapboxToken
}

const MapEngine: any = hasValidMapboxToken ? mapboxgl : maplibregl

export const AdminMapView: React.FC = () => {
  const { restaurants, settings, updateRestaurant } = useAdmin()
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})

  const [selectedRest, setSelectedRest] = useState<AdminRestaurant | null>(restaurants[0] || null)
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // 1. Inicializa o Mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const customStyleUrl = import.meta.env.VITE_MAPBOX_STYLE_URL
    const initialStyle =
      hasValidMapboxToken && customStyleUrl
        ? customStyleUrl
        : createCanelaMapStyle()

    const map = new MapEngine.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [settings.cityCenter.lng, settings.cityCenter.lat],
      zoom: 14.2,
      minZoom: 11,
      maxZoom: 18,
    })

    map.addControl(new MapEngine.NavigationControl({ showCompass: true }), 'top-right')

    map.on('click', (e: any) => {
      const { lng, lat } = e.lngLat
      setClickedCoords({ lat, lng })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [settings.cityCenter])

  // 2. Renderiza os Marcadores dos Estabelecimentos
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Limpa marcadores antigos
    Object.values(markersRef.current).forEach((m: any) => m.remove())
    markersRef.current = {}

    restaurants.forEach((rest) => {
      const el = document.createElement('div')
      el.className = 'group cursor-pointer'

      const isSelected = selectedRest?.id === rest.id
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="px-2 py-1 bg-white/95 backdrop-blur-xs rounded-lg shadow-md border border-gray-200 text-[10px] font-bold text-gray-800 whitespace-nowrap mb-1">
            ${rest.name}
          </div>
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${
            isSelected ? 'bg-red-base scale-125 ring-4 ring-red-base/20' : 'bg-gray-800 hover:bg-red-base'
          }">
            <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
              <path d="M224,96v16a40,40,0,0,1-40,40H72a40,40,0,0,1-40-40V96A16,16,0,0,1,48,80H208A16,16,0,0,1,224,96Z"></path>
            </svg>
          </div>
        </div>
      `

      el.addEventListener('click', (ev) => {
        ev.stopPropagation()
        setSelectedRest(rest)
        map.flyTo({
          center: [rest.longitude, rest.latitude],
          zoom: 15.5,
          speed: 1.2,
        })
      })

      const marker = new MapEngine.Marker({ element: el })
        .setLngLat([rest.longitude, rest.latitude])
        .addTo(map)

      markersRef.current[rest.id] = marker
    })
  }, [restaurants, selectedRest])

  const flyToRestaurant = (rest: AdminRestaurant) => {
    setSelectedRest(rest)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [rest.longitude, rest.latitude],
        zoom: 15.5,
        speed: 1.2,
      })
    }
  }

  const copyCoords = () => {
    if (!clickedCoords) return
    navigator.clipboard.writeText(`${clickedCoords.lat.toFixed(6)}, ${clickedCoords.lng.toFixed(6)}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Mapa de Estabelecimentos & Geolocalização (Mapbox)
          </h2>
          <p className="text-xs text-gray-500">
            Visualize as coordenadas reais dos parceiros e inspecione pontos em Canela para novos cadastros.
          </p>
        </div>

        {clickedCoords && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs shadow-2xs">
            <Crosshair size={16} className="text-red-base" weight="bold" />
            <span className="text-gray-700 font-mono">
              {clickedCoords.lat.toFixed(5)}, {clickedCoords.lng.toFixed(5)}
            </span>
            <button
              onClick={copyCoords}
              className="text-red-base hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Copy size={13} />
              {copied ? 'Copiado!' : 'Copiar GPS'}
            </button>
          </div>
        )}
      </div>

      {/* Grid Principal: Lista Lateral + Container do Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-230px)] min-h-[500px]">
        {/* Painel Esquerdo: Lista de Lojas e Filtro */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex flex-col h-full">
          <div className="relative mb-3">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no mapa..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white outline-hidden focus:border-red-base"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
            {filtered.map((rest) => {
              const isSelected = selectedRest?.id === rest.id
              return (
                <div
                  key={rest.id}
                  onClick={() => flyToRestaurant(rest)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-50/80 border border-red-200 text-red-base'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{rest.name}</h4>
                      <p className="text-[11px] text-gray-500">{rest.categoryName} • {rest.neighborhood}</p>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        rest.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rest.status}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] text-gray-400 font-mono flex items-center justify-between">
                    <span>GPS: {rest.latitude.toFixed(4)}, {rest.longitude.toFixed(4)}</span>
                    <span className="font-semibold text-gray-600">Raio: {rest.deliveryRadiusKm}km</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dica de Coordenadas */}
          <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
            <Compass size={14} className="text-red-base flex-shrink-0" />
            <span>Clique em qualquer ponto do mapa para capturar a coordenada exata.</span>
          </div>
        </div>

        {/* Painel Direito: Mapa Mapbox */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs">
          <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

          {/* Card Flutuante de Detalhes do Restaurante Selecionado */}
          {selectedRest && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200/80 text-xs animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <img
                  src={selectedRest.imageUrl}
                  alt={selectedRest.name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 truncate">{selectedRest.name}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{selectedRest.address}</p>
                  <p className="text-[10px] text-red-base font-bold mt-0.5">
                    {formatCurrency(selectedRest.deliveryFee)} entrega • {selectedRest.deliveryRadiusKm} km raio
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
