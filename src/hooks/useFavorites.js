import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTitle, getYear } from '../utils/media';

const FAVORITES_KEY = 'kalcinehd:favorites';

const readFavorites = () => {
  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
};

const normalizeFavorite = (item, mediaType) => ({
  id: item.id,
  mediaType: item.media_type || mediaType,
  title: getTitle(item),
  year: getYear(item),
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  vote_average: item.vote_average,
  overview: item.overview,
});

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => readFavorites());

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => `${item.mediaType}:${item.id}`)),
    [favorites],
  );

  const isFavorite = useCallback(
    (id, mediaType) => favoriteIds.has(`${mediaType}:${id}`),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((item, mediaType) => {
    const favorite = normalizeFavorite(item, mediaType);
    const key = `${favorite.mediaType}:${favorite.id}`;

    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((currentItem) => `${currentItem.mediaType}:${currentItem.id}` === key);

      if (exists) {
        return currentFavorites.filter((currentItem) => `${currentItem.mediaType}:${currentItem.id}` !== key);
      }

      return [favorite, ...currentFavorites];
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
};
