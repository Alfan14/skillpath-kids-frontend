import { getToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions
  extends RequestInit {
  auth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<
    string,
    string
  > = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (options.auth && token) {
    headers[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const responseData = await response.json();

  if (!response.ok || responseData.success === false) {
    throw new Error(
      responseData.message || "API Error"
    );
  }

  return responseData.data;
}