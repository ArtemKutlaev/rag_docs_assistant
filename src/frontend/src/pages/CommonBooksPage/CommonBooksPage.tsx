import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BookCard from '../../components/BookCard/BookCard';
import LoadingState from '../../components/LoadingState/LoadingState';
import { useAuth } from '../../features/auth/AuthContext';
import { getAllBooks } from '../../features/books/api/getAllBooks';
import type { Book } from '../../features/books/types';
import { ApiError } from '../../shared/api/client';

import styles from './CommonBooksPage.module.css';

function CommonBooksPage() {
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

        const data = await getAllBooks();

        const normalizedBooks: Book[] = data.map((book) => ({
          id: book.id,
          title: book.title,
          file_path: book.file_path,
          is_public: true,
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