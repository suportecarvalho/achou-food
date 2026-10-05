import type { Style } from 'mapbox-gl'
import type { FeatureCollection } from 'geojson'

// Coordenadas centrais de Canela, RS
export const CANELA_CENTER: [number, number] = [-50.8143, -29.3630]

// Coordenadas da localização do usuário (Av. das Estrelas / Grande Hotel Canela)
export const USER_LOCATION: [number, number] = [-50.8145, -29.3630]

// Nomes e posições dos bairros e pontos de referência conforme design de referência
export const NEIGHBORHOOD_LABELS = [
  { name: 'SUZANA', coords: [-50.8220, -29.3560] as [number, number] },
  { name: 'LUIZA CORRÊA', coords: [-50.8140, -29.3585] as [number, number] },
  { name: 'SERRANO', coords: [-50.8060, -29.3575] as [number, number] },
  { name: 'SUÍÇA', coords: [-50.8235, -29.3620] as [number, number] },
  { name: 'SÃO JOSÉ', coords: [-50.8215, -29.3660] as [number, number] },
  { name: 'QUINTA DA SERRA', coords: [-50.8115, -29.3715] as [number, number] },
  { name: 'LAJE DE PEDRA', coords: [-50.8245, -29.3750] as [number, number] },
  { name: 'CENTRO', coords: [-50.8070, -29.3645] as [number, number] },
]

export const POI_LABELS = [
  { name: 'Grande Hotel Canela', coords: [-50.8130, -29.3635] as [number, number] },
  { name: 'Universidade de Caxias do Sul', coords: [-50.8110, -29.3695] as [number, number] },
]

export const ROAD_SHIELDS = [
  { code: '466', coords: [-50.8190, -29.3605] as [number, number] },
  { code: '235', coords: [-50.8198, -29.3630] as [number, number] },
]

// GeoJSON das Áreas Verdes / Parques de Canela (Quinta da Serra, Laje de Pedra, Suzana)
export const PARKS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Parque Laje de Pedra' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8290, -29.3710],
          [-50.8210, -29.3700],
          [-50.8215, -29.3755],
          [-50.8240, -29.3785],
          [-50.8285, -29.3770],
          [-50.8290, -29.3710],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Quinta da Serra' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8135, -29.3695],
          [-50.8090, -29.3685],
          [-50.8080, -29.3735],
          [-50.8120, -29.3740],
          [-50.8135, -29.3695],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Bosque Central Canela' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8175, -29.3670],
          [-50.8140, -29.3660],
          [-50.8145, -29.3690],
          [-50.8170, -29.3695],
          [-50.8175, -29.3670],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Parque Suzana / Luiza' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8170, -29.3560],
          [-50.8120, -29.3550],
          [-50.8135, -29.3590],
          [-50.8165, -29.3585],
          [-50.8170, -29.3560],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Área Verde Leste' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8050, -29.3700],
          [-50.8010, -29.3695],
          [-50.8015, -29.3740],
          [-50.8055, -29.3735],
          [-50.8050, -29.3700],
        ]],
      },
    },
  ],
}

// GeoJSON dos Corpos d'Água (Lago Luiza Corrêa e Lago Laje de Pedra)
export const WATER_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Lago Luiza Corrêa' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8135, -29.3570],
          [-50.8128, -29.3565],
          [-50.8120, -29.3580],
          [-50.8115, -29.3605],
          [-50.8105, -29.3620],
          [-50.8115, -29.3625],
          [-50.8125, -29.3605],
          [-50.8132, -29.3585],
          [-50.8135, -29.3570],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Lago Laje de Pedra' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-50.8280, -29.3740],
          [-50.8255, -29.3735],
          [-50.8250, -29.3755],
          [-50.8275, -29.3760],
          [-50.8280, -29.3740],
        ]],
      },
    },
  ],
}

