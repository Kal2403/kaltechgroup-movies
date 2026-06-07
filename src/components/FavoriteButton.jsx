import React from 'react';
import { Heart } from 'lucide-react';

const FavoriteButton = ({ active, onClick, label = 'Favorito', className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={active ? `Quitar ${label} de favoritos` : `Agregar ${label} a favoritos`}
    className={`inline-flex items-center justify-center rounded bg-slate-950/80 text-white transition hover:bg-red-600 ${className}`}
  >
    <Heart size={18} fill={active ? 'currentColor' : 'none'} className={active ? 'text-red-500' : ''} />
  </button>
);

export default FavoriteButton;
