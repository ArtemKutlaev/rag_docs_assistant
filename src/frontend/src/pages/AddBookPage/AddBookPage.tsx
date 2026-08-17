import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadBook } from '../../features/books/api/uploadBook';

import styles from './AddBookPage.module.css';

function AddBookPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError('Выберите PDF-файл.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await uploadBook({
        title,
        isPublic,
        file,
      });

      navigate('/my-books');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось загрузить книгу',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Библиотека</p>

        <h1 className={styles.title}>Добавить книгу</h1>

        <p className={styles.description}>
          Добавьте PDF-файл в свою библиотеку.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="book-title">Название книги</label>

          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Название книги"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>PDF-файл</span>

          <label
            htmlFor="book-file"
            className={`${styles.filePicker} ${
              file ? styles.filePickerSelected : ''
            }`}
          >
            <input
              id="book-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
              }}
              disabled={isSubmitting}
            />

            <span className={styles.fileIcon}>
              {file ? '✓' : '↑'}
            </span>

            <span className={styles.fileContent}>
              <strong>
                {file ? 'Файл выбран' : 'Выберите PDF-файл'}
              </strong>

              <span>
                {file
                  ? file.name
                  : 'Нажмите здесь, чтобы открыть проводник'}
              </span>
            </span>

            <span className={styles.fileAction}>
              {file ? 'Изменить' : 'Выбрать'}
            </span>
          </label>
        </div>

        <div className={styles.accessSection}>
          <div className={styles.accessHeader}>
            <span className={styles.fieldLabel}>Доступ</span>

            <span className={styles.accessDescription}>
              Кто сможет видеть книгу
            </span>
          </div>

          <div className={styles.accessSwitch}>
            <button
              type="button"
              className={`${styles.accessOption} ${
                !isPublic ? styles.accessOptionActive : ''
              }`}
              onClick={() => setIsPublic(false)}
              disabled={isSubmitting}
            >
              <span className={styles.accessIcon}>🔒</span>

              <span>Личная</span>
            </button>

            <button
              type="button"
              className={`${styles.accessOption} ${
                isPublic ? styles.accessOptionActive : ''
              }`}
              onClick={() => setIsPublic(true)}
              disabled={isSubmitting}
            >
              <span className={styles.accessIcon}>🌐</span>

              <span>Публичная</span>
            </button>
          </div>

          <p className={styles.accessHint}>
            {isPublic
              ? 'Эта книга будет доступна другим пользователям.'
              : 'Эта книга будет видна только вам.'}
          </p>
        </div>

        {isSubmitting && (
          <div className={styles.processing}>
            <span className={styles.spinner} />

            <div>
              <strong>Обрабатываем книгу</strong>

              <p>
                Сохраняем PDF и создаём векторную базу.
                Это может занять некоторое время.
              </p>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <button
          className={styles.submit}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Обработка...' : 'Добавить книгу'}
        </button>
      </form>
    </section>
  );
}

export default AddBookPage;