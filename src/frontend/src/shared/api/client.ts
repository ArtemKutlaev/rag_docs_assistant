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

function getHeaders(
  headers?: HeadersInit,
  body?: BodyInit | null,
  auth = false,
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

function handleUnauthorized() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');

  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

async function parseError(response: Response): Promise<never> {
  let message = `Ошибка запроса: ${response.status}`;

  try {
    const errorBody = await response.json();

    if (errorBody?.detail) {
      message = errorBody.detail;
    }
  } catch {
    // Оставляем стандартное сообщение.
  }

  if (response.status === 401) {
    handleUnauthorized();
  }

  throw new ApiError(message, response.status);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: getHeaders(
      headers,
      requestOptions.body,
      auth,
    ),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json() as Promise<T>;
}

export async function apiBlobRequest(
  path: string,
  options: RequestOptions = {},
): Promise<Blob> {
  const { auth = false, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: getHeaders(
      headers,
      requestOptions.body,
      auth,
    ),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.blob();
}