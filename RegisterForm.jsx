import { useState } from 'react';

export default function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', repeatPassword: '' });
  const [error, setError] = useState('');
  function changeField(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setForm({ ...form, [fieldName]: fieldValue });
    setError('');
  }
  function submitForm(event) {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError('Имя должно содержать минимум 2 символа.');
    if (form.password.trim().length < 6) return setError('Пароль должен содержать минимум 6 символов, кроме пробелов по краям.');
    if (form.password !== form.repeatPassword) return setError('Пароли не совпадают.');
    const message = onRegister(form);
    setError(message);
  }
  return (
    <form onSubmit={submitForm} className="form">
      <h2>Создать аккаунт</h2>
      <label>Имя<input name="name" value={form.name} onChange={changeField} required maxLength={60} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={changeField} required maxLength={120} autoComplete="email" /></label>
      <label>Пароль<input name="password" type="password" value={form.password} onChange={changeField} required minLength={6} maxLength={100} autoComplete="new-password" /></label>
      <label>Повторите пароль<input name="repeatPassword" type="password" value={form.repeatPassword} onChange={changeField} required autoComplete="new-password" /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}