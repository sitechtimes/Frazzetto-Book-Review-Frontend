interface Success<T> {
  data: T;
  error?: never;
}

interface Failure<E> {
  data?: never;
  error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    return { error: error as E };
  }
}

async function requestEndpoint(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<void>;

async function requestEndpoint<T>(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<T>;

async function requestEndpoint<T>(
  endpoint: string,
  method = "GET",
  headers: HeadersInit = {},
  body?: object,
): Promise<T | void> {
  const config = useRuntimeConfig();
  const baseUrl = config.public.backend;

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(baseUrl + endpoint, options);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return await res.json();
}

export async function tryRequestEndpoint(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<Result<void>>;

export async function tryRequestEndpoint<T, E = Error>(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<Result<T, E>>;

export async function tryRequestEndpoint<T, E = Error>(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<Result<T | void, E>> {
  return tryCatch<T, E>(requestEndpoint<T>(endpoint, method, headers, body));
}
