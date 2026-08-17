const API_URL = 'http://127.0.0.1:8000';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function createHeaders(
  headers?: HeadersInit,
  body?: BodyInit | null,
  auth?: boolean,
) {
  const requestHeaders = new Headers(headers);

  if (
    body &&
    !(body instanceof FormData) &&
    !requestHeaders.has('Content-Type')
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = localStorage.getItem('access_token');

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  return requestHeaders;
}

async function handleError(response: Response): Promise<never> {
  const errorBody = await response.json().catch(() => null);

  throw new ApiError(
    errorBody?.detail || `Ошибка запроса: ${response.status}`,
    response.status,
  );
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: createHeaders(
      headers,
      requestOptions.body,
      auth,
    ),
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.json();
}

export async function apiBlobRequest(
  path: string,
  options: RequestOptions = {},
): Promise<Blob> {
  const { auth = false, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: createHeaders(
      headers,
      requestOptions.body,
      auth,
    ),
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.blob();
}