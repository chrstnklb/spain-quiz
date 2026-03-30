import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ScoreRow {
  player_name: string;
  day: number;
  question_id: string;
  points: number;
}

export async function saveScore(row: ScoreRow): Promise<void> {
  const { error } = await supabase.from('scores').insert(row);
  if (error) throw error;
}

export async function loadHighscores(): Promise<{ player_name: string; total_points: number }[]> {
  const { data, error } = await supabase.from('scores').select('player_name, points');
  if (error) throw error;

  const totals: Record<string, number> = {};
  for (const row of data ?? []) {
    totals[row.player_name] = (totals[row.player_name] ?? 0) + row.points;
  }

  return Object.entries(totals)
    .map(([player_name, total_points]) => ({ player_name, total_points }))
    .sort((a, b) => b.total_points - a.total_points);
}
