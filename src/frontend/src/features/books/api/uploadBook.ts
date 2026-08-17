import { apiRequest } from '../../../shared/api/client';

export type UploadBookResponse = {
  message: string;
  book_id: number;
  title: string;
  vector_dir: string;
};

type UploadBookParams = {
  title: string;
  isPublic: boolean;
  file: File;
};

export async function uploadBook({
  title,
  isPublic,
  file,
}: UploadBookParams): Promise<UploadBookResponse> {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('is_public', String(isPublic));
  formData.append('file', file);

  return apiRequest<UploadBookResponse>('/book/upload', {
    method: 'POST',
    body: formData,
    auth: true,
  });
}