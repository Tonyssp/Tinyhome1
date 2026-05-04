const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export const API_BASE_URL =
  configuredApiUrl ?? (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | FormData | Record<string, unknown> | undefined;
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { body, headers, token, ...rest } = options;
  const resolvedHeaders = new Headers(headers);

  if (!API_BASE_URL) {
    throw new ApiError(
      "Backend API URL is not configured. Add NEXT_PUBLIC_API_URL in Vercel and redeploy the frontend.",
      0,
    );
  }

  if (token) {
    resolvedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body && !isFormData && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: resolvedHeaders,
      body:
        body && !isFormData && typeof body !== "string"
          ? JSON.stringify(body)
          : (body as BodyInit | null | undefined),
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(
      `Could not connect to backend API at ${API_BASE_URL}. Check NEXT_PUBLIC_API_URL on Vercel and CLIENT_ORIGIN on Railway.`,
      0,
      error,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "Request failed";

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
