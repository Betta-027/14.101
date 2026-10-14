export function normalizeText(text) {
  return text.trim().toLocaleLowerCase('ru');
}

export function getVisibleMovies(movies, search, genre, sortMode) {
  const query = normalizeText(search);
  const result = movies.filter(movie => {
    const matchesSearch = normalizeText(movie.title).includes(query) ||
      normalizeText(movie.director).includes(query);
    const matchesGenre = genre === 'all' || movie.genre === genre;
    return matchesSearch && matchesGenre;
  });
  result.sort((firstMovie, secondMovie) => {
    if (sortMode === 'director') return firstMovie.director.localeCompare(secondMovie.director, 'ru');
    if (sortMode === 'title') return firstMovie.title.localeCompare(secondMovie.title, 'ru');
    if (sortMode === 'price-up') return firstMovie.price - secondMovie.price;
    if (sortMode === 'price-down') return secondMovie.price - firstMovie.price;
    if (sortMode === 'year') return secondMovie.year - firstMovie.year;
    return 0;
  });
  return result;
}