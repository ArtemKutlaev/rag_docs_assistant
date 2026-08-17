import {
  apiBlobRequest,
} from '../../../shared/api/client';

export async function getBookForReading(
  bookId: number,
): Promise<Blob> {
  return apiBlobRequest(
    `/book/${bookId}/read`,
    {
      auth: true,
    },
  );
}

export async function getBookForDownload(
  bookId: number,
): Promise<Blob> {
  return apiBlobRequest(
    `/book/${bookId}/download`,
    {
      auth: true,
    },
  );
}