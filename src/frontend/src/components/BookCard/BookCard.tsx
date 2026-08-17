import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Book } from '../../features/books/types';
import {
  getBookForDownload,
  getBookForReading,
} from '../../features/books/api/getBookFile';

import BookActionsMenu from '../BookActionsMenu/BookActionsMenu';

import styles from './BookCard.module.css';

type BookCardProps = {
  book: Book;
};

function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleRead() {
    try {
      setIsProcessing(true);

      const blob = await getBookForReading(book.id);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank', 'noopener,noreferrer');

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60_000);
    } catch (error) {
      console.error('Не удалось открыть книгу:', error);
    } finally {
      setIsProcessing(false);
      setIsMenuOpen(false);
    }
  }

  async function handleDownload() {
    try {
      setIsProcessing(true);

      const blob = await getBookForDownload(book.id);
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = `${book.title}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Не удалось скачать книгу:', error);
    } finally {
      setIsProcessing(false);
      setIsMenuOpen(false);
    }
  }

  function handleAskQuestion() {
    setIsMenuOpen(false);

    navigate(`/books/${book.id}/chat`, {
      state: {
        title: book.title,
      },
    });
  }

  function handleCardClick() {
    if (!isProcessing) {
      setIsMenuOpen(true);
    }
  }

  return (
    <>
      <article
        className={styles.card}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleCardClick();
          }
        }}
      >
        <div className={styles.content}>
          <div className={styles.meta}>
            <span
              className={`${styles.badge} ${
                book.is_public
                  ? styles.publicBadge
                  : styles.privateBadge
              }`}
            >
              {book.is_public ? 'Публичная' : 'Личная'}
            </span>
          </div>

          <h2 className={styles.title}>{book.title}</h2>
        </div>
      </article>

      {isMenuOpen && (
        <BookActionsMenu
          onRead={handleRead}
          onDownload={handleDownload}
          onAskQuestion={handleAskQuestion}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default BookCard;