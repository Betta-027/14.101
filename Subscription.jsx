import { useState } from 'react';

const plans = [
  {
    id: 'basic',
    name: 'Базовый',
    price: 99,
    duration: 30,
    features: ['Доступ к каталогу', 'Качество 720p', '1 устройство'],
  },
  {
    id: 'standard',
    name: 'Стандарт',
    price: 199,
    duration: 30,
    features: ['Доступ к каталогу', 'Качество 1080p', '2 устройства', 'Без рекламы'],
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: 349,
    duration: 30,
    features: ['Доступ к каталогу', 'Качество 4K', '4 устройства', 'Без рекламы', 'Ранний доступ'],
  },
];

export default function Subscription({ user, onTopUp, onBuyPlan }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const balance = user.balance || 0;
  const subscription = user.subscription || null;
  const isActive = subscription && new Date(subscription.until) > new Date();

  function handleTopUp(event) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return setError('Введите сумму больше 0.');
    if (value > 100000) return setError('Слишком большая сумма.');
    const message = onTopUp(value);
    if (message) return setError(message);
    setAmount('');
    setError('');
  }

  function handleBuy(plan) {
    if (balance < plan.price) {
      setError('Недостаточно средств. Пополните баланс.');
      return;
    }
    const message = onBuyPlan(plan);
    if (message) return setError(message);
    setError('');
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ваш доступ к кинотеатру</p>
          <h2>Подписка</h2>
        </div>
        <span>Баланс: {balance} грн</span>
      </div>

      <div className="balance-panel">
        <div>
          <p className="balance-label">Баланс счёта</p>
          <p className="balance-value">{balance} грн</p>
        </div>
        <form className="topup-form" onSubmit={handleTopUp}>
          <input
            type="number"
            value={amount}
            onChange={(event) => { setAmount(event.target.value); setError(''); }}
            placeholder="Сумма"
            min="1"
            max="100000"
          />
          <button type="submit">Пополнить</button>
        </form>
      </div>

      {isActive && (
        <div className="subscription-status active">
          <strong>Подписка активна</strong>
          <span>Тариф: {subscription.planName} · до {new Date(subscription.until).toLocaleDateString('ru-RU')}</span>
        </div>
      )}

      {!isActive && (
        <div className="subscription-status inactive">
          <strong>Подписка не активна</strong>
          <span>Выберите тариф и оформите подписку</span>
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      <div className="plans-grid">
        {plans.map(plan => (
          <article key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p className="plan-price">{plan.price} <span>грн / {plan.duration} дней</span></p>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => handleBuy(plan)}>Купить подписку</button>
          </article>
        ))}
      </div>

      {subscription && !isActive && (
        <p className="hint">
          Ваша прошлая подписка ({subscription.planName}) закончилась {new Date(subscription.until).toLocaleDateString('ru-RU')}.
        </p>
      )}
    </section>
  );
}