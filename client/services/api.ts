import { ApiError, ApiSuccess } from "@shared/api";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : undefined;

  if (!res.ok) {
    const err = (body as ApiError) || { error: res.statusText };
    throw new Error(err.error || "Request failed");
  }

  return (body as ApiSuccess<T>["data"]) ?? (body as T);
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
