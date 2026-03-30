import { useState, useEffect } from 'react';
import { loadHighscores } from '../lib/supabase';
import type { PlayerScore } from '../types/quiz';

export function useHighscore() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetch() {
    setLoading(true);
    setError(null);
    try {
      const data = await loadHighscores();
      setScores(data);
    } catch {
      setError('Highscore konnte nicht geladen werden. Bitte Internetverbindung prüfen.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetch(); }, []);

  return { scores, loading, error, refresh: fetch };
}