// GeoJSON da Malha Viária de Canela (Ruas Brancas e Avenidas mais Largas)
export const ROADS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Rodovia RS-235 / Av. das Hortênsias (Avenida Principal Larga)
    {
      type: 'Feature',
      properties: { type: 'primary', name: 'RS-235 / Av. das Hortênsias' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8300, -29.3685],
          [-50.8220, -29.3650],
          [-50.8150, -29.3630],
          [-50.8080, -29.3620],
          [-50.8000, -29.3610],
        ],
      },
    },
    // Rodovia RS-466 (Estrada do Caracol)
    {
      type: 'Feature',
      properties: { type: 'primary', name: 'RS-466' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8150, -29.3630],
          [-50.8170, -29.3580],
          [-50.8185, -29.3520],
          [-50.8190, -29.3480],
        ],
      },
    },
    // Av. Osvaldo Aranha / Rua Felisberto Soares (Eixo Comercial)
    {
      type: 'Feature',
      properties: { type: 'primary', name: 'Av. Osvaldo Aranha' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8250, -29.3600],
          [-50.8180, -29.3615],
          [-50.8120, -29.3625],
          [-50.8050, -29.3638],
        ],
      },
    },
    // Av. Júlio de Castilhos
    {
      type: 'Feature',
      properties: { type: 'primary', name: 'Av. Júlio de Castilhos' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8130, -29.3520],
          [-50.8110, -29.3570],
          [-50.8090, -29.3640],
          [-50.8075, -29.3720],
          [-50.8060, -29.3780],
        ],
      },
    },
    // Rua das Palmeiras (Doce Aroma)
    {
      type: 'Feature',
      properties: { type: 'secondary', name: 'Rua das Palmeiras' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8180, -29.3640],
          [-50.8143, -29.3644],
          [-50.8100, -29.3650],
        ],
      },
    },
    // Rua Borges de Medeiros Canela
    {
      type: 'Feature',
      properties: { type: 'secondary', name: 'Rua Borges de Medeiros' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8150, -29.3630],
          [-50.8145, -29.3670],
          [-50.8135, -29.3720],
          [-50.8120, -29.3780],
        ],
      },
    },
    // Acesso Laje de Pedra (Rua Florida)
    {
      type: 'Feature',
      properties: { type: 'secondary', name: 'Rua Florida' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8260, -29.3660],
          [-50.8250, -29.3710],
          [-50.8270, -29.3750],
          [-50.8280, -29.3780],
        ],
      },
    },
    // Malha urbana residencial secundária (Ruas brancas da grade de Canela)
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8260, -29.3580], [-50.8200, -29.3575], [-50.8150, -29.3590]],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8230, -29.3520], [-50.8220, -29.3600], [-50.8200, -29.3680]],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8180, -29.3550], [-50.8100, -29.3560], [-50.8040, -29.3570]],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8190, -29.3660], [-50.8130, -29.3675], [-50.8060, -29.3685]],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8210, -29.3700], [-50.8150, -29.3710], [-50.8080, -29.3725]],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8090, -29.3580], [-50.8080, -29.3660], [-50.8070, -29.3740]],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [[-50.8050, -29.3600], [-50.8040, -29.3670], [-50.8030, -29.3740]],
      },
    },
    // Faixa Sudoeste / Aeródromo Canela (pista destacada com listras do print)
    {
      type: 'Feature',
      properties: { type: 'runway' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-50.8290, -29.3680],
          [-50.8210, -29.3645],
        ],
      },
    },
  ],
}

// Cria GeoJSON da rota entre a localização do usuário e o restaurante de destino
export function createRouteGeoJson(
  userCoords: [number, number],
  destCoords: [number, number]
): FeatureCollection {
  // Gera uma rota realista seguindo as vias entre os dois pontos
  const midPointLng = userCoords[0] + (destCoords[0] - userCoords[0]) * 0.45
  const midPointLat = userCoords[1] + (destCoords[1] - userCoords[1]) * 0.25

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            userCoords,
            [midPointLng, userCoords[1]],
            [midPointLng, midPointLat],
            [destCoords[0], midPointLat],
            destCoords,
          ],
        },
      },
    ],
  }
}

