import type { ApiErrorBody } from "./api.interface";

const API_BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

// Every failed request becomes an ApiError, so screens can check `code` (for example CIRCULAR_DEPENDENCY)
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const isApiErrorBody = (value: unknown): value is ApiErrorBody => {
  if (typeof value !== "object" || value === null || !("error" in value))
    return false;
  const error = (value as { error: unknown }).error;
  return (
    typeof error === "object" &&
    error !== null &&
    typeof (error as { code?: unknown }).code === "string" &&
    typeof (error as { message?: unknown }).message === "string"
  );
};

export const request = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const hasBody = options.body !== undefined;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? "GET",
      headers: hasBody ? { "Content-Type": "application/json" } : undefined,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Cannot reach the server. Check that the API is running.",
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorBody(data)) {
      throw new ApiError(response.status, data.error.code, data.error.message);
    }
    throw new ApiError(
      response.status,
      "UNKNOWN_ERROR",
      `Request failed with status ${response.status}`,
    );
  }

  return data as T;
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
