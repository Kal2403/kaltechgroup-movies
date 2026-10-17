import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Film, Trash2 } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesPage = () => {
  const { favorites, favoritesCount, isFavorite, toggleFavorite, clearFavorites } = useFavorites();

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos tus favoritos?')) {
      clearFavorites();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 sm:py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">KalCineHD</p>
            <h1 className="text-3xl font-black md:text-5xl">Mis Favoritos</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Tus películas y series guardadas para ver más tarde. Sincronizadas en tiempo real.
            </p>
          </div>

          {favoritesCount > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-bold bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                {favoritesCount} {favoritesCount === 1 ? 'título guardado' : 'títulos guardados'}
              </span>
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-900/50 hover:text-white"
                title="Vaciar todos los favoritos"
              >
                <Trash2 size={13} />
                Vaciar lista
              </button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 py-16 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 text-slate-400">
              <Bookmark size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Tu lista de favoritos está vacía</h2>
            <p className="max-w-md text-sm text-slate-400 mb-6 leading-relaxed">
              Explora nuestro catálogo de películas y series, y presiona el ícono del corazón para guardarlas aquí y verlas cuando quieras.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/peliculas"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-black uppercase text-white shadow-lg shadow-red-900/30 transition hover:bg-red-700"
              >
                <Film size={16} /> Explorar Películas
              </Link>
              <Link
                to="/series"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs sm:text-sm font-black uppercase text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                Ver Series
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                mediaType={item.mediaType}
                variant="detail"
                favoriteActive={isFavorite(item.id, item.mediaType)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default FavoritesPage;
