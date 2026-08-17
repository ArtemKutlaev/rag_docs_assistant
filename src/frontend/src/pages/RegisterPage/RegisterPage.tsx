import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../features/auth/api/register';

import styles from './RegisterPage.module.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        username,
        password,
      });

      navigate('/login', {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось зарегистрироваться',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>RAG Assistant</p>

          <h1>Создать аккаунт</h1>

          <p>Зарегистрируйтесь, чтобы создать свою библиотеку.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Имя пользователя</span>

            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="Придумайте имя пользователя"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Пароль</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Придумайте пароль"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={styles.footer}>
          Уже есть аккаунт?{' '}
          <Link to="/login">Войти</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;