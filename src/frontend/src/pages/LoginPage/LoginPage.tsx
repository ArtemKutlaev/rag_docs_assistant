import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { login } from '../../features/auth/api/login';
import { useAuth } from '../../features/auth/AuthContext';

import styles from './LoginPage.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setAuth } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || '/books';

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        username,
        password,
      });

      setAuth(response.access_token, response.username);

      navigate(from, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось выполнить вход',
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

          <h1>С возвращением</h1>

          <p>
            Войдите, чтобы работать со своей библиотекой.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Имя пользователя</span>

            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="Введите имя пользователя"
              required
              disabled={isSubmitting}
            />
          </label>

          <label className={styles.field}>
            <span>Пароль</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
              disabled={isSubmitting}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <Link to="/register">Зарегистрироваться</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;