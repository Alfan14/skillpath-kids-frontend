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

export async function getWorksheets(searchParams?: Record<string, string | number | boolean>) {
  const url = new URL(`${API_URL}/files`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });
  
  if (!response.ok) {
    return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }

  const data = await response.json();
  return data;
}

export async function getWorksheetBySlug(slug: string) {
  const response = await fetch(`${API_URL}/files/${slug}`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data;
}

export async function getRelatedWorksheets(slug: string) {
  const response = await fetch(`${API_URL}/files/${slug}/related`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
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