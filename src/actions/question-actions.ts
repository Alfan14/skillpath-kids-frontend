"use server";
import type { AssessmentQuestion } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

function mapQuestion(
  question: any
) {
  return {
    id: question.id,
    text: question.text,
    category:
      question.category,

    /*
      IMPORTANT:
      send STRING only
    */
    icon:
      question.iconName,

    color:
      question.colorClass,

    createdAt:
      question.createdAt,
  };
}

export async function getQuestions() {
  try {
    const response = await fetch(
      `${API_URL}/questions`,
      {
        cache: "no-store",
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message
      );
    }

    return data.data.map(
      mapQuestion
    );
  } catch (error) {
    console.error(error);

    return [];
  }
}

export async function createQuestion(
  payload: Partial<AssessmentQuestion>,
  token: string
) {
  const response = await fetch(
    `${API_URL}/questions`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  return response.json();
}

export async function updateQuestion(
  id: string | number,
  payload: Partial<AssessmentQuestion>,
  token: string
) {
  const response = await fetch(
    `${API_URL}/questions/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  return response.json();
}

export async function deleteQuestion(
  id: string | number,
  token: string
) {
  const response = await fetch(
    `${API_URL}/questions/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}