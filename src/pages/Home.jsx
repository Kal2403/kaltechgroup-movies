import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MediaSection from '../components/MediaSection';
import SearchBox from '../components/SearchBox';
import Sidebar from '../components/Sidebar';
import { siteConfig } from '../config/site';
import { useFavorites } from '../hooks/useFavorites';
import {
  getMoviesNowPlaying,
  getPopularMovies,
  getPopularSeries,
  getTrendingAll,
  searchMoviesAndSeries,
} from '../api/tmdb';
import { imageUrl } from '../utils/media';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [background, setBackground] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const visibleMovies = useMemo(() => movies.slice(0, 15), [movies]);
  const visibleSeries = useMemo(() => series.slice(0, 15), [series]);
  const topMovies = useMemo(() => movies.slice(0, 7), [movies]);
  const topSeries = useMemo(() => series.slice(0, 7), [series]);
  const carouselItems = useMemo(() => nowPlaying.slice(0, 12), [nowPlaying]);
  const currentCarouselItem = carouselItems[carouselIndex % Math.max(carouselItems.length, 1)];

  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);
        const [popularMovies, popularSeries, playingMovies, trending] = await Promise.all([
          getPopularMovies(),
          getPopularSeries(),
          getMoviesNowPlaying(),
          getTrendingAll(),
        ]);

        setMovies(popularMovies);
        setSeries(popularSeries);
        setNowPlaying(playingMovies);

        const backdrops = [...trending, ...popularMovies, ...popularSeries].filter((item) => item.backdrop_path);
        const randomItem = backdrops[Math.floor(Math.random() * backdrops.length)];
        setBackground(imageUrl(randomItem?.backdrop_path, 'original'));
      } catch {
        setError('No pudimos cargar las peliculas y series. Intentalo de nuevo mas tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        setSearching(true);
        const data = await searchMoviesAndSeries(query, { signal: controller.signal });

        if (isActive) {
          setSearchResults(data.results.slice(0, 8));
        }
      } catch (requestError) {
        if (isActive && requestError.name !== 'CanceledError' && requestError.name !== 'AbortError') {
          setSearchResults([]);
        }
      } finally {
        if (isActive) {
          setSearching(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSearchQueryChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  useEffect(() => {
    if (carouselItems.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setCarouselIndex((currentIndex) => (currentIndex + 1) % carouselItems.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [carouselItems.length]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 pt-24 text-center text-white">Cargando peliculas y series...</div>;
  }

  if (error) {
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto mb-10 mt-4 flex max-w-3xl flex-col items-center text-center">
          <h1 className="mb-4 text-3xl font-black tracking-normal md:text-5xl">
            Descubre tu proxima <span className="text-red-500">historia</span>
          </h1>
          <p className="mb-6 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
            Busca peliculas y series, revisa estrenos y encuentra los titulos mas populares en un solo lugar.
          </p>

          <SearchBox
            query={searchQuery}
            results={searchResults}
            searching={searching}
            onQueryChange={handleSearchQueryChange}
          />
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            <MediaSection
              title="Peliculas populares"
              items={visibleMovies}
              mediaType="movie"
              viewAllPath="/peliculas"
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />

            <MediaSection
              title="Series populares"
              items={visibleSeries}
              mediaType="tv"
              viewAllPath="/series"
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          <Sidebar
            carouselItem={currentCarouselItem}
            topMovies={topMovies}
            topSeries={topSeries}
            telegramUrl={siteConfig.telegramUrl}
            contactEmail={siteConfig.contactEmail}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
