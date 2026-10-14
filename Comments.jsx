import { useState } from 'react';

export default function Comments({ movies, comments, onAddComment }) {
  const [movieId, setMovieId] = useState(movies[0]?.id || '');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function submitForm(event) {
    event.preventDefault();
    if (!text.trim()) return setError('Введите текст отзыва.');
    const message = onAddComment(movieId, text);
    if (message) return setError(message);
    setText('');
    setError('');
  }

  const sortedComments = [...comments].reverse();

  return (
    <section>
      <div className="section-heading">
        <div><p className="eyebrow">Мнения зрителей</p><h2>Отзывы клиентов</h2></div>
        <span>Всего: {comments.length}</span>
      </div>

      <form className="form comment-form" onSubmit={submitForm}>
        <h3>Оставить отзыв</h3>
        <label>Фильм
          <select value={movieId} onChange={event => setMovieId(event.target.value)}>
            {movies.map(movie => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
          </select>
        </label>
        <label>Ваш отзыв
          <textarea value={text} onChange={event => setText(event.target.value)} rows={3} maxLength={400} placeholder="Поделитесь впечатлениями о фильме…" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit">Отправить отзыв</button>
      </form>

      {sortedComments.length === 0 ? (
        <p className="empty">Отзывов пока нет. Будьте первым!</p>
      ) : (
        <div className="comments-list">
          {sortedComments.map(comment => {
            const movie = movies.find(m => m.id === comment.movieId);
            return (
              <article key={comment.id} className="comment-card">
                <div className="comment-head">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <p className="comment-movie">Фильм: {movie ? movie.title : '—'}</p>
                <p className="comment-text">{comment.text}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}