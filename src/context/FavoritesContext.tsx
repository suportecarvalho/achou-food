import React, { createContext, useContext, useState, useEffect } from 'react'

interface FavoritesContextType {
  favorites: string[]
  isFavorite: (restaurantId: string) => boolean
  toggleFavorite: (restaurantId: string) => void
  removeFavorite: (restaurantId: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('achou_food_favorites')
      return stored ? JSON.parse(stored) : ['rest-1', 'rest-2'] // Pre-populate Cafeteria das Nuvens and Doce Encanto
    } catch {
      return ['rest-1', 'rest-2']
    }
  })

  useEffect(() => {
    localStorage.setItem('achou_food_favorites', JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId)

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    )
  }

  const removeFavorite = (restaurantId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== restaurantId))
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
