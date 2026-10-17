import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Sparkles, X } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { useFavorites } from '../hooks/useFavorites';
import { useMediaList } from '../hooks/useMediaList';
import { getCategories, getCategoryName } from '../utils/categories';
import { imageUrl } from '../utils/media';

const pageConfig = {
  movie: {
    heading: 'Todas las peliculas',
    typeSingular: 'película',
    typePlural: 'Películas',
    description: 'Explora peliculas populares de TMDB con poster, estreno, calificacion e informacion.',
    emptyText: 'No encontramos peliculas para esta busqueda o categoria.',
  },
  tv: {
    heading: 'Todas las series',
    typeSingular: 'serie',
    typePlural: 'Series',
    description: 'Explora series populares de TMDB con poster, estreno, calificacion e informacion.',
    emptyText: 'No encontramos series para esta busqueda o categoria.',
  },
};

const MediaListPage = ({ mediaType }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('categoria') || '';
  const categoryName = searchParams.get('nombre') || getCategoryName(selectedCategory, mediaType);

  const config = pageConfig[mediaType];
  const categories = useMemo(() => getCategories(mediaType), [mediaType]);

  const { error, hasMore, items, loading, loadingMore, loadMore, pagination } = useMediaList({
    mediaType,
    query,
    genreId: selectedCategory || null,
  });

  const { isFavorite, toggleFavorite } = useFavorites();
  const background = useMemo(() => imageUrl(items.find((item) => item.backdrop_path)?.backdrop_path, 'original'), [items]);

  const heading = useMemo(() => {
    if (query) return `Resultados para "${query}"`;
    if (selectedCategory && categoryName) return `${config.typePlural} de ${categoryName}`;
    return config.heading;
  }, [query, selectedCategory, categoryName, config]);

  const handleSelectCategory = (categoryId, name) => {
    if (!categoryId) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('categoria');
      nextParams.delete('nombre');
      setSearchParams(nextParams);
    } else {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('categoria', categoryId);
      if (name) {
        nextParams.set('nombre', name);
      }
      setSearchParams(nextParams);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: background ? `url(${background})` : undefined }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-black/85 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">TMDB</p>
          <h1 className="text-3xl font-black md:text-5xl">{heading}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{config.description}</p>
          <p className="mt-2 text-sm text-slate-500">{pagination.totalResults} resultados encontrados</p>
        </div>

        {/* Barra de Filtro de Categorias */}
        {!query && (
          <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-red-500" />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">
                  Filtrar por Categoria
                </h2>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-bold text-red-400 border border-red-500/30">
                    {categoryName}
                    <button
                      onClick={() => handleSelectCategory('')}
                      className="hover:text-white"
                      title="Quitar filtro"
                      aria-label="Quitar filtro de categoria"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              {/* Selector Desplegable directo (ideal para movil y seleccion veloz) */}
              <div className="sm:w-60">
                <label htmlFor="category-select" className="sr-only">Seleccionar categoria</label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    const id = e.target.value;
                    const cat = categories.find((c) => String(c.id) === String(id));
                    handleSelectCategory(id, cat?.name);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-2 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="">★ Todas las categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chips de categorias con scroll horizontal responsive */}
            <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
              <button
                onClick={() => handleSelectCategory('')}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  !selectedCategory
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Sparkles size={12} />
                Todas las categorias
              </button>

              {categories.map((cat) => {
                const isActive = String(selectedCategory) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id, cat.name)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Estado de error */}
        {error && <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 p-4 text-sm text-red-200">{error}</div>}

        {/* Estado de carga inicial */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-red-600 mb-4" />
            <p className="text-base font-semibold">Cargando {config.typePlural.toLowerCase()}...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-12 text-center text-slate-300">
            <p className="text-base font-bold">{config.emptyText}</p>
            {selectedCategory && (
              <button
                onClick={() => handleSelectCategory('')}
                className="mt-4 inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-red-700"
              >
                Ver todas las categorias
              </button>
            )}
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

        {/* Boton Cargar mas */}
        {!loading && hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-lg bg-red-600 px-8 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-900/30 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMore ? 'Cargando más...' : 'Cargar más títulos'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MediaListPage;
