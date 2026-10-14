const STORAGE_KEY = 'movie-shop-v1';

export function loadDatabase(initialDatabase) {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText === null) return structuredClone(initialDatabase);
    const database = JSON.parse(savedText);
    const validUsers = Array.isArray(database.users) && database.users.every(user =>
      typeof user.id === 'string' && typeof user.name === 'string' &&
      typeof user.email === 'string' && typeof user.password === 'string');
    const validMovies = Array.isArray(database.movies) && database.movies.every(movie =>
      typeof movie.id === 'string' && typeof movie.title === 'string' &&
      typeof movie.director === 'string' && typeof movie.description === 'string' &&
      typeof movie.image === 'string' && typeof movie.genre === 'string' &&
      Number.isFinite(movie.price) && movie.price > 0 && Number.isInteger(movie.year));
    if (!validUsers || !validMovies) throw new Error('Неверная структура JSON');
    if (!Array.isArray(database.comments)) database.comments = [];
    if (!Array.isArray(database.ads)) database.ads = [];
    return database;
  } catch {
    throw new Error('Не удалось прочитать данные браузера. Проверьте доступ к localStorage.');
  }
}

export function saveDatabase(database) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database, null, 2));
  } catch {
    throw new Error('Не удалось сохранить данные. Проверьте место и разрешения браузера.');
  }
}