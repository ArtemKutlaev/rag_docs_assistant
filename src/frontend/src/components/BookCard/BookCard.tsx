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

const CATEGORY_LABELS: Record<string, string> = {
  PER: 'Люди',
  ORG: 'Организации',
  LOC: 'Места',
};

function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const tagGroups = book.tags
    ? Object.entries(book.tags).filter(
        ([, tags]) => tags && tags.length > 0,
      )
    : [];

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
      setIsMenuOpen((current) => !current);
    }
  }

  return (
    <div className={styles.wrapper}>
      <article
        className={styles.card}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
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

          {tagGroups.length > 0 && (
            <div className={styles.tags}>
              {tagGroups.map(([category, tags]) => (
                <div
                  className={styles.tagGroup}
                  key={category}
                >
                  <span className={styles.tagLabel}>
                    {CATEGORY_LABELS[category] ?? category}:
                  </span>

                  <div className={styles.tagList}>
                    {tags?.map((tag) => (
                      <span
                        className={styles.tag}
                        key={`${category}-${tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tagGroups.length === 0 && (
            <span className={styles.noTags}>
              Теги не найдены
            </span>
          )}

          <span className={styles.hint}>
            Нажмите, чтобы открыть действия
          </span>
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
    </div>
  );
}

export default BookCard;