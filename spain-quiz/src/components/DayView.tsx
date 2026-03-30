import { useState } from 'react';
import type { DayBundle } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { ScoreSummary } from './ScoreSummary';
import { HighscoreView } from './HighscoreView';
import { useQuizState } from '../hooks/useQuizState';

interface Props {
  bundle: DayBundle;
  playerName: string;
}

export function DayView({ bundle, playerName }: Props) {
  const { isAnswered, getPoints, submitAnswer, getDayScore, getDayAnsweredCount, saveError, setSaveError } =
    useQuizState(playerName);

  const answeredCount = getDayAnsweredCount(bundle.day);
  const allDone = answeredCount >= bundle.questions.length;
  const [showHighscore, setShowHighscore] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.dayLabel}>Tag {bundle.day}</div>
          <h1 style={styles.title}>{bundle.title}</h1>
        </div>
        <button style={styles.highscoreBtn} onClick={() => setShowHighscore(v => !v)}>
          🏆
        </button>
      </div>

      <div style={styles.progress}>
        <div style={{ ...styles.progressBar, width: `${(answeredCount / bundle.questions.length) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{answeredCount} / {bundle.questions.length} beantwortet</p>

      {saveError && (
        <div style={styles.errorBanner}>
          {saveError}
          <button style={styles.errorClose} onClick={() => setSaveError(null)}>✕</button>
        </div>
      )}

      {showHighscore ? (
        <HighscoreView />
      ) : allDone ? (
        <ScoreSummary
          day={bundle.day}
          dayScore={getDayScore(bundle.day)}
          totalQuestions={bundle.questions.length}
          onShowHighscore={() => setShowHighscore(true)}
        />
      ) : (
        bundle.questions.map(q => (
          <QuestionCard
            key={q.id}
            question={q}
            answered={isAnswered(bundle.day, q.id)}
            earnedPoints={getPoints(bundle.day, q.id)}
            onAnswer={pts => submitAnswer(bundle.day, q.id, pts)}
          />
        ))
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  dayLabel: { fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' },
  title: { margin: '0.25rem 0 0', fontSize: '1.5rem', color: '#c60b1e' },
  highscoreBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '1.2rem',
  },
  progress: { height: '6px', background: '#f0f0f0', borderRadius: '3px', marginBottom: '0.25rem' },
  progressBar: { height: '100%', background: '#c60b1e', borderRadius: '3px', transition: 'width 0.3s' },
  progressText: { fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem', margin: '0 0 1.5rem' },
  errorBanner: {
    background: '#f8d7da', color: '#721c24', padding: '0.75rem 1rem',
    borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between',
  },
  errorClose: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
};
