import { useState } from 'react';
import initialDatabase from './data/database.json';
import { loadDatabase, saveDatabase } from './utils/storage.js';
import RegisterForm from './components/RegisterForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import MovieCatalog from './components/MovieCatalog.jsx';
import AddMovieForm from './components/AddMovieForm.jsx';
import Favorites from './components/Favorites.jsx';
import Comments from './components/Comments.jsx';
import Profile from './components/Profile.jsx';
import Ads from './components/Ads.jsx';
import Categories from './components/Categories.jsx';
import Subscription from './components/Subscription.jsx';

function initializeDatabase() {
  try { return { database: loadDatabase(initialDatabase), error: '' }; }
  catch (error) { return { database: null, error: error.message }; }
}

export default function App() {
  const [initialState] = useState(initializeDatabase);
  const [database, setDatabase] = useState(initialState.database);
  const [currentUser, setCurrentUser] = useState(null);
  const [authTab, setAuthTab] = useState('register');
  const [page, setPage] = useState('catalog');
  const [notice, setNotice] = useState('');

  function commitDatabase(nextDatabase) {
    try {
      saveDatabase(nextDatabase);
      setDatabase(nextDatabase);
      return '';
    } catch (error) { return error.message; }
  }

  function registerUser(form) {
    const email = form.email.trim().toLowerCase();
    if (database.users.some(user => user.email === email)) return 'Этот email уже зарегистрирован.';
    const user = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email,
      password: form.password,
      favorites: [],
      balance: 500,
      subscription: null
    };
    const message = commitDatabase({ ...database, users: [...database.users, user] });
    if (message) return message;
    setNotice('Регистрация успешна! Теперь войдите с вашим email и паролем.');
    setAuthTab('login');
    return '';
  }

  function loginUser(email, password) {
    const user = database.users.find(item => item.email === email.trim().toLowerCase() && item.password === password);
    if (!user) return 'Неверный email или пароль.';
    setCurrentUser(user);
    setPage('catalog');
    setNotice('');
    return '';
  }

  function addMovie(movie) {
    const message = commitDatabase({ ...database, movies: [...database.movies, movie] });
    if (message) return message;
    setNotice(`Фильм «${movie.title}» добавлен в каталог.`);
    setPage('catalog');
    return '';
  }

  function addAd(ad) {
    const message = commitDatabase({ ...database, ads: [...(database.ads || []), ad] });
    if (message) return message;
    setNotice(`Баннер «${ad.title}» добавлен.`);
    return '';
  }

  function toggleFavorite(movieId) {
    const updatedUsers = database.users.map(user => {
      if (user.id !== currentUser.id) return user;
      const favorites = user.favorites || [];
      const newFavorites = favorites.includes(movieId)
        ? favorites.filter(id => id !== movieId)
        : [...favorites, movieId];
      return { ...user, favorites: newFavorites };
    });
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    const message = commitDatabase({ ...database, users: updatedUsers });
    if (message) return message;
    setCurrentUser(updatedUser);
    return '';
  }

  function addComment(movieId, text) {
    const comment = {
      id: crypto.randomUUID(),
      movieId,
      author: currentUser.name,
      text: text.trim(),
      date: new Date().toLocaleDateString('ru-RU')
    };
    const message = commitDatabase({ ...database, comments: [...(database.comments || []), comment] });
    if (message) return message;
    return '';
  }

  function topUp(amount) {
    const updatedUsers = database.users.map(user =>
      user.id === currentUser.id
        ? { ...user, balance: (user.balance || 0) + amount }
        : user
    );
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    const message = commitDatabase({ ...database, users: updatedUsers });
    if (message) return message;
    setCurrentUser(updatedUser);
    return '';
  }

  function buyPlan(plan) {
    const until = new Date();
    until.setDate(until.getDate() + plan.duration);
    const updatedUsers = database.users.map(user =>
      user.id === currentUser.id
        ? {
            ...user,
            balance: (user.balance || 0) - plan.price,
            subscription: { planId: plan.id, planName: plan.name, until: until.toISOString() }
          }
        : user
    );
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    const message = commitDatabase({ ...database, users: updatedUsers });
    if (message) return message;
    setCurrentUser(updatedUser);
    return '';
  }

  function logout() {
    setCurrentUser(null);
    setAuthTab('login');
    setNotice('');
  }

  if (!database) return <main className="auth-shell"><div className="auth-card"><h1>Не удалось открыть кинотеатр</h1><p className="error" role="alert">{initialState.error}</p><button onClick={() => window.location.reload()}>Повторить загрузку</button></div></main>;

  if (!currentUser) return (
    <main className="auth-shell">
      <div className="auth-intro">
        <p className="eyebrow">Учебный проект · React</p>
        <h1>Кино<br />полка<span>.</span></h1>
        <p>Фильмы, которые хочется пересмотреть.</p>
        <div className="movie-symbol" aria-hidden="true">🎬</div>
      </div>
      <div className="auth-card">
        <nav className="tabs" aria-label="Регистрация и авторизация">
          <button className={authTab === 'register' ? 'active' : ''} onClick={() => setAuthTab('register')}>Регистрация</button>
          <button className={authTab === 'login' ? 'active' : ''} onClick={() => setAuthTab('login')}>Вход</button>
        </nav>
        {authTab === 'register' ? <RegisterForm onRegister={registerUser} /> : <LoginForm onLogin={loginUser} notice={notice} />}
        <p className="hint">Демонстрационная авторизация без сервера. Используйте вымышленные данные и пароль.</p>
      </div>
    </main>
  );

  const favoritesCount = (currentUser.favorites || []).length;

  return (
    <div className="shop-shell">
      <header className="shop-header">
        <h1>Кинополка<span>.</span></h1>
        <div className="user-menu">
          <span>Привет, {currentUser.name}!</span>
          <button className="secondary" onClick={logout}>Выйти</button>
        </div>
      </header>

      <nav className="tabs shop-tabs" aria-label="Разделы кинотеатра">
        <button className={page === 'catalog' ? 'active' : ''} onClick={() => { setNotice(''); setPage('catalog'); }}>Каталог</button>
        <button className={page === 'add' ? 'active' : ''} onClick={() => { setNotice(''); setPage('add'); }}>Добавить фильм</button>
        <button className={page === 'ads' ? 'active' : ''} onClick={() => { setNotice(''); setPage('ads'); }}>Реклама</button>
        <button className={page === 'categories' ? 'active' : ''} onClick={() => { setNotice(''); setPage('categories'); }}>Категории</button>
        <button className={page === 'subscription' ? 'active' : ''} onClick={() => { setNotice(''); setPage('subscription'); }}>Подписка</button>
        <button className={page === 'favorites' ? 'active' : ''} onClick={() => { setNotice(''); setPage('favorites'); }}>Избранное ({favoritesCount})</button>
        <button className={page === 'comments' ? 'active' : ''} onClick={() => { setNotice(''); setPage('comments'); }}>Отзывы</button>
        <button className={page === 'profile' ? 'active' : ''} onClick={() => { setNotice(''); setPage('profile'); }}>Профиль</button>
      </nav>

      <main>
        {notice && <p className="success" role="status">{notice}</p>}
        {page === 'catalog' && <MovieCatalog movies={database.movies} favorites={currentUser.favorites || []} onToggleFavorite={toggleFavorite} />}
        {page === 'add' && <AddMovieForm onAddMovie={addMovie} />}
        {page === 'ads' && <Ads ads={database.ads || []} onAddAd={addAd} />}
        {page === 'categories' && <Categories movies={database.movies} favorites={currentUser.favorites || []} onToggleFavorite={toggleFavorite} />}
        {page === 'subscription' && <Subscription user={currentUser} onTopUp={topUp} onBuyPlan={buyPlan} />}
        {page === 'favorites' && <Favorites movies={database.movies} favorites={currentUser.favorites || []} onToggleFavorite={toggleFavorite} />}
        {page === 'comments' && <Comments movies={database.movies} comments={database.comments || []} onAddComment={addComment} />}
        {page === 'profile' && <Profile user={currentUser} movies={database.movies} comments={database.comments || []} onLogout={logout} />}
      </main>

      <footer>Учебный онлайн-кинотеатр · Цены и данные приведены для практики</footer>
    </div>
  );
}