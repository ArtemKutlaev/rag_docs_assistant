import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../features/auth/api/register';

import styles from './RegisterPage.module.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (password !== passwordConfirm) {
      setError('Пароли не совпадают.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username,
        password,
        password_confirm: passwordConfirm,
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

          <p>
            Зарегистрируйтесь, чтобы создать свою библиотеку.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Имя пользователя</span>

            <input
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              placeholder="Введите пароль"
              required
              disabled={isSubmitting}
            />
          </label>

          <label className={styles.field}>
            <span>Повторите пароль</span>

            <input
              type="password"
              value={passwordConfirm}
              onChange={(event) =>
                setPasswordConfirm(event.target.value)
              }
              autoComplete="new-password"
              placeholder="Повторите пароль"
              required
              disabled={isSubmitting}
            />
          </label>

          {passwordConfirm &&
            password !== passwordConfirm && (
              <p className={styles.fieldError}>
                Пароли не совпадают.
              </p>
            )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submit}
            type="submit"
            disabled={
              isSubmitting ||
              password !== passwordConfirm
            }
          >
            {isSubmitting
              ? 'Регистрируем...'
              : 'Зарегистрироваться'}
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