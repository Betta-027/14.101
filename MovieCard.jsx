const priceFormatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UAH' });

export default function MovieCard({ movie, favorite, onToggleFavorite }) {
  function showFallback(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = '/images/fallback.svg';
  }
  return (
    <article className="movie-card">
      <img src={movie.image} alt={`Постер фильма «${movie.title}»`} onError={showFallback} loading="lazy" />
      <div className="movie-content">
        <span className="tag">{movie.genre} · {movie.year}</span>
        <h3>{movie.title}</h3>
        <p className="director">{movie.director}</p>
        <p className="description">{movie.description}</p>
        <strong className="price">{priceFormatter.format(movie.price)}</strong>
        {onToggleFavorite && (
          <button
            type="button"
            className={favorite ? 'favorite active' : 'favorite'}
            onClick={() => onToggleFavorite(movie.id)}
          >
            {favorite ? '★ В избранном' : '☆ В избранное'}
          </button>
        )}
      </div>
    </article>
  );
}