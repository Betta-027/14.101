import { useState } from 'react';

const emptyForm = { title: '', director: '', price: '', genre: '', year: '', description: '', image: '' };

export default function AddMovieForm({ onAddMovie }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [readingImage, setReadingImage] = useState(false);
  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  }
  function chooseImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 500 * 1024) {
      setError('Выберите JPG, PNG или WebP размером до 500 КБ.');
      event.target.value = '';
      return;
    }
    setError('');
    setReadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm(previousForm => ({ ...previousForm, image: String(reader.result) }));
      setReadingImage(false);
    };
    reader.onerror = () => { setError('Не удалось прочитать изображение.'); setReadingImage(false); };
    reader.readAsDataURL(file);
  }
  function submitForm(event) {
    event.preventDefault();
    const price = Number(form.price);
    const year = Number(form.year);
    if (!form.title.trim() || !form.director.trim() || !form.genre.trim() || !form.description.trim()) return setError('Текстовые поля не могут состоять только из пробелов.');
    if (!Number.isFinite(price) || price <= 0 || price > 100000) return setError('Укажите цену больше 0 и не больше 100 000 грн.');
    if (!Number.isInteger(year) || year < 1895 || year > 2100) return setError('Год должен быть целым числом от 1895 до 2100.');
    const image = form.image.trim();
    if (image && !/^https?:\/\//i.test(image) && !/^data:image\/(jpeg|png|webp);base64,/i.test(image)) return setError('Используйте ссылку http/https или выберите файл изображения.');
    const movie = {
      id: crypto.randomUUID(),
      title: form.title.trim(), director: form.director.trim(), price: Math.round(price * 100) / 100,
      genre: form.genre.trim(), year, description: form.description.trim(),
      image: image || '/images/fallback.svg',
    };
    setError(onAddMovie(movie));
  }
  return (
    <section className="add-panel">
      <p className="eyebrow">Пополняем каталог</p><h2>Добавить фильм</h2>
      <p>Заполните карточку. Фильм появится в каталоге и сохранится после перезагрузки.</p>
      <form className="form" onSubmit={submitForm}>
        <div className="two-columns">
          <label>Название<input name="title" value={form.title} onChange={changeField} required maxLength={120} /></label>
          <label>Режиссёр<input name="director" value={form.director} onChange={changeField} required maxLength={100} /></label>
          <label>Цена аренды, грн<input name="price" type="number" min="0.01" max="100000" step="0.01" value={form.price} onChange={changeField} required /></label>
          <label>Жанр<input name="genre" placeholder="Например: Драма" value={form.genre} onChange={changeField} required maxLength={40} /></label>
          <label>Год выпуска<input name="year" type="number" min="1895" max="2100" step="1" value={form.year} onChange={changeField} required /></label>
        </div>
        <label>Описание<textarea name="description" rows="4" value={form.description} onChange={changeField} required maxLength={1500} /></label>
        <label>Ссылка на постер (необязательно)<input name="image" value={form.image} onChange={changeField} placeholder="https://... или выберите файл ниже" disabled={readingImage} /></label>
        <label>Или загрузите постер до 500 КБ<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} disabled={readingImage} /></label>
        <p className="hint">Файл заменяет ссылку. Оставьте поле пустым для стандартного постера. Для внешней ссылки нужен интернет.</p>
        {readingImage && <p role="status">Читаем изображение…</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={readingImage}>Добавить в каталог</button>
      </form>
    </section>
  );
}