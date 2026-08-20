import { apiRequest } from '../../../shared/api/client';
import type {
  RegisterCredentials,
  RegisterResponse,
} from '../types';

export async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}