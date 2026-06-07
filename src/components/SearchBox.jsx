import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getRating, getTitle, getYear, imageUrl } from '../utils/media';

const getResultPath = (item) => (item.media_type === 'tv' ? `/series/${item.id}` : `/peliculas/${item.id}`);

const SearchBox = ({ query, results, searching, onQueryChange }) => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextQuery = query.trim();

    if (nextQuery) {
      navigate(`/buscar?q=${encodeURIComponent(nextQuery)}`);
    }
  };

  return (
    <form className="relative w-full" role="search" onSubmit={handleSubmit}>
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Buscar peliculas o series..."
        aria-label="Buscar peliculas o series"
        className="h-14 w-full rounded-full border border-slate-700 bg-slate-950/90 pl-14 pr-28 text-sm text-white shadow-2xl outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-600/50 md:text-base"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-red-700"
      >
        Buscar
      </button>

      {(results.length > 0 || searching) && (
        <div className="absolute left-0 right-0 top-16 z-40 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-left shadow-2xl">
          {searching ? (
            <p className="p-4 text-sm text-slate-400">Buscando...</p>
          ) : (
            results.map((item) => (
              <Link
                key={`${item.media_type}-${item.id}`}
                to={getResultPath(item)}
                className="flex w-full items-center gap-3 border-b border-slate-900 p-3 text-left transition last:border-b-0 hover:bg-slate-900"
              >
                <img
                  src={imageUrl(item.poster_path, 'w92') || 'https://placehold.co/60x90/0f172a/94a3b8?text=Sin'}
                  alt={getTitle(item)}
                  className="h-16 w-11 rounded object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{getTitle(item)}</span>
                  <span className="text-xs text-slate-400">{getYear(item)} - {getRating(item)}</span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBox;
