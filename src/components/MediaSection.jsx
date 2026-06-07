import React from 'react';
import { Link } from 'react-router-dom';
import MediaCard from './MediaCard';

const MediaSection = ({ title, items, mediaType, viewAllPath, isFavorite, onToggleFavorite }) => (
  <section>
    <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
      <h2 className="text-xl font-black uppercase text-red-500 md:text-2xl">{title}</h2>
      <Link
        to={viewAllPath}
        className="rounded bg-red-600 px-4 py-2 text-xs font-bold uppercase transition hover:bg-red-700"
      >
        Ver mas
      </Link>
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          mediaType={mediaType}
          favoriteActive={isFavorite?.(item.id, mediaType)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  </section>
);

export default MediaSection;
