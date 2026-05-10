"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTips() {
  const response = await fetch(
    `${API_URL}/tips`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return data.data;
}

export async function createTip(
  payload: any,
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
  id: number,
  payload: any,
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
  id: number,
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