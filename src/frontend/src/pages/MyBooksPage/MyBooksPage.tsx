import styles from './MyBooksPage.module.css';

function MyBooksPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Личная библиотека</p>

        <h1 className={styles.title}>Мои книги</h1>

        <p className={styles.description}>
          Здесь будут храниться загруженные тобой книги.
        </p>
      </div>

      <div className={styles.empty}>
        <span className={styles.emptyIcon}>👤</span>

        <h2>У тебя пока нет книг</h2>

        <p>
          Добавь свою первую книгу, чтобы начать работу.
        </p>
      </div>
    </section>
  );
}

export default MyBooksPage;