// Estilo customizado do Mapbox GL JS com a paleta exata da referência:
// - Fundo bege claro: #EAE9E2
// - Ruas brancas: #FFFFFF com casing sutil
// - Avenidas mais largas
// - Áreas verdes suaves: #CFE7B9 / #D4EAC4
// - Água azul: #6BBDE7
export function createCanelaMapStyle(): Style {
  return {
    version: 8,
    name: 'Achou Food Canela Studio Style',
    sources: {
      'canela-parks': {
        type: 'geojson',
        data: PARKS_GEOJSON,
      },
      'canela-water': {
        type: 'geojson',
        data: WATER_GEOJSON,
      },
      'canela-roads': {
        type: 'geojson',
        data: ROADS_GEOJSON,
      },
      'nav-route': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
    },
    layers: [
      // 1. Fundo Bege Claro (#EAE9E2)
      {
        id: 'canela-background',
        type: 'background',
        paint: {
          'background-color': '#EAE9E2',
        },
      },
      // 2. Áreas Verdes Suaves (#CFE7B9 / #D4EAC4)
      {
        id: 'canela-parks-fill',
        type: 'fill',
        source: 'canela-parks',
        paint: {
          'fill-color': '#D4EAC4',
          'fill-opacity': 0.88,
        },
      },
      // 3. Corpos d'Água (#6BBDE7)
      {
        id: 'canela-water-fill',
        type: 'fill',
        source: 'canela-water',
        paint: {
          'fill-color': '#6BBDE7',
          'fill-opacity': 0.95,
        },
      },
      // 4. Faixa de Pista / Aeródromo Sudoeste
      {
        id: 'canela-runway-casing',
        type: 'line',
        source: 'canela-roads',
        filter: ['==', ['get', 'type'], 'runway'],
        layout: {
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#D8DCE4',
          'line-width': 16,
        },
      },
      {
        id: 'canela-runway-dash',
        type: 'line',
        source: 'canela-roads',
        filter: ['==', ['get', 'type'], 'runway'],
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2,
          'line-dasharray': [3, 2],
        },
      },
      // 5. Ruas Residenciais / Secundárias (Casing e Miolo Branco)
      {
        id: 'canela-roads-sec-casing',
        type: 'line',
        source: 'canela-roads',
        filter: ['in', ['get', 'type'], ['literal', ['residential', 'secondary']]],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#E0DED7',
          'line-width': 5.5,
        },
      },
      {
        id: 'canela-roads-sec',
        type: 'line',
        source: 'canela-roads',
        filter: ['in', ['get', 'type'], ['literal', ['residential', 'secondary']]],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 4,
        },
      },
      // 6. Avenidas Principais mais Largas (Casing e Miolo Branco)
      {
        id: 'canela-roads-primary-casing',
        type: 'line',
        source: 'canela-roads',
        filter: ['==', ['get', 'type'], 'primary'],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#D8D6CE',
          'line-width': 10,
        },
      },
      {
        id: 'canela-roads-primary',
        type: 'line',
        source: 'canela-roads',
        filter: ['==', ['get', 'type'], 'primary'],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 8,
        },
      },
      // 7. Rota de Navegação (Traçado pontilhado vermelho conectando à loja)
      {
        id: 'nav-route-glow',
        type: 'line',
        source: 'nav-route',
        paint: {
          'line-color': '#EA1D2C',
          'line-width': 8,
          'line-opacity': 0.2,
          'line-blur': 2,
        },
      },
      {
        id: 'nav-route-line',
        type: 'line',
        source: 'nav-route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#EA1D2C',
          'line-width': 3.5,
          'line-dasharray': [2, 1.5],
        },
      },
    ],
  }
}
