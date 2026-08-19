import { useEffect, useState } from 'react';

import BookCard from '../../components/BookCard/BookCard';
import LoadingState from '../../components/LoadingState/LoadingState';
import { getAllBooks } from '../../features/books/api/getAllBooks';
import type { Book } from '../../features/books/types';

import styles from './CommonBooksPage.module.css';

function CommonBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getAllBooks();

        const normalizedBooks: Book[] = data.map((book) => ({
          id: book.id,
          title: book.title,
          file_path: book.file_path,
          is_public: true,
        }));

        setBooks(normalizedBooks);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Не удалось загрузить книги',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Библиотека</p>

        <h1 className={styles.title}>Общие книги</h1>
      </header>

      {isLoading && (
        <LoadingState text="Загружаем книги..." />
      )}

      {!isLoading && error && (
        <div className={styles.empty}>
          <h2>Не удалось загрузить книги</h2>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className={styles.empty}>
          <h2>Общих книг пока нет</h2>

          <p>
            Здесь появятся книги, доступные всем пользователям.
          </p>
        </div>
      )}

      {!isLoading && !error && books.length > 0 && (
        <div className={styles.grid}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CommonBooksPage;