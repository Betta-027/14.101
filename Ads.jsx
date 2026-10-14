import { useState } from 'react';

export default function Ads({ ads, onAddAd }) {
  const [form, setForm] = useState({ title: '', description: '', link: '', image: '' });
  const [error, setError] = useState('');

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  }

  function submitForm(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return setError('Заполните название и описание.');
    const link = form.link.trim();
    if (link && !/^https?:\/\//i.test(link)) return setError('Ссылка должна начинаться с http:// или https://');
    const ad = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim(),
      link: link,
      image: form.image.trim() || '/images/ad-fallback.svg',
    };
    const message = onAddAd(ad);
    if (message) return setError(message);
    setForm({ title: '', description: '', link: '', image: '' });
    setError('');
  }

  return (
    <section>
      <div className="section-heading">
        <div><p className="eyebrow">Партнёры кинотеатра</p><h2>Реклама</h2></div>
        <span>Баннеров: {ads.length}</span>
      </div>

      <form className="form add-panel" onSubmit={submitForm}>
        <h3>Разместить рекламу</h3>
        <label>Название
          <input name="title" value={form.title} onChange={changeField} placeholder="Например: Маникюрный салон «Лак»" maxLength={80} required />
        </label>
        <label>Описание
          <textarea name="description" value={form.description} onChange={changeField} rows={3} maxLength={300} placeholder="Короткое описание услуги или акции" required />
        </label>
        <label>Ссылка (необязательно)
          <input name="link" value={form.link} onChange={changeField} placeholder="https://example.com" />
        </label>
        <label>Ссылка на картинку (необязательно)
          <input name="image" value={form.image} onChange={changeField} placeholder="/images/ad-fallback.svg" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit">Добавить баннер</button>
      </form>

      {ads.length === 0 ? (
        <p className="empty">Рекламных баннеров пока нет.</p>
      ) : (
        <div className="ads-grid">
          {ads.map(ad => (
            <article key={ad.id} className="ad-card">
              <img
                src={ad.image}
                alt={`Реклама: ${ad.title}`}
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/ad-fallback.svg'; }}
              />
              <div className="ad-content">
                <span className="tag">Реклама</span>
                <h3>{ad.title}</h3>
                <p className="description">{ad.description}</p>
                {ad.link && (
                  <a href={ad.link} target="_blank" rel="noreferrer" className="ad-link">
                    Перейти на сайт →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}