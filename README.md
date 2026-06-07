# KalCineHD

## 1. Titulo del proyecto

KalCineHD es una aplicacion web de peliculas y series inspirada en el estilo visual de PelisCineHD, construida con React y la API de TMDB.

## 2. Descripcion corta

La app permite descubrir peliculas y series populares, buscar contenido, ver detalles completos, cargar mas resultados y guardar favoritos en el navegador.

## 3. Demo online

Demo pendiente de despliegue.

Cuando el proyecto este publicado, agrega aqui el enlace:

```text
https://tu-demo-online.com
```

## 4. Capturas de pantalla

Capturas pendientes.

Sugerencia de capturas para agregar:

- Home con buscador, peliculas populares, series populares y sidebar.
- Pagina de listado de peliculas.
- Pagina de detalle de una pelicula o serie.
- Pagina de favoritos.

## 5. Tecnologias usadas

- React
- Vite
- Tailwind CSS
- React Router
- lucide-react
- Axios
- TMDB API
- ESLint

## 6. Funcionalidades

- Home con fondo dinamico usando imagenes de TMDB.
- Buscador de peliculas y series.
- Busqueda con query params: `/buscar?q=matrix`.
- Listado de peliculas populares.
- Listado de series populares.
- Paginas de detalle para peliculas y series.
- Paginacion con boton `Cargar mas`.
- Oculta `Cargar mas` cuando no quedan mas paginas.
- Carrusel automatico de peliculas en cartelera.
- Top 7 peliculas y Top 7 series.
- Sistema de favoritos con `localStorage`.
- Pagina de favoritos.
- Pagina 404 personalizada.
- Navbar y footer responsive.
- Variables de entorno para TMDB, Telegram y contacto.

## 7. Instalacion local

1. Clona el repositorio.

```bash
git clone <url-del-repositorio>
```

2. Entra en la carpeta del proyecto.

```bash
cd kaltechgroup-movies
```

3. Instala las dependencias.

```bash
npm install
```

4. Copia el archivo de variables de entorno.

```bash
cp .env.example .env
```

En Windows tambien puedes crear `.env` manualmente copiando el contenido de `.env.example`.

5. Agrega tu API key de TMDB en `.env`.

6. Inicia el proyecto.

```bash
npm run dev
```

## 8. Variables de entorno

El proyecto usa variables con prefijo `VITE_` porque corre sobre Vite.

```env
VITE_TMDB_API_KEY=tu_api_key_de_tmdb
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TELEGRAM_URL=https://t.me/TuCanal
VITE_CONTACT_EMAIL=contacto@kaltechgroup.com
```

Puedes conseguir una API key creando una cuenta en TMDB:

```text
https://www.themoviedb.org/
```

## 9. Scripts disponibles

```bash
npm run dev
```

Inicia el servidor local de desarrollo.

```bash
npm run build
```

Genera la version de produccion.

```bash
npm run preview
```

Sirve localmente la version generada por `build`.

```bash
npm run lint
```

Revisa el codigo con ESLint.

## 10. Estructura del proyecto

```text
src/
  api/
    tmdb.js
  assets/
    logo_kal_cine_hd.png
  components/
    FavoriteButton.jsx
    Footer.jsx
    MediaCard.jsx
    MediaSection.jsx
    NavBar.jsx
    SearchBox.jsx
    Sidebar.jsx
  config/
    site.js
  hooks/
    useFavorites.js
    useMediaList.js
  pages/
    FavoritesPage.jsx
    Home.jsx
    MediaDetailsPage.jsx
    MediaListPage.jsx
    NotFound.jsx
    SearchPage.jsx
  utils/
    media.js
  App.jsx
  main.jsx
  index.css
```

## 11. Aprendizajes del proyecto

- Consumo de APIs externas con Axios.
- Manejo de rutas con React Router.
- Separacion de responsabilidades usando componentes reutilizables.
- Creacion de hooks personalizados para listas y favoritos.
- Manejo de estados de carga, error y resultados vacios.
- Uso de query params para busqueda.
- Persistencia simple en el navegador con `localStorage`.
- Diseno responsive con Tailwind CSS.
- Normalizacion de tipos de contenido usando `movie` y `tv`.

## 12. Proximas mejoras

- Agregar filtros por genero, anio y rating.
- Crear pagina de estrenos.
- Agregar skeleton loaders.
- Mejorar el carrusel con controles manuales.
- Agregar pruebas unitarias para hooks y helpers.
- Agregar autenticacion real en una etapa futura.
- Sincronizar favoritos con backend cuando se agregue una API propia.
- Desplegar la demo online.

## 13. Autor

Proyecto desarrollado por KalTechGroup.

```text
KalTechGroup
KalCineHD
```
