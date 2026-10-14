import { useState } from 'react';

export default function LoginForm({ onLogin, notice }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  function submitForm(event) {
    event.preventDefault();
    setError(onLogin(email, password));
  }
  return (
    <form onSubmit={submitForm} className="form">
      <h2>Войти в кинотеатр</h2>
      {notice && <p className="success" role="status">{notice}</p>}
      <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" /></label>
      <label>Пароль<input type="password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit">Войти</button>
    </form>
  );
}