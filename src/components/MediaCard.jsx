import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { getRating, getTitle, getYear, imageUrl } from '../utils/media';

const pathByType = {
  movie: '/peliculas',
  tv: '/series',
};

const MediaCard = ({ item, mediaType, favoriteActive = false, onToggleFavorite, variant = 'poster' }) => {
  const resolvedType = item.media_type || item.mediaType || mediaType || 'movie';
  const detailPath = `${pathByType[resolvedType] || '/peliculas'}/${item.id}`;
  const title = getTitle(item);

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite?.(item, resolvedType);
  };

  if (variant === 'detail') {
    return (
      <Link
        to={detailPath}
        className="group flex gap-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3 transition hover:-translate-y-1 hover:border-red-500/70"
      >
        <img
          src={imageUrl(item.poster_path, 'w185') || 'https://placehold.co/120x180/0f172a/94a3b8?text=Sin+poster'}
          alt={title}
          className="h-40 w-28 shrink-0 rounded object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h2 className="line-clamp-2 flex-1 font-black transition group-hover:text-red-400">{title}</h2>
            {onToggleFavorite && (
              <FavoriteButton active={favoriteActive} onClick={handleFavoriteClick} label={title} className="h-9 w-9 shrink-0" />
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span>{getYear(item)}</span>
            <span className="inline-flex items-center gap-1 font-black text-yellow-400">
              <Star size={14} fill="currentColor" /> {getRating(item)}
            </span>
          </div>
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
            {item.overview || 'No hay informacion disponible para este titulo.'}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={detailPath}
      className="group overflow-hidden rounded-lg border border-slate-800 bg-slate-950/80 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-red-500/70"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        {imageUrl(item.poster_path) ? (
          <img src={imageUrl(item.poster_path)} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">Sin imagen</div>
        )}
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-yellow-400 px-2 py-1 text-xs font-black text-slate-950">
          <Star size={13} fill="currentColor" /> {getRating(item)}
        </span>
        {onToggleFavorite && (
          <FavoriteButton active={favoriteActive} onClick={handleFavoriteClick} label={title} className="absolute left-2 top-2 h-9 w-9" />
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-white transition group-hover:text-red-400">{title}</h3>
        <p className="mt-1 text-xs text-slate-400">{getYear(item)}</p>
      </div>
    </Link>
  );
};

export default MediaCard;
