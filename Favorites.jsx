import MovieCard from './MovieCard.jsx';

export default function Favorites({ movies, favorites, onToggleFavorite }) {
  const favoriteMovies = movies.filter(movie => favorites.includes(movie.id));
  return (
    <section>
      <div className="section-heading">
        <div><p className="eyebrow">Ваша коллекция</p><h2>Избранные фильмы</h2></div>
        <span>Найдено: {favoriteMovies.length}</span>
      </div>
      {favoriteMovies.length === 0 ? (
        <p className="empty">В избранном пока пусто. Откройте каталог и добавьте фильмы звёздочкой ★.</p>
      ) : (
        <div className="movie-grid">
          {favoriteMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}