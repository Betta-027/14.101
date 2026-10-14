import { useState } from 'react';
import MovieCard from './MovieCard.jsx';

export default function Categories({ movies, favorites, onToggleFavorite }) {
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genreStats = [...new Set(movies.map(movie => movie.genre))].map(genre => ({
    name: genre,
    count: movies.filter(movie => movie.genre === genre).length,
  })).sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  const visibleMovies = selectedGenre === 'all'
    ? movies
    : movies.filter(movie => movie.genre === selectedGenre);

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Обзор по жанрам</p>
          <h2>Категории фильмов</h2>
        </div>
        <span>Жанров: {genreStats.length}</span>
      </div>

      <div className="categories-bar">
        <button
          className={selectedGenre === 'all' ? 'category-btn active' : 'category-btn'}
          onClick={() => setSelectedGenre('all')}
        >
          Все <span className="category-count">{movies.length}</span>
        </button>
        {genreStats.map(genre => (
          <button
            key={genre.name}
            className={selectedGenre === genre.name ? 'category-btn active' : 'category-btn'}
            onClick={() => setSelectedGenre(genre.name)}
          >
            {genre.name} <span className="category-count">{genre.count}</span>
          </button>
        ))}
      </div>

      <h3 className="category-subtitle">
        {selectedGenre === 'all' ? 'Все фильмы' : `Жанр: ${selectedGenre}`}
      </h3>

      {visibleMovies.length === 0 ? (
        <p className="empty">В этой категории пока нет фильмов.</p>
      ) : (
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
      )}
    </section>
  );
}