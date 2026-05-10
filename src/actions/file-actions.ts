"use server";
import type { Worksheet } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFiles() {
  const response = await fetch(
    `${API_URL}/files`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return (data.data || []).map((file: any) => ({
    ...file,
    icon: file.icon || file.iconName,
  }));
}

export async function createFile(
  payload: Partial<Worksheet>,
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
  id: string | number,
  payload: Partial<Worksheet>,
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
  id: string | number,
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