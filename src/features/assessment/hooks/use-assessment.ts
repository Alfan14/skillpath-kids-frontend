"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQuestions } from "@/actions/question-actions";
import { getSession } from "@/lib/auth";

import type {
  AssessmentAnswers,
  LikertValue,
  AssessmentQuestion,
} from "@/types";

import { useSound } from "@/hooks/use-sound";

export type AssessmentStatus =
  | "idle" | "in-progress" | "submitting" | "analyzing" | "done" | "error";

interface UseAssessmentOptions {
  level?: "CHILD" | "TEACHER";
  resultPath?: string;
  selectedCategory?: string | null;
}

export function useAssessment({
  level = "CHILD",
  resultPath = "/results",
  selectedCategory = null,
}: UseAssessmentOptions = {}) {
  const router = useRouter();
  const { play } = useSound();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [status, setStatus] = useState<AssessmentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const QUESTIONS_PER_PAGE = 3;
  const [page, setPage] = useState(0);

  useEffect(() => {
    setIsLoadingQuestions(true);
    let token = null;
    try {
      token = localStorage.getItem("token");
    } catch {
      // ignore
    }

    if (!token) {
      setIsLoadingQuestions(false);
      router.push("/login");
      return;
    }

    getQuestions(level, token)
      .then((data) => {
        setQuestions(data as unknown as AssessmentQuestion[]);
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
        if (err.message?.includes("401")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      })
      .finally(() => {
        setIsLoadingQuestions(false);
      });
  }, [level, router]);

  const filteredQuestions =
    selectedCategory && selectedCategory !== "__ALL__"
      ? questions.filter((question) => (question.category?.trim() || "Umum") === selectedCategory)
      : questions;

  useEffect(() => {
    setPage(0);
  }, [selectedCategory]);

  const totalQuestions = filteredQuestions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE) || 1;

  const questionsOnPage = filteredQuestions.slice(
    page * QUESTIONS_PER_PAGE,
    page * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
  );

  const answeredOnPage =
    questionsOnPage.length > 0 &&
    questionsOnPage.every((q) => answers[q.id] !== undefined);
  const totalAnswered = filteredQuestions.filter((q) => answers[q.id] !== undefined).length;

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

  const submitAssessment = useCallback(async (childProfileId?: string) => {
    try {
      play("SUCCESS");
      setStatus("analyzing");
      setMessage("Analyzing your child's progress... this usually takes a moment.");
      setError(null);

      const token = localStorage.getItem("token");
      const user = getSession();
      const role = user?.role;

      if (!role) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      const stringAnswers = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [String(k), v])
      );

      const payload: any = { answers: stringAnswers };

      if (role === "PARENT" && childProfileId) {
        payload.childProfileId = childProfileId;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assess`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }
        if (response.status === 400) {
          throw new Error(result.message || "Validasi gagal");
        }
        if (response.status === 403) {
          throw new Error("Akses tidak diizinkan");
        }
        throw new Error(result.message || "Assessment failed");
      }
      setStatus("done");
      setMessage(null);

      sessionStorage.setItem("assessment_result", JSON.stringify(result.data));

      router.push(resultPath);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(null);
      setError(err.message || "We couldn't save your answers. Your internet might be unstable. Please try again.");
    }
  }, [answers, play, resultPath, router]);

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
    questions,
    filteredQuestions,
    isLoadingQuestions,
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
