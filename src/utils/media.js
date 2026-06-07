export const imageUrl = (path, size = 'w500') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

export const getTitle = (item) => item.title || item.name || 'Sin titulo';

export const getYear = (item) => (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';

export const getRating = (item) => (Number.isFinite(item.vote_average) ? item.vote_average.toFixed(1) : 'N/A');
