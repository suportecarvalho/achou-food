import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import * as maplibregl from 'maplibre-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Restaurant } from '@/types'
import { RestaurantBadge } from '@/components/common/RestaurantBadge'
import { cn } from '@/lib/utils'
import {
  CANELA_CENTER,
  USER_LOCATION,
  NEIGHBORHOOD_LABELS,
  POI_LABELS,
  ROAD_SHIELDS,
  createCanelaMapStyle,
  createRouteGeoJson,
} from './canelaMapboxStyle'

// Verifica se o usuário forneceu um token válido do Mapbox Studio no .env
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

// Mecanismo cartográfico: Mapbox GL JS (com token) ou MapLibre GL (compatível com a especificação Mapbox sem exigir autenticação na nuvem)
const MapEngine: any = hasValidMapboxToken ? mapboxgl : maplibregl

interface RestaurantMapProps {
  restaurants: Restaurant[]
  onSelectRestaurant?: (restaurant: Restaurant) => void
  initialSelectedId?: string
}

// Cálculo preciso da distância em KM entre dois pontos de coordenadas
function getDistanceInKm(coord1: [number, number], coord2: [number, number]): string {
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d < 1 ? `${Math.round(d * 1000)}M` : `${d.toFixed(1).replace('.', ',')}KM`
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  onSelectRestaurant,
  initialSelectedId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const staticMarkersRef = useRef<any[]>([])

  // Seleciona Doce Aroma por padrão ou o primeiro restaurante disponível
  const defaultRest = useMemo(() => {
    if (initialSelectedId) {
      return restaurants.find((r) => r.id === initialSelectedId) || restaurants[0] || null
    }
    return (
      restaurants.find((r) => r.id === 'rest-doce-aroma') ||
      restaurants[0] ||
      null
    )
  }, [restaurants, initialSelectedId])

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(defaultRest)

  // 1. Inicialização do Mapa Mapbox GL JS com Estilo Customizado Canela
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Se o usuário configurou uma URL de estilo no Mapbox Studio, usa ela; senão usa o estilo fiel em código
    const customStyleUrl = import.meta.env.VITE_MAPBOX_STYLE_URL
    const initialStyle =
      hasValidMapboxToken && customStyleUrl
        ? customStyleUrl
        : createCanelaMapStyle()

    const map = new MapEngine.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: CANELA_CENTER,
      zoom: 14.15,
      minZoom: 12,
      maxZoom: 18,
      attributionControl: false,
      dragRotate: false,
      touchPitch: false,
    })

    mapRef.current = map

    map.on('load', () => {
      // Cria marcador da Localização do Usuário (Av. das Estrelas - Ponto vermelho com halo)
      const userEl = document.createElement('div')
      userEl.className = 'user-location-marker relative flex items-center justify-center'
      userEl.innerHTML = `
        <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#8F141F] opacity-30"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-white shadow-md items-center justify-center border border-white">
          <span class="h-2.5 w-2.5 rounded-full bg-[#8F141F]"></span>
        </span>
      `
      new MapEngine.Marker({ element: userEl, anchor: 'center' })
        .setLngLat(USER_LOCATION)
        .addTo(map)

      // Adiciona Rótulos dos Bairros conforme design de referência
      NEIGHBORHOOD_LABELS.forEach((item) => {
        const labelEl = document.createElement('div')
        labelEl.className =
          'pointer-events-none select-none text-[#647B97] font-bold text-[11px] tracking-[1.4px] uppercase text-center opacity-85 leading-tight font-sans'
        labelEl.innerText = item.name

        const marker = new MapEngine.Marker({ element: labelEl, anchor: 'center' })
          .setLngLat(item.coords)
          .addTo(map)
        staticMarkersRef.current.push(marker)
      })

      // Cidade Canela em destaque no Centro
      const canelaCityEl = document.createElement('div')
      canelaCityEl.className =
        'pointer-events-none select-none text-[#1F1818] font-bold text-[15px] font-sans'
      canelaCityEl.innerText = 'Canela'
      const canelaMarker = new MapEngine.Marker({ element: canelaCityEl, anchor: 'center' })
        .setLngLat([-50.8070, -29.3630])
        .addTo(map)
      staticMarkersRef.current.push(canelaMarker)

      // Pontos de Referência (Grande Hotel, Universidade)
      POI_LABELS.forEach((poi) => {
        const poiEl = document.createElement('div')
        poiEl.className =
          'pointer-events-none select-none text-[#78889B] font-medium text-[8.5px] leading-tight text-center font-sans'
        poiEl.innerText = poi.name

        const marker = new MapEngine.Marker({ element: poiEl, anchor: 'center' })
          .setLngLat(poi.coords)
          .addTo(map)
        staticMarkersRef.current.push(marker)
      })

      // Escudos das Rodovias 466 e 235
      ROAD_SHIELDS.forEach((shield) => {
        const shieldEl = document.createElement('div')
        shieldEl.className =
          'pointer-events-none select-none bg-white text-[#1E293B] border border-[#64748B] text-[7.5px] font-bold font-mono px-1 rounded shadow-xs'
        shieldEl.innerText = shield.code

        const marker = new MapEngine.Marker({ element: shieldEl, anchor: 'center' })
          .setLngLat(shield.coords)
          .addTo(map)
        staticMarkersRef.current.push(marker)
      })

      // Inicializa rota para o restaurante selecionado
      if (defaultRest && map.getSource('nav-route')) {
        const routeData = createRouteGeoJson(USER_LOCATION, [
          defaultRest.longitude,
          defaultRest.latitude,
        ])
        map.getSource('nav-route').setData(routeData)
      }
    })

    const handleResize = () => {
      map.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      // Limpeza dos marcadores estáticos e do mapa
      staticMarkersRef.current.forEach((m) => m.remove())
      staticMarkersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 2. Renderização Dinâmica dos Marcadores de Restaurantes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove marcadores anteriores que não estão mais na lista
    const currentIds = new Set(restaurants.map((r) => r.id))
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

    // Adiciona ou atualiza marcadores dos restaurantes
    restaurants.forEach((restaurant) => {
      const isSelected = selectedRestaurant?.id === restaurant.id

      if (markersRef.current[restaurant.id]) {
        // Atualiza estilo do elemento existente
        const el = markersRef.current[restaurant.id].getElement()
        el.className = cn(
          'marker-restaurant cursor-pointer transition-all duration-300 transform flex items-center justify-center shadow-lg',
          isSelected
            ? 'w-10 h-10 bg-red-base text-white rounded-xl border-2 border-white ring-4 ring-red-base/20 scale-110 z-30'
            : 'w-8 h-8 bg-[#1F1818] text-white rounded-lg border-2 border-white hover:scale-105 opacity-90 z-20'
        )
      } else {
        // Cria novo elemento para o marcador do restaurante
        const el = document.createElement('button')
        el.type = 'button'
        el.setAttribute('aria-label', `Selecionar ${restaurant.name}`)
        el.className = cn(
          'marker-restaurant cursor-pointer transition-all duration-300 transform flex items-center justify-center shadow-lg',
          isSelected
            ? 'w-10 h-10 bg-red-base text-white rounded-xl border-2 border-white ring-4 ring-red-base/20 scale-110 z-30'
            : 'w-8 h-8 bg-[#1F1818] text-white rounded-lg border-2 border-white hover:scale-105 opacity-90 z-20'
        )

        // Ícone Storefront em SVG
        el.innerHTML = `
          <svg width="${isSelected ? 20 : 16}" height="${isSelected ? 20 : 16}" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,96v16a8,8,0,0,1-8,8,40,40,0,0,1-40-40V96H80v-16A40,40,0,0,1,40,120a8,8,0,0,1-8-8V96A16,16,0,0,1,45.47,81.82l18.49-55.47A16,16,0,0,1,79.14,16H176.86a16,16,0,0,1,15.18,10.35l18.49,55.47A16,16,0,0,1,224,96ZM208,135.2V208a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V135.2a55.66,55.66,0,0,0,32-4.14V176a8,8,0,0,0,16,0V120a56.12,56.12,0,0,0,64,0v56a8,8,0,0,0,16,0V131.06A55.66,55.66,0,0,0,208,135.2Z"/>
          </svg>
        `

        el.addEventListener('click', (e) => {
          e.stopPropagation()
          setSelectedRestaurant(restaurant)
          onSelectRestaurant?.(restaurant)

          // Anima suavemente para centralizar o restaurante
          map.flyTo({
            center: [restaurant.longitude, restaurant.latitude],
            zoom: 15,
            duration: 700,
            essential: true,
          })
        })

        const marker = new MapEngine.Marker({ element: el, anchor: 'center' })
          .setLngLat([restaurant.longitude, restaurant.latitude])
          .addTo(map)

        markersRef.current[restaurant.id] = marker
      }
    })
  }, [restaurants, selectedRestaurant, onSelectRestaurant])

  // 3. Atualização da Rota de Navegação quando o Restaurante Selecionado muda
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedRestaurant) return

    const updateRoute = () => {
      if (map.getSource('nav-route')) {
        const routeData = createRouteGeoJson(USER_LOCATION, [
          selectedRestaurant.longitude,
          selectedRestaurant.latitude,
        ])
        map.getSource('nav-route').setData(routeData)
      }
    }

    if (map.isStyleLoaded()) {
      updateRoute()
    } else {
      map.once('load', updateRoute)
    }
  }, [selectedRestaurant])

  // 4. Ajuste Automático do Enquadramento (Fit Bounds) quando os restaurantes mudam
  useEffect(() => {
    const map = mapRef.current
    if (!map || restaurants.length === 0) return

    const bounds = new MapEngine.LngLatBounds()
    restaurants.forEach((r) => bounds.extend([r.longitude, r.latitude]))
    bounds.extend(USER_LOCATION)

    map.fitBounds(bounds, {
      padding: { top: 180, bottom: 130, left: 40, right: 40 },
      maxZoom: 15.5,
      duration: 800,
    })
  }, [restaurants.length])

  // Metadados dinâmicos calculados para o card
  const selectedMeta = useMemo(() => {
    if (!selectedRestaurant) {
      return { distance: '1,2KM', time: 'ATÉ 30 MIN' }
    }
    const dist = getDistanceInKm(USER_LOCATION, [
      selectedRestaurant.longitude,
      selectedRestaurant.latitude,
    ])
    return {
      distance: dist,
      time: `ATÉ ${selectedRestaurant.deliveryTime.split('-')[1]?.trim() || '30 MIN'}`,
    }
  }, [selectedRestaurant])

  return (
    <div className="relative w-full h-full flex-1 min-h-[calc(100vh-130px)] sm:min-h-[720px] overflow-hidden select-none bg-[#EAE9E2] flex flex-col">
      {/* ========================================================================= */}
      {/* MAPBOX GL JS CANVAS CONTAINER */}
      {/* ========================================================================= */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* ========================================================================= */}
      {/* CARD FLUTUANTE DO RESTAURANTE SELECIONADO (HTML/CSS com bordas arredondadas e sombras suaves) */}
      {/* ========================================================================= */}
      {selectedRestaurant && (
        <div className="absolute top-[84px] left-5 right-5 z-30 animate-fadeIn">
          <Link
            to={`/restaurant/${selectedRestaurant.id}`}
            className="group flex items-center gap-3.5 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-gray-200/90 transition-all duration-200 hover:shadow-xl hover:border-gray-300 block active:scale-[0.99]"
          >
            {/* Badge do restaurante */}
            <RestaurantBadge
              name={selectedRestaurant.name}
              slug={selectedRestaurant.id}
              size="md"
            />

            {/* Detalhes com distância e tempo calculados */}
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="text-title-md font-semibold text-gray-700 group-hover:text-red-base transition-colors truncate">
                {selectedRestaurant.name}
              </h3>
              <p className="text-body-xs text-gray-400 truncate mt-0.5">
                {selectedRestaurant.address} - {selectedRestaurant.neighborhood}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                A {selectedMeta.distance} • {selectedMeta.time}
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
