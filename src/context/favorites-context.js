import { createContext } from 'react';

export const FavoritesContext = createContext({
  favorites: [],
  favoritesCount: 0,
  isFavorite: () => false,
  toggleFavorite: () => {},
  clearFavorites: () => {},
});
