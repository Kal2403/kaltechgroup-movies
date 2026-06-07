import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import FavoritesPage from './pages/FavoritesPage';
import Home from './pages/Home';
import MediaDetailsPage from './pages/MediaDetailsPage';
import MediaListPage from './pages/MediaListPage';
import NotFound from './pages/NotFound';
import SearchPage from './pages/SearchPage';
import { Routes, Route } from 'react-router-dom';

const App = () => {

    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/peliculas" element={<MediaListPage mediaType="movie" />} />
                <Route path="/peliculas/:id" element={<MediaDetailsPage mediaType="movie" />} />
                <Route path="/series" element={<MediaListPage mediaType="tv" />} />
                <Route path="/series/:id" element={<MediaDetailsPage mediaType="tv" />} />
                <Route path="/buscar" element={<SearchPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;
