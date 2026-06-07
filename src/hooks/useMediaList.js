import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPopularMedia, searchMoviesAndSeries } from '../api/tmdb';

const initialPagination = {
  page: 0,
  totalPages: 1,
  totalResults: 0,
};

export const useMediaList = ({ mediaType = 'movie', query = '' }) => {
  const normalizedQuery = query.trim();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const hasMore = useMemo(() => pagination.page < pagination.totalPages, [pagination.page, pagination.totalPages]);

  const fetchPage = useCallback(
    async (pageToLoad, options = {}) => {
      if (normalizedQuery) {
        const data = await searchMoviesAndSeries(normalizedQuery, { page: pageToLoad, signal: options.signal });
        const filteredResults = data.results.filter((item) => item.media_type === mediaType);

        return {
          ...data,
          results: filteredResults,
        };
      }

      return getPopularMedia(mediaType, pageToLoad);
    },
    [mediaType, normalizedQuery],
  );

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const loadFirstPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPage(1, { signal: controller.signal });

        if (isActive) {
          setItems(data.results);
          setPagination({
            page: data.page,
            totalPages: data.totalPages,
            totalResults: data.totalResults,
          });
        }
      } catch (requestError) {
        if (isActive && requestError.name !== 'CanceledError' && requestError.name !== 'AbortError') {
          setItems([]);
          setError('No pudimos cargar el catalogo. Intentalo de nuevo mas tarde.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadFirstPage();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      const nextPage = pagination.page + 1;
      const data = await fetchPage(nextPage);

      setItems((currentItems) => [...currentItems, ...data.results]);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        totalResults: data.totalResults,
      });
    } catch {
      setError('No pudimos cargar mas titulos ahora mismo.');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, loadingMore, pagination.page]);

  return {
    error,
    hasMore,
    items,
    loading,
    loadingMore,
    loadMore,
    pagination,
  };
};
