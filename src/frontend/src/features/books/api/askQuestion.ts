import { apiRequest } from '../../../shared/api/client';

export type AskQuestionResponse = {
  result: string;
};

type AskQuestionRequest = {
  query: string;
  bookId: number;
};

export async function askQuestion({
  query,
  bookId,
}: AskQuestionRequest): Promise<AskQuestionResponse> {
  return apiRequest<AskQuestionResponse>(
    '/chat/ask',
    {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        query,
        book_id: bookId,
      }),
    },
  );
}