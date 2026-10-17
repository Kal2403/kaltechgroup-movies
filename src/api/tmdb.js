import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.warn('Advertencia: Falta la variable de entorno VITE_TMDB_API_KEY. Configurala en tu archivo .env');
}

const mediaEndpoints = {
  movie: {
    details: (id) => `/movie/${id}`,
    popular: '/movie/popular',
    discover: '/discover/movie',
  },
  tv: {
    details: (id) => `/tv/${id}`,
    popular: '/tv/popular',
    discover: '/discover/tv',
  },
};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES',
  },
});

const toPaginatedResponse = (data) => ({
  results: data.results || [],
  page: data.page || 1,
  totalPages: data.total_pages || 1,
  totalResults: data.total_results || 0,
});

export const getPopularMedia = async (mediaType, page = 1, genreId = null) => {
  try {
    const config = mediaEndpoints[mediaType];

    if (!config) {
      throw new Error(`Unsupported media type: ${mediaType}`);
    }

    if (genreId) {
      const response = await tmdbApi.get(config.discover, {
        params: {
          page,
          with_genres: genreId,
          sort_by: 'popularity.desc',
          include_adult: false,
        },
      });
      return toPaginatedResponse(response.data);
    }

    const response = await tmdbApi.get(config.popular, {
      params: { page },
    });

    return toPaginatedResponse(response.data);
  } catch (error) {
    console.error('Error fetching popular media:', error);
    throw error;
  }
};

export const getPopularMovies = async (page = 1, genreId = null) => {
  const data = await getPopularMedia('movie', page, genreId);
  return data.results;
};

export const getPopularSeries = async (page = 1, genreId = null) => {
  const data = await getPopularMedia('tv', page, genreId);
  return data.results;
};

export const getMediaDetails = async (mediaType, id) => {
  try {
    const endpoint = mediaEndpoints[mediaType]?.details(id);

    if (!endpoint) {
      throw new Error(`Unsupported media type: ${mediaType}`);
    }

    const response = await tmdbApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw error;
  }
};

export const getMovieDetails = (id) => getMediaDetails('movie', id);

export const getSeriesDetails = (id) => getMediaDetails('tv', id);

export const getMediaVideos = async (mediaType, id) => {
  try {
    // Primero intentamos obtener videos en idioma es-ES
    let response = await tmdbApi.get(`/${mediaType}/${id}/videos`);
    let videos = response.data?.results || [];

    // Fallback: Si no hay videos en espanol, consultamos en ingles
    if (videos.length === 0) {
      const fallbackResponse = await tmdbApi.get(`/${mediaType}/${id}/videos`, {
        params: { language: 'en-US' },
      });
      videos = fallbackResponse.data?.results || [];
    }

    // Filtrar videos de YouTube
    const ytVideos = videos.filter((v) => v.site === 'YouTube');

    // Priorizar Trailer oficial, luego cualquier Trailer, luego Teaser, luego el primero disponible
    const trailer =
      ytVideos.find((v) => v.type === 'Trailer' && v.official) ||
      ytVideos.find((v) => v.type === 'Trailer') ||
      ytVideos.find((v) => v.type === 'Teaser') ||
      ytVideos[0] ||
      null;

    return {
      trailer,
      allVideos: ytVideos,
    };
  } catch (error) {
    console.error('Error fetching media videos:', error);
    return { trailer: null, allVideos: [] };
  }
};

export const getMoviesNowPlaying = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

export const getTrendingAll = async () => {
  try {
    const response = await tmdbApi.get('/trending/all/week');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending content:', error);
    throw error;
  }
};

export const searchMoviesAndSeries = async (query, options = {}) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      signal: options.signal,
      params: {
        query,
        include_adult: false,
        page: options.page || 1,
      },
    });

    const data = toPaginatedResponse(response.data);

    return {
      ...data,
      results: data.results.filter((item) => item.media_type === 'movie' || item.media_type === 'tv'),
    };
  } catch (error) {
    if (error.name !== 'CanceledError') {
      console.error('Error searching movies and series:', error);
    }
    throw error;
  }
};
