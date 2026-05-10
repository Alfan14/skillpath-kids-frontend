const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  role: "PARENT" | "TEACHER";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  localStorage.setItem(
    "token",
    data.data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(data.data.user)
  );

  return data.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getSession() {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  const user = localStorage.getItem("user");
  if (!user) return null;

  return JSON.parse(user);
}