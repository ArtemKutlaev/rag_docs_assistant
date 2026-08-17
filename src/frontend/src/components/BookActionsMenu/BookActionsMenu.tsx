import styles from './BookActionsMenu.module.css';

type BookActionsMenuProps = {
  onRead: () => void;
  onDownload: () => void;
  onAskQuestion: () => void;
  onClose: () => void;
};

function BookActionsMenu({
  onRead,
  onDownload,
  onAskQuestion,
  onClose,
}: BookActionsMenuProps) {
  return (
    <>
      <button
        className={styles.overlay}
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
      />

      <div className={styles.menu}>
        <button
          className={styles.action}
          type="button"
          onClick={onRead}
        >
          <span className={styles.icon}>📖</span>
          <span>Читать книгу</span>
        </button>

        <button
          className={styles.action}
          type="button"
          onClick={onDownload}
        >
          <span className={styles.icon}>↓</span>
          <span>Скачать книгу</span>
        </button>

        <button
          className={styles.action}
          type="button"
          onClick={onAskQuestion}
        >
          <span className={styles.icon}>💬</span>
          <span>Задать вопрос</span>
        </button>
      </div>
    </>
  );
}

export default BookActionsMenu;