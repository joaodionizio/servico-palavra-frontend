const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

// Production requests must stay on the Vercel origin so HttpOnly cookies are
// first-party. A direct Render URL here would reintroduce the mobile CSRF issue.
const API_URL =
  process.env.NODE_ENV === "production"
    ? configuredApiUrl?.startsWith("/")
      ? configuredApiUrl
      : "/api/backend"
    : configuredApiUrl ?? "http://localhost:5000";
const CSRF_ENDPOINT = "/api/auth/csrf";
const CSRF_HEADER = "X-CSRF-TOKEN";

export function normalizeApiPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isSameOriginProxy = API_URL.replace(/\/+$/, "") === "/api/backend";

  if (isSameOriginProxy && normalizedPath.startsWith("/api/")) {
    return normalizedPath.slice("/api".length);
  }

  return normalizedPath;
}

function getApiUrl(path: string) {
  return `${API_URL.replace(/\/+$/, "")}${normalizeApiPath(path)}`;
}

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
  errors?: string[] | Record<string, string[]> | null;
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

function hasRequestBody(options: RequestInit) {
  return options.body !== undefined && options.body !== null;
}

function getErrorMessage(data: ApiEnvelope<unknown>) {
  if (Array.isArray(data.errors)) {
    return data.errors.join(" ");
  }

  if (data.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().join(" ");
  }

  if (data.message ?? data.error ?? data.title) {
    return data.message ?? data.error ?? data.title;
  }

  return null;
}

function isCsrfError(message: string) {
  return message.toLowerCase().includes("csrf");
}

async function fetchCsrfToken() {
  const response = await fetch(getApiUrl(CSRF_ENDPOINT), {
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

  if (hasRequestBody(options) && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
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

  const response = await fetch(getApiUrl(path), {
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
    request<T>(path, { ...options, method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PUT", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: "DELETE" })
};

export { API_URL };
