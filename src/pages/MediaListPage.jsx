import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { useFavorites } from '../hooks/useFavorites';
import { useMediaList } from '../hooks/useMediaList';
import { imageUrl } from '../utils/media';

const pageConfig = {
  movie: {
    heading: 'Todas las peliculas',
    description: 'Explora peliculas populares de TMDB con poster, estreno, calificacion e informacion.',
    emptyText: 'No encontramos peliculas para esta busqueda.',
  },
  tv: {
    heading: 'Todas las series',
    description: 'Explora series populares de TMDB con poster, estreno, calificacion e informacion.',
    emptyText: 'No encontramos series para esta busqueda.',
  },
};

const MediaListPage = ({ mediaType }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const config = pageConfig[mediaType];
  const { error, hasMore, items, loading, loadingMore, loadMore, pagination } = useMediaList({ mediaType, query });
  const { isFavorite, toggleFavorite } = useFavorites();
  const background = useMemo(() => imageUrl(items.find((item) => item.backdrop_path)?.backdrop_path, 'original'), [items]);
  const heading = query ? `Resultados para "${query}"` : config.heading;

  if (loading) {
    return <div className="min-h-screen bg-slate-950 pt-24 text-center text-white">Cargando catalogo...</div>;
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
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">TMDB</p>
          <h1 className="text-3xl font-black md:text-5xl">{heading}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{config.description}</p>
          <p className="mt-2 text-sm text-slate-500">{pagination.totalResults} resultados</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 p-4 text-sm text-red-200">{error}</div>}

        {items.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-300">
            {config.emptyText}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MediaCard
                key={`${mediaType}-${item.id}`}
                item={item}
                mediaType={mediaType}
                variant="detail"
                favoriteActive={isFavorite(item.id, mediaType)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
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

export default MediaListPage;
