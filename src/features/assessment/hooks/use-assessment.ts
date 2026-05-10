"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQuestions } from "@/actions/question-actions";

import type {
  AssessmentAnswers,
  LikertValue,
  AssessmentQuestion,
} from "@/types";

import { useSound } from "@/hooks/use-sound";

export type AssessmentStatus =
  | "idle" | "in-progress" | "submitting" | "analyzing" | "done" | "error";

export function useAssessment() {
  const router = useRouter();
  const { play } = useSound();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [status, setStatus] = useState<AssessmentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getQuestions()
      .then((data) => {
        setQuestions(data as unknown as AssessmentQuestion[]);
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
      });
  }, []);

  const totalQuestions = questions.length;
  const QUESTIONS_PER_PAGE = 3;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE) || 1;
  const [page, setPage] = useState(0);

  const questionsOnPage = questions.slice(
    page * QUESTIONS_PER_PAGE,
    page * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
  );

  const answeredOnPage =
    questionsOnPage.length > 0 &&
    questionsOnPage.every((q) => answers[q.id] !== undefined);
  const totalAnswered = Object.keys(answers).length;

  const progress =
    totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  const isLastPage = page === totalPages - 1;

  const answer = useCallback(
    (questionId: number, value: LikertValue) => {
      play("CLICK");
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    [play],
  );

  const nextPage = useCallback(() => {
    if (!answeredOnPage) return;
    play("POP");
    setPage((p) => Math.min(p + 1, totalPages - 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [answeredOnPage, play, totalPages]);

  const prevPage = useCallback(() => {
    play("POP");
    setPage((p) => Math.max(p - 1, 0));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [play]);

  const submitAssessment = useCallback(async () => {
    try {
      play("SUCCESS");
      setStatus("analyzing");
      setMessage("Analyzing your child's progress... this usually takes a moment.");
      setError(null);

      const token = localStorage.getItem("token");

      const stringAnswers = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [String(k), v])
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assess`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answers: stringAnswers,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Assessment failed");
      }
      setStatus("done");
      setMessage(null);

      sessionStorage.setItem("assessment_result", JSON.stringify(result.data));

      router.push("/results");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(null);
      setError("We couldn't save your answers. Your internet might be unstable. Please try again.");
    }
  }, [answers, play, router]);

  const reset = useCallback(() => {
    setAnswers({});
    setStatus("idle");
    setError(null);
    setPage(0);
  }, []);

  return {
    answers,
    status,
    error,
    message,
    page,
    totalPages,
    totalQuestions,
    questionsOnPage,
    answeredOnPage,
    totalAnswered,
    progress,
    isLastPage,
    isSubmitting: status === "submitting" || status === "analyzing",

    answer,
    nextPage,
    prevPage,
    submitAssessment,
    reset,
  };
}
