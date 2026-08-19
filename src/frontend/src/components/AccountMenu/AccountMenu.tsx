import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/AuthContext';
import { getMyBooks } from '../../features/books/api/getMyBooks';
import { ApiError } from '../../shared/api/client';

import styles from './AccountMenu.module.css';

function AccountMenu() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [booksCount, setBooksCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  async function handleOpen() {
    const nextIsOpen = !isOpen;

    setIsOpen(nextIsOpen);

    if (!nextIsOpen) {
      return;
    }

    try {
      setIsLoadingCount(true);

      const books = await getMyBooks();

      setBooksCount(books.length);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        logout();
        navigate('/login', { replace: true });
        return;
      }

      setBooksCount(null);
    } finally {
      setIsLoadingCount(false);
    }
  }

  function handleLogout() {
    logout();
    setIsOpen(false);

    navigate('/login', {
      replace: true,
    });
  }

  const displayName = username || 'Пользователь';

  const firstLetter = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className={styles.container}
      ref={menuRef}
    >
      <button
        className={styles.trigger}
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={styles.avatar}>
          {firstLetter}
        </span>

        <span className={styles.username}>
          {displayName}
        </span>

        <span
          className={`${styles.arrow} ${
            isOpen ? styles.arrowOpen : ''
          }`}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.menu}
          role="menu"
        >
          <div className={styles.menuHeader}>
            <span className={styles.menuAvatar}>
              {firstLetter}
            </span>

            <div>
              <strong>{displayName}</strong>

              <span>Ваш аккаунт</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.stat}>
            <span className={styles.statIcon}>📚</span>

            <span className={styles.statLabel}>
              Добавлено книг
            </span>

            <strong className={styles.statValue}>
              {isLoadingCount
                ? '...'
                : booksCount ?? '—'}
            </strong>
          </div>

          <div className={styles.divider} />

          <button
            className={styles.logout}
            type="button"
            onClick={handleLogout}
          >
            <span>↪</span>

            <span>Выйти из аккаунта</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;