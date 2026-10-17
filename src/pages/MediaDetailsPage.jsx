import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Film, Play, Sparkles, Star, Users } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import MediaCard from '../components/MediaCard';
import { getMediaCredits, getMediaDetails, getMediaRecommendations, getMediaVideos } from '../api/tmdb';
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
  const [trailer, setTrailer] = useState(null);
  const [credits, setCredits] = useState({ cast: [], directors: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const background = useMemo(() => imageUrl(item?.backdrop_path, 'original'), [item]);

  useEffect(() => {
    let isActive = true;

    const loadDetailsAndVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [details, videoData, creditsData, recsData] = await Promise.all([
          getMediaDetails(mediaType, id),
          getMediaVideos(mediaType, id),
          getMediaCredits(mediaType, id),
          getMediaRecommendations(mediaType, id),
        ]);

        if (isActive) {
          setItem(details);
          setTrailer(videoData.trailer);
          setCredits(creditsData);
          setRecommendations(recsData);
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

    loadDetailsAndVideos();

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
      <div className="fixed inset-0 bg-black/85 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to={config.backPath} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-red-400">
          <ArrowLeft size={18} /> Volver
        </Link>

        {/* Ficha principal */}
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
                  <Link
                    key={genre.id}
                    to={`/${mediaType === 'tv' ? 'series' : 'peliculas'}?categoria=${genre.id}&nombre=${encodeURIComponent(genre.name)}`}
                    className="rounded bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 transition hover:bg-red-600 hover:text-white"
                  >
                    {genre.name}
                  </Link>
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

              {credits.directors?.length > 0 ? (
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs font-black uppercase text-slate-500">Dirección</p>
                  <p className="mt-1 font-bold">{credits.directors.join(', ')}</p>
                </div>
              ) : item.created_by?.length > 0 ? (
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs font-black uppercase text-slate-500">Creador</p>
                  <p className="mt-1 font-bold">{item.created_by.map((c) => c.name).join(', ')}</p>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs font-black uppercase text-slate-500">Estado</p>
                  <p className="mt-1 font-bold">{item.status || 'N/A'}</p>
                </div>
              )}

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

        {/* Seccion de Reparto Principal */}
        {credits.cast?.length > 0 && (
          <section className="mt-10 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
                <Users className="text-red-500" size={24} />
                Reparto Principal
              </h2>
              <span className="text-xs text-slate-400 font-medium">{credits.cast.length} actores</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 sm:overflow-visible scrollbar-thin scrollbar-thumb-slate-700">
              {credits.cast.map((actor) => (
                <div
                  key={actor.id}
                  className="w-28 shrink-0 sm:w-auto group rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-center transition hover:border-red-500/60 hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-slate-800 mb-2">
                    <img
                      src={imageUrl(actor.profile_path, 'w185') || 'https://placehold.co/185x250/0f172a/94a3b8?text=Sin+foto'}
                      alt={actor.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="line-clamp-1 text-xs font-bold text-white transition group-hover:text-red-400">{actor.name}</p>
                  <p className="line-clamp-1 text-[11px] text-slate-400 mt-0.5">{actor.character || 'Personaje'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seccion de Trailer Oficial */}
        <section className="mt-10 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <h2 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
              <Film className="text-red-500" size={24} />
              Tráiler Oficial
            </h2>
            {trailer && (
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                <Play size={12} className="text-red-500" />
                {trailer.name}
              </span>
            )}
          </div>

          {trailer?.key ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                title={`Tráiler de ${getTitle(item)}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-12 px-4 text-center">
              <Film size={36} className="text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">Tráiler no disponible</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                No se encontró un tráiler en video disponible para este título en TMDB.
              </p>
            </div>
          )}
        </section>

        {/* Seccion de Titulos Similares / Recomendados */}
        {recommendations?.length > 0 && (
          <section className="mt-10 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
                <Sparkles className="text-red-500" size={24} />
                También te podría gustar
              </h2>
              <span className="text-xs text-slate-400 font-medium">Recomendados</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {recommendations.map((rec) => (
                <MediaCard
                  key={rec.id}
                  item={rec}
                  mediaType={mediaType}
                  variant="poster"
                  favoriteActive={isFavorite(rec.id, mediaType)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default MediaDetailsPage;
