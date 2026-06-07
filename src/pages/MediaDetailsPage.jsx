import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import { getMediaDetails } from '../api/tmdb';
import { useFavorites } from '../hooks/useFavorites';
import { getRating, getTitle, getYear, imageUrl } from '../utils/media';

const detailsConfig = {
  movie: {
    backPath: '/peliculas',
    typeLabel: 'Pelicula',
  },
  tv: {
    backPath: '/series',
    typeLabel: 'Serie',
  },
};

const MediaDetailsPage = ({ mediaType }) => {
  const { id } = useParams();
  const config = detailsConfig[mediaType];
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const background = useMemo(() => imageUrl(item?.backdrop_path, 'original'), [item]);

  useEffect(() => {
    let isActive = true;

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getMediaDetails(mediaType, id);

        if (isActive) {
          setItem(details);
        }
      } catch {
        if (isActive) {
          setError('No pudimos cargar los detalles de este titulo.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      isActive = false;
    };
  }, [id, mediaType]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 pt-24 text-center text-white">Cargando detalles...</div>;
  }

  if (error || !item) {
    return <div className="min-h-screen bg-slate-950 pt-24 text-center text-red-400">{error}</div>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: background ? `url(${background})` : undefined }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to={config.backPath} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-red-400">
          <ArrowLeft size={18} /> Volver
        </Link>

        <section className="grid gap-8 rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-2xl md:grid-cols-[280px_1fr] md:p-6">
          <img
            src={imageUrl(item.poster_path, 'w500') || 'https://placehold.co/500x750/0f172a/94a3b8?text=Sin+poster'}
            alt={getTitle(item)}
            className="w-full rounded-lg object-cover shadow-xl"
          />

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-wide text-red-500">{config.typeLabel}</p>
              <FavoriteButton
                active={isFavorite(item.id, mediaType)}
                onClick={() => toggleFavorite(item, mediaType)}
                label={getTitle(item)}
                className="h-11 w-11"
              />
            </div>
            <h1 className="text-3xl font-black md:text-5xl">{getTitle(item)}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>{getYear(item)}</span>
              <span className="inline-flex items-center gap-1 font-black text-yellow-400">
                <Star size={16} fill="currentColor" /> {getRating(item)}
              </span>
              {item.runtime && <span>{item.runtime} min</span>}
              {item.number_of_seasons && <span>{item.number_of_seasons} temporadas</span>}
              {item.number_of_episodes && <span>{item.number_of_episodes} episodios</span>}
            </div>

            {item.genres?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span key={genre.id} className="rounded bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
              {item.overview || 'No hay informacion disponible para este titulo.'}
            </p>

            <div className="mt-8 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Titulo original</p>
                <p className="mt-1 font-bold">{item.original_title || item.original_name || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Estado</p>
                <p className="mt-1 font-bold">{item.status || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Popularidad</p>
                <p className="mt-1 font-bold">{item.popularity?.toFixed?.(1) || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Votos</p>
                <p className="mt-1 font-bold">{item.vote_count || 'N/A'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MediaDetailsPage;
