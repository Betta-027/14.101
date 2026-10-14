export default function Profile({ user, movies, comments, onLogout }) {
  const favoritesCount = (user.favorites || []).length;
  const userComments = comments.filter(comment => comment.author === user.name);
  return (
    <section className="profile-panel">
      <div className="section-heading">
        <div><p className="eyebrow">Личный кабинет</p><h2>Профиль</h2></div>
      </div>
      <div className="profile-card">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <h3>{user.name}</h3>
        <p className="profile-email">{user.email}</p>
      </div>
      <div className="profile-stats">
        <div className="stat"><span className="stat-number">{favoritesCount}</span><span className="stat-label">В избранном</span></div>
        <div className="stat"><span className="stat-number">{movies.length}</span><span className="stat-label">Всего фильмов</span></div>
        <div className="stat"><span className="stat-number">{userComments.length}</span><span className="stat-label">Ваших отзывов</span></div>
      </div>
      <button className="secondary" onClick={onLogout}>Выйти из аккаунта</button>
    </section>
  );
}