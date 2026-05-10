"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFiles() {
  const response = await fetch(
    `${API_URL}/files`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return data.data;
}

export async function createFile(
  payload: any,
  token: string
) {
  const response = await fetch(
    `${API_URL}/files`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
}

export async function updateFile(
  id: number,
  payload: any,
  token: string
) {
  const response = await fetch(
    `${API_URL}/files/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
}

export async function deleteFile(
  id: number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/files/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}