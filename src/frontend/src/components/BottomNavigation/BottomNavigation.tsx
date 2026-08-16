import { NavLink } from 'react-router-dom';

import styles from './BottomNavigation.module.css';

function BottomNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      <NavLink
        to="/books"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon}>📚</span>
        <span>Общие книги</span>
      </NavLink>

      <NavLink
        to="/my-books"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon}>👤</span>
        <span>Мои книги</span>
      </NavLink>

      <NavLink
        to="/add-book"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon}>＋</span>
        <span>Добавить</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;