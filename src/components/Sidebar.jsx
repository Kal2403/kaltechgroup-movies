import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Star } from 'lucide-react';
import { getRating, getTitle, getYear, imageUrl } from '../utils/media';

const CompactItem = ({ item, index, mediaType }) => (
  <Link to={mediaType === 'tv' ? `/series/${item.id}` : `/peliculas/${item.id}`} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-2 transition hover:border-red-500/70">
    <span className="w-6 shrink-0 text-center text-lg font-black text-red-500">{index + 1}</span>
    <img
      src={imageUrl(item.poster_path, 'w185') || 'https://placehold.co/92x138/0f172a/94a3b8?text=Sin+poster'}
      alt={getTitle(item)}
      className="h-16 w-11 shrink-0 rounded object-cover"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-bold text-white">{getTitle(item)}</p>
      <p className="mt-1 text-[11px] text-slate-400">{getYear(item)}</p>
    </div>
  </Link>
);

const Sidebar = ({ carouselItem, topMovies, topSeries, telegramUrl, contactEmail }) => (
  <aside className="space-y-5">
    <section className="rounded-lg border border-slate-800 bg-slate-950/75 p-3">
      <h2 className="mb-3 text-base font-black">En cartelera</h2>
      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        {carouselItem && (
          <article key={carouselItem.id} className="relative h-72 overflow-hidden sm:h-80 lg:h-80">
            <img
              src={imageUrl(carouselItem.poster_path, 'w780') || 'https://placehold.co/520x780/0f172a/94a3b8?text=Sin+poster'}
              alt={getTitle(carouselItem)}
              className="h-full w-full object-cover transition duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
              <p className="line-clamp-2 text-sm font-black">{getTitle(carouselItem)}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-200">
                <span>{getYear(carouselItem)}</span>
                <span className="inline-flex items-center gap-1 font-black text-yellow-400">
                  <Star size={14} fill="currentColor" /> {getRating(carouselItem)}
                </span>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>

    <a
      href={telegramUrl}
      target="_blank"
      rel="noreferrer"
      className="flex w-full animate-bounce items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-3 text-center text-sm font-black text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600"
    >
      <Send size={20} /> Unete a nuestro Telegram
    </a>

    <section className="rounded-lg border border-slate-800 bg-slate-950/75 p-3">
      <h2 className="mb-3 text-base font-black uppercase text-slate-200">Top 7 peliculas</h2>
      <div className="space-y-2">
        {topMovies.map((movie, index) => (
          <CompactItem key={movie.id} item={movie} index={index} mediaType="movie" />
        ))}
      </div>
    </section>

    <section className="rounded-lg border border-slate-800 bg-slate-950/75 p-3">
      <h2 className="mb-3 text-base font-black uppercase text-slate-200">Top 7 series</h2>
      <div className="space-y-2">
        {topSeries.map((serie, index) => (
          <CompactItem key={serie.id} item={serie} index={index} mediaType="tv" />
        ))}
      </div>
    </section>

    <div className="rounded-lg border border-dashed border-slate-600 bg-slate-950/70 p-4 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Publicidad</span>
      <div className="mt-3 rounded border border-slate-800 bg-slate-900/80 px-4 py-8">
        <p className="text-sm font-bold text-white">Estrena tu anuncio aqui</p>
        <p className="mt-1 text-xs text-red-400">{contactEmail}</p>
      </div>
    </div>
  </aside>
);

export default Sidebar;
