const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  role: "PARENT" | "STUDENT" | "TEACHER" | "ADMINISTRATOR";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: User["role"] = "PARENT"
): Promise<User> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data.data;
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

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    if (!user || !['PARENT', 'STUDENT', 'TEACHER', 'ADMINISTRATOR'].includes(user.role)) {
      throw new Error('Invalid role');
    }
    return user;
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}
