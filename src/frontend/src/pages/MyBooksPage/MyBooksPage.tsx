import { useEffect, useState } from 'react';

import BookCard from '../../components/BookCard/BookCard';
import LoadingState from '../../components/LoadingState/LoadingState';
import { getMyBooks } from '../../features/books/api/getMyBooks';
import type { Book } from '../../features/books/types';

import styles from './MyBooksPage.module.css';

function MyBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMyBooks();

        const normalizedBooks: Book[] = data.map((book) => ({
          id: book.id,
          title: book.title,
          file_path: book.file_path,
          is_public: book.is_public,
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
        <p className={styles.eyebrow}>Личная библиотека</p>

        <h1 className={styles.title}>Мои книги</h1>
      </header>

      {isLoading && (
        <LoadingState text="Загружаем твои книги..." />
      )}

      {!isLoading && error && (
        <div className={styles.empty}>
          <h2>Не удалось загрузить книги</h2>

          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className={styles.empty}>
          <h2>У тебя пока нет книг</h2>

          <p>
            Добавь свою первую книгу, чтобы начать работу.
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

export default MyBooksPage;