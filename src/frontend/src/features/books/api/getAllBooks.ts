import { apiRequest } from '../../../shared/api/client';
import type { PublicBook } from '../types';

export async function getAllBooks(): Promise<PublicBook[]> {
  return apiRequest<PublicBook[]>('/books/all', {
    auth: true,
  });
}