import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BookCard from '../../components/BookCard/BookCard';
import LoadingState from '../../components/LoadingState/LoadingState';
import { useAuth } from '../../features/auth/AuthContext';
import { getMyBooks } from '../../features/books/api/getMyBooks';
import type { Book } from '../../features/books/types';
import { ApiError } from '../../shared/api/client';

import styles from './MyBooksPage.module.css';

function MyBooksPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          logout();
          navigate('/login', { replace: true });
          return;
        }

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
  }, [logout, navigate]);

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