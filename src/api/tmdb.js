import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

if (!API_KEY || !BASE_URL) {
  throw new Error('Faltan Variables de entorno de TMDB')
}

const mediaEndpoints = {
  movie: {
    details: (id) => `/movie/${id}`,
    popular: '/movie/popular',
  },
  tv: {
    details: (id) => `/tv/${id}`,
    popular: '/tv/popular',
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

export const getPopularMedia = async (mediaType, page = 1) => {
  try {
    const endpoint = mediaEndpoints[mediaType]?.popular;

    if (!endpoint) {
      throw new Error(`Unsupported media type: ${mediaType}`);
    }

    const response = await tmdbApi.get(endpoint, {
      params: { page },
    });

    return toPaginatedResponse(response.data);
  } catch (error) {
    console.error('Error fetching popular media:', error);
    throw error;
  }
};

export const getPopularMovies = async (page = 1) => {
  const data = await getPopularMedia('movie', page);
  return data.results;
};

export const getPopularSeries = async (page = 1) => {
  const data = await getPopularMedia('tv', page);
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
