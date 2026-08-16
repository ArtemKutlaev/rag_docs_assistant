import styles from './CommonBooksPage.module.css';

function CommonBooksPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Библиотека</p>

        <h1 className={styles.title}>Общие книги</h1>

        <p className={styles.description}>
          Книги, доступные для работы с RAG.
        </p>
      </div>

      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📚</span>

        <h2>Книг пока нет</h2>

        <p>
          Здесь появятся книги, доступные всем пользователям.
        </p>
      </div>
    </section>
  );
}

export default CommonBooksPage;