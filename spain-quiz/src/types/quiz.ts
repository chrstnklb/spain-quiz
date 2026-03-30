export interface MCQuestion {
  id: string;
  type: 'mc';
  text: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface EstimateQuestion {
  id: string;
  type: 'estimate';
  text: string;
  target: number;
  tolerance: number;
  unit: string;
  points: number;
}

export type Question = MCQuestion | EstimateQuestion;

export interface DayBundle {
  day: number;
  date: string;
  title: string;
  questions: Question[];
}

export interface PlayerScore {
  player_name: string;
  total_points: number;
  answered_count: number;
}

export type VacationDay = number | 'before' | 'after';
