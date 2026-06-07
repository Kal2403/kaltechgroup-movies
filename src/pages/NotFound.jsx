import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
    <section className="max-w-lg text-center">
      <p className="mb-3 text-sm font-black uppercase tracking-wide text-red-500">404</p>
      <h1 className="text-4xl font-black">Pagina no encontrada</h1>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        La ruta que intentas abrir no existe o fue movida.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded bg-red-600 px-5 py-3 text-sm font-black uppercase transition hover:bg-red-700"
      >
        Volver al inicio
      </Link>
    </section>
  </main>
);

export default NotFound;
