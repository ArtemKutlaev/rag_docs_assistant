import { apiRequest } from '../../../shared/api/client';
import type { MyBook } from '../types';

export async function getMyBooks(): Promise<MyBook[]> {
  return apiRequest<MyBook[]>('/books/my', {
    auth: true,
  });
}