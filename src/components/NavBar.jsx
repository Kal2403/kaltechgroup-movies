import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import logoKalCineHd from '../assets/logo_kal_cine_hd.png';
import { MOVIE_CATEGORIES } from '../utils/categories';
import { useFavorites } from '../hooks/useFavorites';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categoriesOpenMobile, setCategoriesOpenMobile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('login');
    const { favoritesCount } = useFavorites();

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setIsOpen(false);
    };

    return (
        <nav className="bg-slate-950 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <Link to="/" className="flex-shrink-0 cursor-pointer">
                            <img
                                src={logoKalCineHd}
                                alt="KalCineHD"
                                className="h-10 w-auto max-w-[150px] object-contain sm:h-12 sm:max-w-[180px]"
                            />
                        </Link>

                        <div className="hidden md:flex items-center space-x-3 text-sm font-semibold">
                            <button
                                onClick={() => openModal('login')}
                                className="text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1"
                            >
                                Iniciar Sesion
                            </button>
                            <button
                                onClick={() => openModal('register')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-md transition-colors duration-200 shadow-md shadow-red-900/20 text-xs sm:text-sm"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
                        <Link to="/peliculas" className="text-gray-300 hover:text-red-500 transition-colors duration-200">
                            Peliculas
                        </Link>
                        <Link to="/series" className="text-gray-300 hover:text-red-500 transition-colors duration-200">
                            Series
                        </Link>
                        <Link to="/favoritos" className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center gap-1.5">
                            <span>Favoritos</span>
                            {favoritesCount > 0 && (
                                <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-black h-4 min-w-4 px-1 rounded-full shadow-sm shadow-red-900/40">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>

                        {/* Desplegable de Categorias Desktop */}
                        <div className="relative group">
                            <button
                                type="button"
                                className="text-gray-300 group-hover:text-red-500 transition-colors duration-200 flex items-center gap-1.5 py-2 cursor-pointer"
                                aria-haspopup="true"
                            >
                                <span>Categorias</span>
                                <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
                            </button>

                            <div className="absolute right-0 top-full w-80 max-h-[70vh] overflow-y-auto py-3 px-3 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-2">
                                    Explorar por Categoria
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                    <Link
                                        to="/peliculas"
                                        className="col-span-2 px-3 py-1.5 text-xs font-black text-red-400 hover:bg-red-950/40 rounded transition"
                                    >
                                        ★ Todas las peliculas
                                    </Link>
                                    {MOVIE_CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/peliculas?categoria=${cat.id}&nombre=${encodeURIComponent(cat.name)}`}
                                            className="px-2.5 py-1.5 text-xs text-gray-300 hover:bg-slate-800 hover:text-white rounded transition truncate"
                                            title={cat.name}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Boton Hamburguesa Mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-900 focus:outline-none"
                            aria-label="Abrir menu"
                        >
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile / Tablet */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-slate-900 border-t border-slate-800 max-h-[85vh] overflow-y-auto`}>
                <div className="px-4 pt-3 pb-6 space-y-3">
                    <div className="flex flex-col space-y-2 pb-3 border-b border-slate-800">
                        <button
                            onClick={() => openModal('login')}
                            className="w-full text-left py-2 text-base font-medium text-gray-300 hover:text-white"
                        >
                            Iniciar Sesion
                        </button>
                        <button
                            onClick={() => openModal('register')}
                            className="w-full bg-red-600 text-white text-center py-2 rounded-md font-medium hover:bg-red-700"
                        >
                            Registrarse
                        </button>
                    </div>
                    <div className="space-y-1">
                        <Link
                            to="/peliculas"
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-base font-medium text-gray-300 hover:text-red-500"
                        >
                            Peliculas
                        </Link>
                        <Link
                            to="/series"
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-base font-medium text-gray-300 hover:text-red-500"
                        >
                            Series
                        </Link>
                        <Link
                            to="/favoritos"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between py-2 text-base font-medium text-gray-300 hover:text-red-500"
                        >
                            <span>Favoritos</span>
                            {favoritesCount > 0 && (
                                <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-black h-5 min-w-5 px-1.5 rounded-full">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>

                        {/* Acordeon de Categorias en Mobile */}
                        <div className="pt-2">
                            <button
                                onClick={() => setCategoriesOpenMobile(!categoriesOpenMobile)}
                                className="w-full flex items-center justify-between py-2 text-base font-medium text-gray-300 hover:text-red-500"
                            >
                                <span>Categorias</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-200 ${categoriesOpenMobile ? 'rotate-180 text-red-500' : ''}`}
                                />
                            </button>

                            {categoriesOpenMobile && (
                                <div className="mt-2 grid grid-cols-2 gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                                    <Link
                                        to="/peliculas"
                                        onClick={() => setIsOpen(false)}
                                        className="col-span-2 py-1.5 px-2 text-xs font-black text-red-400 bg-red-950/30 rounded"
                                    >
                                        ★ Todas las peliculas
                                    </Link>
                                    {MOVIE_CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/peliculas?categoria=${cat.id}&nombre=${encodeURIComponent(cat.name)}`}
                                            onClick={() => setIsOpen(false)}
                                            className="py-1.5 px-2 text-xs text-gray-300 hover:text-white hover:bg-slate-800 rounded truncate"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Sesion */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl text-white">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {modalType === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
                        </h2>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            {modalType === 'register' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        placeholder="Tu usuario"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Correo Electronico</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Contrasena</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors mt-2">
                                {modalType === 'login' ? 'Entrar' : 'Registrarse'}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            {modalType === 'login' ? (
                                <>
                                    No tienes cuenta?{' '}
                                    <button onClick={() => setModalType('register')} className="text-red-500 hover:underline font-medium">
                                        Registrate aqui
                                    </button>
                                </>
                            ) : (
                                <>
                                    Ya tienes una cuenta?{' '}
                                    <button onClick={() => setModalType('login')} className="text-red-500 hover:underline font-medium">
                                        Inicia sesion
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
