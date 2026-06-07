import React from 'react';
import MediaCard from '../components/MediaCard';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesPage = () => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">KalCineHD</p>
          <h1 className="text-3xl font-black md:text-5xl">Favoritos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            Tus peliculas y series guardadas en este navegador.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
            Todavia no tienes favoritos.
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
