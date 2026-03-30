import { useState } from 'react';
import { saveScore } from '../lib/supabase';

const STORAGE_KEY = 'spain_quiz_answers';

interface AnswerMap {
  [day: number]: {
    [questionId: string]: { points: number };
  };
}

function loadAnswers(): AnswerMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useQuizState(playerName: string) {
  const [answers, setAnswers] = useState<AnswerMap>(loadAnswers);
  const [saveError, setSaveError] = useState<string | null>(null);

  function isAnswered(day: number, questionId: string): boolean {
    return !!answers[day]?.[questionId];
  }

  function getPoints(day: number, questionId: string): number | undefined {
    return answers[day]?.[questionId]?.points;
  }

  async function submitAnswer(day: number, questionId: string, points: number): Promise<void> {
    setSaveError(null);

    const updated: AnswerMap = {
      ...answers,
      [day]: {
        ...answers[day],
        [questionId]: { points },
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAnswers(updated);

    try {
      await saveScore({ player_name: playerName, day, question_id: questionId, points });
    } catch {
      setSaveError('Punkte konnten nicht gespeichert werden. Bitte Internetverbindung prüfen.');
    }
  }

  function getDayScore(day: number): number {
    return Object.values(answers[day] ?? {}).reduce((sum, a) => sum + a.points, 0);
  }

  function getDayAnsweredCount(day: number): number {
    return Object.keys(answers[day] ?? {}).length;
  }

  return { isAnswered, getPoints, submitAnswer, getDayScore, getDayAnsweredCount, saveError, setSaveError };
}
