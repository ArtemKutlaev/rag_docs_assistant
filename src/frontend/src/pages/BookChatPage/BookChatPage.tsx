import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../features/auth/AuthContext';
import { askQuestion } from '../../features/books/api/askQuestion';
import { ApiError } from '../../shared/api/client';

import styles from './BookChatPage.module.css';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

function BookChatPage() {
  const { bookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const bookTitle =
    location.state?.title || 'Книга';

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) {
      navigate('/books', {
        replace: true,
      });
    }
  }, [bookId, navigate]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || !bookId || isSending) {
      return;
    }

    const numericBookId = Number(bookId);

    if (Number.isNaN(numericBookId)) {
      setError('Некорректный идентификатор книги.');
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: trimmedQuery,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuery('');
    setError(null);
    setIsSending(true);

    try {
      const response = await askQuestion({
        query: trimmedQuery,
        bookId: numericBookId,
      });

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.result,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.status === 401
      ) {
        logout();

        navigate('/login', {
          replace: true,
        });

        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось получить ответ.',
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Назад
        </button>

        <div>
          <p className={styles.eyebrow}>
            Вопросы по книге
          </p>

          <h1 className={styles.title}>
            {bookTitle}
          </h1>
        </div>
      </header>

      <div className={styles.chat}>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                ?
              </div>

              <h2>Задайте вопрос по книге</h2>

              <p>
                Я найду подходящие фрагменты книги
                и постараюсь дать ответ на основе её
                содержания.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user'
                  ? styles.userMessage
                  : styles.assistantMessage
              }`}
            >
              <span className={styles.messageRole}>
                {message.role === 'user'
                  ? 'Вы'
                  : 'RAG Assistant'}
              </span>

              <p>{message.text}</p>
            </div>
          ))}

          {isSending && (
            <div
              className={`${styles.message} ${styles.assistantMessage}`}
            >
              <span className={styles.messageRole}>
                RAG Assistant
              </span>

              <div className={styles.typing}>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </div>

        <form
          className={styles.inputArea}
          onSubmit={handleSubmit}
        >
          <textarea
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Задайте вопрос по книге..."
            rows={1}
            disabled={isSending}
          />

          <button
            type="submit"
            disabled={!query.trim() || isSending}
            aria-label="Отправить вопрос"
          >
            →
          </button>
        </form>
      </div>
    </section>
  );
}

export default BookChatPage;