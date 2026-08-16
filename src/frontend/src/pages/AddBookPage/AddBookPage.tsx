import styles from './AddBookPage.module.css';

function AddBookPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Библиотека</p>

        <h1 className={styles.title}>Добавить книгу</h1>

        <p className={styles.description}>
          Загрузи книгу, чтобы использовать её в диалоге с RAG.
        </p>
      </div>

      <div className={styles.empty}>
        <span className={styles.emptyIcon}>＋</span>

        <h2>Загрузка появится здесь</h2>

        <p>
          Следующим этапом добавим настоящий загрузчик файлов.
        </p>
      </div>
    </section>
  );
}

export default AddBookPage;