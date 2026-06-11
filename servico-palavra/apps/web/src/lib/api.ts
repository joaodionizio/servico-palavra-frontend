const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type ApiOptions = RequestInit;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
    credentials: "include"
  });

  if (!response.ok) {
    let message = "Nao foi possivel concluir a solicitacao. Tente novamente.";

    try {
      const data = (await response.json()) as { message?: string; error?: string; title?: string };
      message = data.message ?? data.error ?? data.title ?? message;
    } catch {
      if (response.status >= 500) {
        message = "A API esta temporariamente indisponivel.";
      }
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T, B = unknown>(path: string, body?: B, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: "DELETE" })
};

export { API_URL };
