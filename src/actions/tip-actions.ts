"use server";
import type { Recommendation } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTips() {
  const response = await fetch(
    `${API_URL}/tips`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return (data.data || []).map((tip: any) => ({
    ...tip,
    icon: tip.icon || tip.iconName,
  }));
}

export async function createTip(
  payload: Partial<Recommendation>,
  token: string
) {
  const response = await fetch(
    `${API_URL}/tips`,
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

export async function updateTip(
  id: string | number,
  payload: Partial<Recommendation>,
  token: string
) {
  const response = await fetch(
    `${API_URL}/tips/${id}`,
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

export async function deleteTip(
  id: string | number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/tips/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}