interface Success<T> {
  data: T;
  error?: never;
}

interface Failure<E> {
  data?: never;
  error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Implements try/catch for a given promise.
 *
 * If the promise resolves, returns an object with a `data` property.
 * If the promise rejects, returns an object with an `error` property.
 *
 * @template T - the type of data returned from the promise.
 * @template E - the type of error to return. Defaults to `Error`.
 *
 * @param promise - the promise to implement try/catch for.
 *
 * @example
 * const { data, error } = await tryCatch(getData());
 *
 * if (error) {
 *   return; // handle the error
 * }
 *
 * doSomething(data); // data can now be used
 */
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

/**
 * Makes a request to the given endpoint with the given method, headers, and body.
 *
 * This overload is used for requests that do not return data.
 *
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param headers - headers to include in the request, such as authorization tokens.
 * @param body - the body of the request as an object. It will be automatically converted to JSON.
 */
async function requestEndpoint(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<void>;

/**
 * Makes a request to the given endpoint with the given method, headers, and body.
 *
 * @template T - the type of the request's response.
 *
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param headers - headers to include in the request, such as authorization tokens.
 * @param body - the body of the request as an object. It will be automatically converted to JSON.
 *
 * @returns the JSON response from the request.
 *
 * @example
 * const user = await requestEndpoint<User>(
 *   "/users/",
 *   "GET",
 *   {
 *     Authorization: `Bearer ${token}`
 *   }
 * );
 */
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

/**
 * Serves as a wrapper for `tryCatch(requestEndpoint())`.
 *
 * This function makes an API request and safely catches any errors,
 * returning either a `data` property or an `error` property.
 *
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param headers - headers to include in the request, such as authorization tokens.
 * @param body - the body of the request as an object. It will be automatically converted to JSON.
 */
export async function tryRequestEndpoint(
  endpoint: string,
  method?: string,
  headers?: HeadersInit,
  body?: object,
): Promise<Result<void>>;

/**
 * Serves as a wrapper for `tryCatch(requestEndpoint())`.
 *
 * @template T - the type of the request's response.
 * @template E - the type of error returned. Defaults to `Error`.
 *
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param headers - headers to include in the request, such as authorization tokens.
 * @param body - the body of the request as an object. It will be automatically converted to JSON.
 *
 * @returns a Result containing either the response data or an error.
 *
 * @example
 * const { data, error } = await tryRequestEndpoint<User>(
 *   "/users/",
 *   "GET",
 *   {
 *     Authorization: `Bearer ${token}`
 *   }
 * );
 *
 * if (error) {
 *   console.error(error);
 * }
 */
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
