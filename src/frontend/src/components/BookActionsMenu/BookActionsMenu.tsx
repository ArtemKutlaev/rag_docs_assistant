type BookActionsMenuProps = {
  onRead: () => void;
  onDownload: () => void;
  onAskQuestion: () => void;
  onClose: () => void;
};

import styles from './BookActionsMenu.module.css';

function BookActionsMenu({
  onRead,
  onDownload,
  onAskQuestion,
  onClose,
}: BookActionsMenuProps) {
  return (
    <div
      className={styles.menu}
      role="menu"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className={styles.action}
        type="button"
        role="menuitem"
        onClick={onRead}
      >
        <span className={styles.icon}>📖</span>

        <span>Читать книгу</span>
      </button>

      <button
        className={styles.action}
        type="button"
        role="menuitem"
        onClick={onDownload}
      >
        <span className={styles.icon}>↓</span>

        <span>Скачать книгу</span>
      </button>

      <button
        className={styles.action}
        type="button"
        role="menuitem"
        onClick={onAskQuestion}
      >
        <span className={styles.icon}>💬</span>

        <span>Задать вопрос</span>
      </button>

      <button
        className={styles.close}
        type="button"
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  );
}

export default BookActionsMenu;