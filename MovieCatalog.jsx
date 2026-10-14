import { useState } from 'react';
import MovieCard from './MovieCard.jsx';
import { getVisibleMovies } from '../utils/catalog.js';

export default function MovieCatalog({ movies, favorites, onToggleFavorite }) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [sortMode, setSortMode] = useState('default');
  const genres = [...new Set(movies.map(movie => movie.genre))].sort((a, b) => a.localeCompare(b, 'ru'));
  const visibleMovies = getVisibleMovies(movies, search, genre, sortMode);
  function resetFilters() {
    setSearch('');
    setGenre('all');
    setSortMode('default');
  }
  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">Найдите свой фильм</p><h2>Каталог фильмов</h2></div><span>Найдено: {visibleMovies.length} / {movies.length}</span></div>
      <div className="filters">
        <label>Поиск по режиссёру или фильму<input type="search" placeholder="Например: Нолан или Начало" value={search} onChange={event => setSearch(event.target.value)} /></label>
        <label>Жанр<select value={genre} onChange={event => setGenre(event.target.value)}><option value="all">Все жанры</option>{genres.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Сортировка<select value={sortMode} onChange={event => setSortMode(event.target.value)}><option value="default">По порядку добавления</option><option value="director">Режиссёр: А → Я</option><option value="title">Название: А → Я</option><option value="year">Год: от новых</option><option value="price-up">Цена: от дешёвых</option><option value="price-down">Цена: от дорогих</option></select></label>
        <button type="button" className="secondary" onClick={resetFilters}>Сбросить</button>
      </div>
      <div className="movie-grid">
        {visibleMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            favorite={favorites.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      {visibleMovies.length === 0 && <p className="empty">Фильмы не найдены. Измените запрос или сбросьте фильтры.</p>}
    </section>
  );
}
