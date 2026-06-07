import React from 'react';
import { Facebook, Instagram, Mail, Send, Youtube } from 'lucide-react';
import { siteConfig } from '../config/site';
import logoKalCineHd from '../assets/logo_kal_cine_hd.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4">
              <img
                src={logoKalCineHd}
                alt="KalCineHD"
                className="h-16 w-auto max-w-[220px] object-contain sm:h-20 sm:max-w-[260px]"
              />
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Películas, series, estrenos y novedades organizadas para descubrir qué ver en cada momento.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-200">Explorar</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <a href="#" className="block transition hover:text-red-400">Películas</a>
              <a href="#" className="block transition hover:text-red-400">Series</a>
              <a href="#" className="block transition hover:text-red-400">Estrenos</a>
              <a href="#" className="block transition hover:text-red-400">Populares</a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-200">Ayuda</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <a href="#" className="block transition hover:text-red-400">Contacto</a>
              <a href="#" className="block transition hover:text-red-400">Soporte</a>
              <a href="#" className="block transition hover:text-red-400">Privacidad</a>
              <a href="#" className="block transition hover:text-red-400">Términos</a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-200">Comunidad</h3>
            <div className="mb-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-slate-300 transition hover:bg-red-600 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-slate-300 transition hover:bg-red-600 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="inline-flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-slate-300 transition hover:bg-red-600 hover:text-white">
                <Youtube size={18} />
              </a>
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-2 transition hover:text-red-400">
                <Mail size={16} /> {siteConfig.contactEmail}
              </a>
              <a href={siteConfig.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-sky-400">
                <Send size={16} /> Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} KalTechGroup. Todos los derechos reservados.</p>
          <p>KalCineHD usa información pública de TMDB para catalogar películas y series.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
