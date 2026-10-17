export const MOVIE_CATEGORIES = [
  { id: 28, name: 'Acción' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 14, name: 'Fantasía' },
  { id: 36, name: 'Historia' },
  { id: 27, name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648, name: 'Misterio' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ciencia ficción' },
  { id: 53, name: 'Suspenso' },
  { id: 10752, name: 'Bélica' },
  { id: 37, name: 'Western' },
];

export const TV_CATEGORIES = [
  { id: 10759, name: 'Acción y Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 10762, name: 'Infantil' },
  { id: 9648, name: 'Misterio' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasía' },
  { id: 10766, name: 'Telenovela' },
  { id: 10768, name: 'Guerra y Política' },
  { id: 37, name: 'Western' },
];

export const getCategories = (mediaType = 'movie') => {
  return mediaType === 'tv' ? TV_CATEGORIES : MOVIE_CATEGORIES;
};

export const getCategoryName = (id, mediaType = 'movie') => {
  if (!id) return '';
  const categories = getCategories(mediaType);
  const found = categories.find((c) => String(c.id) === String(id));
  return found ? found.name : '';
};
