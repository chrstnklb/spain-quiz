import { useState } from 'react';
import type { Question } from '../types/quiz';
import { scoreMultipleChoice, scoreEstimate } from '../utils/scoring';

interface Props {
  question: Question;
  answered: boolean;
  earnedPoints: number | undefined;
  onAnswer: (points: number) => void;
}

const LEVEL_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: '★☆☆☆', color: '#4caf50' },
  2: { label: '★★☆☆', color: '#ff9800' },
  4: { label: '★★★★', color: '#c60b1e' },
};

export function QuestionCard({ question, answered, earnedPoints, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [estimateValue, setEstimateValue] = useState('');
  const [estimateError, setEstimateError] = useState('');
  const [localPoints, setLocalPoints] = useState<number | null>(null);

  const maxPoints = question.points;
  const earnedNow = answered ? (earnedPoints ?? 0) : localPoints;
  const showFeedback = answered || localPoints !== null;
  const level = LEVEL_LABEL[maxPoints] ?? { label: '★★★☆', color: '#ff9800' };

  function handleMCSelect(index: number) {
    if (answered) return;
    const pts = scoreMultipleChoice(index, (question as Extract<Question, { type: 'mc' }>).correctIndex, maxPoints);
    setSelected(index);
    setLocalPoints(pts);
    onAnswer(pts);
  }

  function handleEstimateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answered) return;
    const num = parseFloat(estimateValue.replace(',', '.'));
    if (isNaN(num)) {
      setEstimateError('Bitte eine gültige Zahl eingeben.');
      return;
    }
    const q = question as Extract<Question, { type: 'estimate' }>;
    const pts = scoreEstimate(num, q.target, q.tolerance, maxPoints);
    setEstimateError('');
    setLocalPoints(pts);
    onAnswer(pts);
  }

  const isDisabled = answered || localPoints !== null;

  return (
    <div style={styles.card}>
      <div style={styles.meta}>
        <span style={{ ...styles.level, color: level.color }}>{level.label}</span>
        <span style={styles.points}>{maxPoints} {maxPoints === 1 ? 'Punkt' : 'Punkte'}</span>
      </div>
      <p style={styles.questionText}>{question.text}</p>

      {question.type === 'mc' && (
        <div style={styles.options}>
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            let bg = '#f5f5f5';
            if (showFeedback) {
              if (isCorrect) bg = '#d4edda';
              else if (selected === i && !isCorrect) bg = '#f8d7da';
            }
            return (
              <button
                key={i}
                style={{ ...styles.option, background: bg }}
                onClick={() => handleMCSelect(i)}
                disabled={isDisabled}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'estimate' && (
        <form onSubmit={handleEstimateSubmit} style={styles.estimateForm}>
          <div style={styles.estimateRow}>
            <input
              style={styles.estimateInput}
              type="text"
              inputMode="numeric"
              placeholder="Deine Schätzung"
              value={estimateValue}
              onChange={e => setEstimateValue(e.target.value)}
              disabled={isDisabled}
            />
            {question.unit && <span style={styles.unit}>{question.unit}</span>}
          </div>
          {estimateError && <p style={styles.error}>{estimateError}</p>}
          <button style={styles.submitBtn} type="submit" disabled={isDisabled || !estimateValue}>
            Bestätigen
          </button>
          {showFeedback && (
            <p style={styles.estimateHint}>
              Korrekte Antwort: {question.target} {question.unit} (±{question.tolerance})
            </p>
          )}
        </form>
      )}

      {showFeedback && (
        <div style={{ ...styles.feedback, background: (earnedNow ?? 0) > 0 ? '#d4edda' : '#f8d7da' }}>
          {(earnedNow ?? 0) > 0
            ? `✅ Richtig! +${earnedNow} ${earnedNow === 1 ? 'Punkt' : 'Punkte'}`
            : `❌ Leider falsch. 0 Punkte`}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'white',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '1rem',
  },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  level: { fontSize: '0.85rem', fontWeight: 'bold' },
  points: { fontSize: '0.8rem', color: '#888', background: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '1rem' },
  questionText: { fontWeight: 'bold', fontSize: '1rem', margin: '0 0 1rem' },
  options: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  option: {
    padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '0.5rem',
    cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', transition: 'background 0.2s',
  },
  estimateForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  estimateRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  estimateInput: { flex: 1, padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', fontSize: '1rem' },
  unit: { color: '#666', whiteSpace: 'nowrap' },
  submitBtn: { padding: '0.6rem 1rem', background: '#c60b1e', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' },
  estimateHint: { color: '#555', fontSize: '0.9rem', margin: 0 },
  error: { color: '#c60b1e', fontSize: '0.85rem', margin: 0 },
  feedback: { marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' },
};
