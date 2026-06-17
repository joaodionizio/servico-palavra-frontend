const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const CSRF_ENDPOINT = "/api/auth/csrf";
const CSRF_HEADER = "X-CSRF-TOKEN";

export type ApiOptions = RequestInit;

type RequestOptions = ApiOptions & {
  responseType?: "json" | "text";
  retryCsrf?: boolean;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string | null;
  error?: string | null;
  errors?: string[] | null;
  title?: string | null;
};

type CsrfPayload = {
  token?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

function isWriteMethod(method?: string) {
  const normalizedMethod = (method ?? "GET").toUpperCase();
  return !["GET", "HEAD", "OPTIONS"].includes(normalizedMethod);
}

function getErrorMessage(data: ApiEnvelope<unknown>) {
  return data.message ?? data.error ?? data.title ?? data.errors?.join(" ") ?? null;
}

function isCsrfError(message: string) {
  return message.toLowerCase().includes("csrf");
}

async function fetchCsrfToken() {
  const response = await fetch(`${API_URL}${CSRF_ENDPOINT}`, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new ApiError("Nao foi possivel preparar a seguranca da requisicao.", response.status);
  }

  const data = (await response.json()) as ApiEnvelope<CsrfPayload> & CsrfPayload;
  const token = data.data?.token ?? data.token;

  if (!token) {
    throw new ApiError("Token CSRF nao retornado pela API.", response.status);
  }

  return token;
}

async function getCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  csrfTokenRequest ??= fetchCsrfToken()
    .then((token) => {
      csrfToken = token;
      return token;
    })
    .finally(() => {
      csrfTokenRequest = null;
    });

  return csrfTokenRequest;
}

async function prepareHeaders(options: RequestInit) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (isWriteMethod(options.method)) {
    headers.set(CSRF_HEADER, await getCsrfToken());
  }

  return headers;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { responseType = "json", retryCsrf = true, ...requestOptions } = options;
  const headers = await prepareHeaders(requestOptions);

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
    cache: "no-store",
    credentials: "include"
  });

  if (!response.ok) {
    let message = "Nao foi possivel concluir a solicitacao. Tente novamente.";

    try {
      const data = (await response.json()) as ApiEnvelope<unknown>;
      message = getErrorMessage(data) ?? message;
    } catch {
      if (response.status >= 500) {
        message = "A API esta temporariamente indisponivel.";
      }
    }

    if (retryCsrf && isWriteMethod(requestOptions.method) && isCsrfError(message)) {
      csrfToken = null;
      return request<T>(path, { ...requestOptions, responseType, retryCsrf: false });
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (responseType === "text") {
    return response.text() as Promise<T>;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: "GET" }),
  getText: (path: string, options?: ApiOptions) => request<string>(path, { ...options, method: "GET", responseType: "text" }),
  post: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: "DELETE" })
};

export { API_URL };
