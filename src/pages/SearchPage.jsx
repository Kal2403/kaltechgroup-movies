import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { searchMoviesAndSeries } from '../api/tmdb';
import { useFavorites } from '../hooks/useFavorites';
import { imageUrl } from '../utils/media';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalResults: 0 });
  const [loading, setLoading] = useState(Boolean(query));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const background = useMemo(() => imageUrl(items.find((item) => item.backdrop_path)?.backdrop_path, 'original'), [items]);
  const hasMore = pagination.page < pagination.totalPages;

  useEffect(() => {
    if (!query) {
      setItems([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    const loadSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchMoviesAndSeries(query, { page: 1, signal: controller.signal });

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
          setError('No pudimos completar la busqueda.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadSearch();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [query]);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      const data = await searchMoviesAndSeries(query, { page: pagination.page + 1 });
      setItems((currentItems) => [...currentItems, ...data.results]);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        totalResults: data.totalResults,
      });
    } catch {
      setError('No pudimos cargar mas resultados.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 pt-24 text-center text-white">Buscando...</div>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: background ? `url(${background})` : undefined }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-black/85 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">Busqueda</p>
          <h1 className="text-3xl font-black md:text-5xl">
            {query ? `Resultados para "${query}"` : 'Busca peliculas y series'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{pagination.totalResults} resultados</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 p-4 text-sm text-red-200">{error}</div>}

        {items.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-300">
            No encontramos resultados para esta busqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const mediaType = item.media_type;

              return (
                <MediaCard
                  key={`${mediaType}-${item.id}`}
                  item={item}
                  mediaType={mediaType}
                  variant="detail"
                  favoriteActive={isFavorite(item.id, mediaType)}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded bg-red-600 px-6 py-3 text-sm font-black uppercase transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMore ? 'Cargando...' : 'Cargar mas'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
